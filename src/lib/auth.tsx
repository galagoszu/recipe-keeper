import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { applyPalette, cachedPalette } from "./palettes";
import { fetchProfile } from "./db";
import type { Profile } from "./types";

interface AuthValue {
  session: Session | null;
  user: Session["user"] | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    applyPalette(cachedPalette());
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next ?? null);
      if (event === "SIGNED_OUT") {
        setProfile(null);
        queryClient.clear();
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [queryClient]);

  const userId = session?.user.id ?? null;
  const userMeta = session?.user.user_metadata as Record<string, string> | undefined;

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    let active = true;

    async function load() {
      let p = await fetchProfile(userId!);
      if (!p) {
        // El perfil no se creó al registrarse (p. ej. confirmación de correo).
        // Lo reconstruimos desde los metadatos guardados en la cuenta.
        const meta = userMeta ?? {};
        const fallback = session?.user.email?.split("@")[0] ?? "usuario";
        const username = (meta.username || fallback).trim();
        const ownerName = (meta.owner_name || "").trim();
        const { error } = await supabase.from("profiles").insert({
          id: userId!,
          owner_name: ownerName,
          username,
          book_name: (meta.book_name || "").trim() || `Recetas de ${ownerName || username}`,
          palette: (meta.palette as Profile["palette"]) || "verde",
        });
        if (!error) p = await fetchProfile(userId!);
      }
      if (!active) return;
      setProfile(p);
      if (p) applyPalette(p.palette);
    }

    load().catch(() => undefined);
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function refreshProfile() {
    if (!userId) return;
    const p = await fetchProfile(userId);
    setProfile(p);
    if (p) applyPalette(p.palette);
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
