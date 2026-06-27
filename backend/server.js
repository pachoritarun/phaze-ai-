require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { Cashfree, CFEnvironment } = require('cashfree-pg');
const { initDB, getPool } = require('./db');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Setup Cashfree
const cashfree = new Cashfree(
  process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  process.env.CASHFREE_CLIENT_ID || 'dummy_client_id',
  process.env.CASHFREE_CLIENT_SECRET || 'dummy_client_secret'
);

// 1. Create Order Route
app.post('/api/create-order', async (req, res) => {
  try {
    const { name, email, phone, ticket_type, amount, returnUrl } = req.body;
    
    // Generate a unique order ID
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Create Cashfree Order
    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_phone: phone.replace(/[^0-9]/g, '').slice(-10),
        customer_name: name,
        customer_email: email
      },
      order_meta: {
        // Cashfree PRODUCTION strictly demands https://. 
        // We will replace http://localhost with https://localhost just to satisfy the API validation.
        // For actual redirects, the user will have to use UPI QR or Credit Card which don't redirect locally.
        return_url: (returnUrl || "http://localhost:8080/payment/status?order_id={order_id}").replace('{order_id}', orderId).replace('http://localhost', 'https://localhost')
      }
    };

    const response = await cashfree.PGCreateOrder(request);
    const paymentSessionId = response.data.payment_session_id;

    // Save to database
    const pool = getPool();
    await pool.query(
      `INSERT INTO registrations (order_id, name, email, phone, ticket_type, amount, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`,
      [orderId, name, email, phone, ticket_type, amount]
    );

    res.json({ orderId, paymentSessionId });
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// 2. Verify Payment Route
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { orderId } = req.body;
    const pool = getPool();

    // Check if already paid in DB to prevent duplicate calls and emails
    const [existing] = await pool.query(`SELECT status FROM registrations WHERE order_id = ?`, [orderId]);
    if (existing.length > 0 && existing[0].status === 'PAID') {
      return res.json({ status: 'PAID' });
    }

    let response;
    try {
      response = await cashfree.PGOrderFetchPayments(orderId);
    } catch (apiError) {
      // If Cashfree API fails (e.g., rate limit from concurrent frontend requests),
      // check the DB one more time in case the concurrent request succeeded!
      // Wait 1.5 seconds to give the concurrent request time to finish its UPDATE
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const [retryExisting] = await pool.query(`SELECT status FROM registrations WHERE order_id = ?`, [orderId]);
      if (retryExisting.length > 0 && retryExisting[0].status === 'PAID') {
        return res.json({ status: 'PAID' });
      }
      throw apiError; // Re-throw if it wasn't a concurrency issue
    }
    
    console.log(`Cashfree payments for order ${orderId}:`, JSON.stringify(response.data, null, 2));
    
    // Check if any payment is successful
    const isPaid = response.data.some(payment => payment.payment_status === 'SUCCESS');
    const isPending = response.data.length === 0 || response.data.some(payment => payment.payment_status === 'PENDING');
    
    if (isPaid) {
      await pool.query(`UPDATE registrations SET status = 'PAID' WHERE order_id = ?`, [orderId]);
      
      // Fetch user details to send email
      const [rows] = await pool.query(`SELECT * FROM registrations WHERE order_id = ?`, [orderId]);
      if (rows.length > 0) {
        const user = rows[0];
        
        // Setup Nodemailer
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Phaze AI" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Registration Confirmed - Phaze AI Workshop",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
              <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Phaze AI Workshop</h1>
              </div>
              <div style="padding: 20px; background-color: #f9f9f9;">
                <h2 style="color: #333; margin-top: 0;">Payment Successful!</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">Hi <strong>${user.name}</strong>,</p>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">Your payment of ₹${user.amount} for <strong>${user.ticket_type}</strong> has been received successfully. Your seat is now reserved for the upcoming workshop at JECRC University.</p>
                
                <div style="background-color: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #000;">Order Details</h3>
                  <p style="margin: 5px 0; color: #555;"><strong>Order ID:</strong> ${user.order_id}</p>
                  <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${user.email}</p>
                  <p style="margin: 5px 0; color: #555;"><strong>Phone:</strong> ${user.phone}</p>
                </div>
                
                <p style="color: #555; font-size: 16px; line-height: 1.5;">We look forward to seeing you there!</p>
                <p style="color: #555; font-size: 14px; margin-top: 30px;">Best regards,<br/>Phaze AI Team</p>
              </div>
            </div>
          `,
        };

        transporter.sendMail(mailOptions).catch(err => console.error("Error sending email:", err));
      }

      res.json({ status: 'PAID' });
    } else if (isPending) {
      console.log(`Payment is pending for order ${orderId}`);
      res.json({ status: 'PENDING' });
    } else {
      console.log(`Payment failed for order ${orderId}`);
      await pool.query(`UPDATE registrations SET status = 'FAILED' WHERE order_id = ?`, [orderId]);
      res.json({ status: 'FAILED' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// 3. Get all registrations (For Admin Viewer)
app.get('/api/registrations', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || auth !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM registrations ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// 4. Delete registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || auth !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const pool = getPool();
    await pool.query('DELETE FROM registrations WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ error: 'Failed to delete registration' });
  }
});

// Initialize DB and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server due to DB error', err);
});
