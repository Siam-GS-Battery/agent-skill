import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-hairline bg-white p-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink">GS Battery Inventory</h1>
        <p className="mt-1 text-sm text-ink-muted">Sign in to manage stock.</p>
        <div className="mt-6 space-y-4">
          <Input label="Email" name="email" type="email" autoComplete="username"
                 value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" name="password" type="password" autoComplete="current-password"
                 value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-danger" role="alert">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </div>
        <p className="mt-6 text-xs text-ink-muted">Demo: admin@gsbattery.co.th / admin123</p>
      </form>
    </main>
  );
}
