import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/thank-you")({
  component: ThankYouPage,
});

function ThankYouPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-sans">
      <div 
        className={`max-w-md w-full bg-background rounded-2xl shadow-sm border border-border p-8 text-center transition-all duration-700 ease-out transform ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="py-8 flex flex-col items-center">
          <div className="h-20 w-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
          </div>
          
          <h2 className="text-3xl font-bold font-display mb-3 text-foreground">
            Payment Successful!
          </h2>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Your seat is officially reserved. We've sent a confirmation receipt to your email address.
          </p>

          <Link
            to="/"
            className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-4 text-sm font-semibold text-background transition hover:opacity-90"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
