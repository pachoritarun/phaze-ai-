// =====================================================================
// Razorpay integration — HANDOFF FILE FOR PAYMENT TEAM
// =====================================================================
// The landing page collects { name, email, phone, ticket } from the user
// and calls `initiateRazorpayPayment` below. Everything inside this file
// is a placeholder — the payment team should implement it end-to-end.
//
// Recommended flow (Razorpay Standard Checkout):
//   1. POST registrant + ticket to your backend (e.g. a TanStack server
//      function or your own API). Backend calls Razorpay Orders API
//      (https://razorpay.com/docs/api/orders/) using RAZORPAY_KEY_SECRET
//      and returns { orderId, amount, currency, key }.
//   2. Load the Razorpay checkout script (https://checkout.razorpay.com/v1/checkout.js)
//      and open `new window.Razorpay(options).open()` with prefilled
//      name/email/contact, the orderId, and a `handler` callback.
//   3. In `handler`, POST { razorpay_order_id, razorpay_payment_id,
//      razorpay_signature } back to your backend to verify the HMAC
//      signature before marking the registration paid.
//
// Ticket → amount mapping (in paise, Razorpay expects paise not rupees):
export const TICKETS = {
  session1: { label: "Session 1 — AI for Business", amountPaise: 199900 },
  session2: { label: "Session 2 — AI for Content & Social", amountPaise: 199900 },
  combined: { label: "Both sessions (Combined)", amountPaise: 299900 },
} as const;

export type TicketId = keyof typeof TICKETS;

export type Registrant = {
  name: string;
  email: string;
  phone: string;
  ticket: TicketId;
};

/**
 * TODO(payments-team): Replace this stub with the real Razorpay flow.
 * Inputs are already validated (zod) before this is called.
 */
export async function initiateRazorpayPayment(registrant: Registrant): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("[razorpay] initiate", registrant, TICKETS[registrant.ticket]);
  // Placeholder so the UI is testable end-to-end until backend is wired.
  await new Promise((r) => setTimeout(r, 600));
}
