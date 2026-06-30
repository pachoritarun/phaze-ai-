import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/thank-you")({
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-background rounded-2xl shadow-sm border border-border p-8 text-center">
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
      </div>
    </div>
  );
}
