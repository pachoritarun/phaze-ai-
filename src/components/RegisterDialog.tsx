import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { initiateCashfreePayment, TICKETS, type TicketId } from "@/lib/cashfree";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,14}$/, "Enter a valid phone number"),
});

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

export type OpenRegisterDetail = { ticket: TicketId };

export function openRegister(ticket: TicketId = "combined") {
  window.dispatchEvent(
    new CustomEvent<OpenRegisterDetail>("open-register", { detail: { ticket } }),
  );
}

export function RegisterDialog() {
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState<TicketId>("combined");
  const [values, setValues] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<OpenRegisterDetail>).detail;
      if (detail?.ticket) setTicket(detail.ticket);
      setErrors({});
      setOpen(true);
    };
    window.addEventListener("open-register", handler);
    return () => window.removeEventListener("open-register", handler);
  }, []);

  const setField = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const success = await initiateCashfreePayment({ ...parsed.data, ticket });
      if (success) {
        // Redirect manually since Cashfree modal won't redirect the main page for some payment methods
        window.location.href = "/payment/status";
      } else {
        alert("Payment failed or was cancelled. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const t = TICKETS[ticket];
  const amount = t.amountINR.toLocaleString("en-IN");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl max-h-[90vh] overflow-y-auto w-[95vw]">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl">
            Reserve your seat
          </DialogTitle>
          <DialogDescription>
            Workshop on Sat, 18 July · JECRC University, Jaipur
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 rounded-xl border border-border bg-surface p-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Ticket</div>
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <div className="font-display text-base font-semibold">{t.label}</div>
            <div className="font-display text-lg font-bold">₹{amount}</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(TICKETS) as TicketId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTicket(id)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  ticket === id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {id === "combined" ? "Combined" : id === "session1" ? "Session 1" : "Session 2"}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-3" noValidate>
          <Field label="Full name" error={errors.name}>
            <input
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={setField("name")}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
              placeholder="Your name"
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={setField("email")}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={setField("phone")}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
              placeholder="+91 98765 43210"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Processing Payment…" : `Pay ₹${amount} with Cashfree →`}
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Secure payment via Cashfree. Seats are non-refundable.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
