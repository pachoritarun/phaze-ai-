import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";

export const Route = createFileRoute("/payment/status")({
  component: PaymentStatus,
});

function PaymentStatus() {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  
  const hasVerified = useRef(false);
  
  useEffect(() => {
    if (hasVerified.current) return;
    
    // Extract order_id from URL query params
    // Extract order_id from URL query params, or fallback to localStorage if Cashfree stripped it
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id") || localStorage.getItem("current_cashfree_order");

    if (!orderId) {
      setStatus("failed");
      return;
    }

    const API_URL = `http://${window.location.hostname}:5000`;
    let pollCount = 0;
    const maxPolls = 10;
    let timeoutId: NodeJS.Timeout;

    const verify = () => {
      fetch(`${API_URL}/api/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "PAID") {
            setStatus("success");
          } else if (data.status === "PENDING" && pollCount < maxPolls) {
            pollCount++;
            timeoutId = setTimeout(verify, 2000);
          } else {
            setStatus("failed");
          }
        })
        .catch((err) => {
          console.error("Verification error:", err);
          setStatus("failed");
        });
    };

    hasVerified.current = true;
    verify();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-background rounded-2xl shadow-sm border border-border p-8 text-center">
        {status === "loading" && (
          <div className="py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-foreground border-r-transparent mb-4"></div>
            <h2 className="text-xl font-bold font-display">Verifying Payment...</h2>
            <p className="text-muted-foreground mt-2">Please do not close this window.</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-8 flex flex-col items-center">
            <div className="h-20 w-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold font-display mb-3">Payment Successful!</h2>
            <p className="text-muted-foreground mb-8">
              Your seat is officially reserved. We've sent a confirmation receipt to your email address.
            </p>
            <Link
              to="/"
              className="w-full inline-block rounded-xl bg-foreground px-6 py-4 text-sm font-semibold text-background transition hover:opacity-90"
            >
              Return to Homepage
            </Link>
          </div>
        )}

        {status === "failed" && (
          <div className="py-8 flex flex-col items-center">
            <div className="h-20 w-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold font-display mb-3">Payment Failed</h2>
            <p className="text-muted-foreground mb-8">
              We couldn't verify your payment. If money was deducted, it will be refunded automatically.
            </p>
            <Link
              to="/"
              className="w-full inline-block rounded-xl border border-border px-6 py-4 text-sm font-semibold transition hover:bg-muted"
            >
              Try Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
