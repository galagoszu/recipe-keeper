import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, User } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/lib/auth";
import appIcon from "@/assets/grimorio-icon.png.asset.json";

export function ConnectionBadge() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (online) return null;
  return (
    <p className="rounded-lg bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
      Sin conexión — puedes seguir leyendo lo ya sincronizado
    </p>
  );
}

export function AppShell({
  title,
  subtitle,
  back,
  action,
  children,
}: {
  title: string;
  subtitle?: string | undefined;
  back?: boolean;
  action?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="page flex items-center gap-3 py-3 pb-3">
          {back ? (
            <button
              type="button"
              aria-label="Volver"
              onClick={() => navigate({ to: "/" })}
              className="-ml-1 grid size-10 shrink-0 place-items-center rounded-full text-ink hover:bg-secondary"
            >
              <ArrowLeft className="size-5" />
            </button>
          ) : (
            <BrandMark className="size-9 shrink-0" label="Grimorio Dev" />
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold">{title}</h1>
            {subtitle ? (
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {action ??
            (profile ? (
              <Link
                to="/perfil"
                aria-label="Perfil"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-ink hover:bg-accent"
              >
                <User className="size-5" />
              </Link>
            ) : null)}
        </div>
      </header>
      <main className="page pt-4">{children}</main>
      <footer className="page pb-8 pt-4 text-center text-[11px] text-muted-foreground">
        Grimorio Dev · Desarrollado por ArkanDev
      </footer>
    </div>
  );
}
