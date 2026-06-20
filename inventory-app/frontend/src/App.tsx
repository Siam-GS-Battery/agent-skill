import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./lib/auth";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Items } from "./pages/Items";
import { Movements } from "./pages/Movements";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function Nav() {
  const { user, logout } = useAuth();
  const link = "px-3 py-1.5 text-sm rounded-full transition";
  const active = ({ isActive }: { isActive: boolean }) =>
    `${link} ${isActive ? "bg-action text-white" : "text-ink hover:bg-parchment"}`;
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-hairline bg-white/90 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-1">
        <span className="mr-3 font-bold tracking-tight">GS Battery</span>
        <NavLink to="/" end className={active}>Dashboard</NavLink>
        <NavLink to="/items" className={active}>Items</NavLink>
        <NavLink to="/movements" className={active}>Movements</NavLink>
      </div>
      <div className="flex items-center gap-3 text-sm text-ink-muted">
        <span className="hidden sm:inline">{user?.name} · {user?.role}</span>
        <button onClick={logout} className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white active:scale-95">Sign out</button>
      </div>
    </header>
  );
}

function Shell({ children }: { children: JSX.Element }) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-8">{children}</main>
    </>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Shell><Dashboard /></Shell></RequireAuth>} />
      <Route path="/items" element={<RequireAuth><Shell><Items /></Shell></RequireAuth>} />
      <Route path="/movements" element={<RequireAuth><Shell><Movements /></Shell></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
