import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, CalendarDays, MailCheck } from "lucide-react";
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none opacity-50 animate-pulse"></div>
      
      <div 
        className={`max-w-lg w-full relative z-10 transition-all duration-1000 ease-out transform ${
          mounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
        }`}
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-center relative overflow-hidden">
          {/* Subtle grid pattern inside card */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Icon */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-green-500 blur-xl opacity-40 rounded-full animate-pulse"></div>
              <div className="h-24 w-24 bg-gradient-to-tr from-green-600 to-green-400 text-white rounded-full flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-500">
                <CheckCircle2 className="w-12 h-12" strokeWidth={2.5} />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold font-display mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Payment Confirmed
            </h2>
            
            <p className="text-gray-400 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
              Your seat at the JECRC AI Workshop is officially secured. We can't wait to see you there!
            </p>

            {/* Receipt Details Box */}
            <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 mb-10 text-left backdrop-blur-sm">
              <div className="flex items-center gap-4 text-gray-300 mb-4">
                <MailCheck className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Receipt sent to your email</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <CalendarDays className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Mark your calendar for 18th July</span>
              </div>
            </div>

            {/* Actions */}
            <Link
              to="/"
              className="group relative w-full inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-base font-bold rounded-full overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10">Return to Homepage</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
