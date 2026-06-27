import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Registration = {
  id: number;
  order_id: string;
  name: string;
  email: string;
  phone: string;
  ticket_type: string;
  amount: number;
  status: string;
  created_at: string;
};

function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const API_URL = import.meta.env.PROD ? "/sessions-api" : `http://${window.location.hostname}:5050`;
    fetch(`${API_URL}/api/registrations`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen grid place-items-center bg-surface p-6 font-sans">
        <form onSubmit={(e) => {
          e.preventDefault();
          // Extremely basic client-side protection for demo purposes
          if (password === "admin123") setIsAuthenticated(true);
          else alert("Incorrect password");
        }} className="bg-background p-8 rounded-xl shadow-sm border border-border w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 font-display">Admin Login</h2>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border bg-background px-4 py-3 rounded-lg mb-4 outline-none focus:border-foreground"
            placeholder="Enter password"
          />
          <button type="submit" className="w-full bg-foreground text-background py-3 rounded-lg font-medium transition hover:opacity-90">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 font-sans">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl font-bold mb-6">Registrations</h1>
        
        <div className="overflow-x-auto rounded-xl border border-border bg-background shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-elevated text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Loading...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No registrations found.</td>
                </tr>
              ) : (
                data.map((reg) => (
                  <tr key={reg.id} className="transition-colors hover:bg-surface/50">
                    <td className="px-4 py-3 font-medium text-foreground">{reg.name}</td>
                    <td className="px-4 py-3">
                      <div>{reg.email}</div>
                      <div className="text-xs text-muted-foreground">{reg.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-foreground/10 px-2 py-1 text-xs font-medium">
                        {reg.ticket_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">₹{reg.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        reg.status === 'PAID' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                        reg.status === 'FAILED' ? 'bg-red-500/20 text-red-700 dark:text-red-400' :
                        'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(reg.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
