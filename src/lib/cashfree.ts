// Ticket → amount mapping (in INR)
export const TICKETS = {
  session1: { label: "Session 1 — AI for Business", amountINR: 1 },
  session2: { label: "Session 2 — AI for Content & Social", amountINR: 1 },
  combined: { label: "Both sessions (Combined)", amountINR: 1 },
} as const;

export type TicketId = keyof typeof TICKETS;

export type Registrant = {
  name: string;
  email: string;
  phone: string;
  ticket: TicketId;
};

// Cashfree Web SDK
let cashfreePromise: Promise<any> | null = null;
export const getCashfree = () => {
  if (!cashfreePromise) {
    cashfreePromise = (async () => {
      // @ts-ignore
      const { load } = await import('@cashfreepayments/cashfree-js');
      return await load({
        mode: "production", // Changed to production
      });
    })();
  }
  return cashfreePromise;
};

export async function initiateCashfreePayment(
  registrant: Registrant,
  onReady?: () => void
): Promise<boolean> {
  const amount = TICKETS[registrant.ticket].amountINR;
  const API_URL = import.meta.env.PROD ? "/sessions-api" : `http://${window.location.hostname}:5050`;

  try {
    // 1. Create order on our backend
    const basePath = import.meta.env.BASE_URL; // will be "/sessions/"
    const returnUrl = `${window.location.origin}${basePath}payment/status?order_id={order_id}`;
    
    const res = await fetch(`${API_URL}/api/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...registrant, ticket_type: registrant.ticket, amount, returnUrl }),
    });

    if (!res.ok) {
      throw new Error("Failed to create order");
    }

    const data = await res.json();
    const { paymentSessionId, orderId } = data;
    
    // Save orderId to localStorage as a bulletproof fallback in case Cashfree strips URL params during redirect
    localStorage.setItem("current_cashfree_order", orderId);

    // 2. Open Cashfree SDK checkout
    const cf = await getCashfree();
    
    // We open the checkout
    let checkoutOptions = {
      paymentSessionId: paymentSessionId,
      redirectTarget: "_self", // Redirect entirely to Cashfree to prevent any UI conflicts or freezing
    };
    
    if (onReady) onReady();
    
    // Wrap checkout in a promise
    return new Promise((resolve) => {
      cf.checkout(checkoutOptions).then((result: any) => {
        if(result.error){
            console.error("User closed the popup or error occurred", result.error);
            resolve(false);
        }
        if(result.redirect){
            console.log("Payment will be redirected");
            resolve(false);
        }
        if(result.paymentDetails){
            console.log("Payment has been completed", result.paymentDetails);
            
            // Verify with backend with polling for PENDING state
            let pollCount = 0;
            const maxPolls = 10;
            
            const verify = () => {
              fetch(`${API_URL}/api/verify-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: orderId })
              })
              .then(res => res.json())
              .then(verifyData => {
                if (verifyData.status === 'PAID') {
                  resolve(true);
                } else if (verifyData.status === 'PENDING' && pollCount < maxPolls) {
                  pollCount++;
                  setTimeout(verify, 2000);
                } else {
                  resolve(false);
                }
              })
              .catch(() => resolve(false));
            };
            
            verify();
        }
      });
    });

  } catch (error) {
    console.error("Payment initiation error", error);
    return false;
  }
}
