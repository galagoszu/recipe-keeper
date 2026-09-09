import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, LogOut, Save } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Protected } from "@/components/Protected";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { PalettePicker } from "@/routes/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { renameOwnAuthor, updateProfile } from "@/lib/db";
import { applyPalette, type PaletteId } from "@/lib/palettes";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil — Grimorio Dev" },
      {
        name: "description",
        content:
          "Ajusta tu nombre, tu usuario, el nombre de tu libro de recetas y la paleta de colores de Grimorio Dev.",
      },
      { property: "og:title", content: "Mi perfil — Grimorio Dev" },
      {
        property: "og:description",
        content: "Personaliza tu libro de recetas: nombre, usuario y colores.",
      },
    ],
  }),
  component: () => (
    <Protected>
      <ProfilePage />
    </Protected>
  ),
});

function ProfilePage() {
  const { profile, user, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState("");
  const [username, setUsername] = useState("");
  const [bookName, setBookName] = useState("");
  const [palette, setPalette] = useState<PaletteId>("verde");
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!profile) return;
    setOwnerName(profile.owner_name);
    setUsername(profile.username);
    setBookName(profile.book_name);
    setPalette(profile.palette as PaletteId);
  }, [profile]);

  async function save() {
    if (!user) return;
    if (!username.trim()) {
      toast.error("El nombre de usuario no puede quedar vacío.");
      return;
    }
    setSaving(true);
    try {
      await updateProfile(user.id, {
        owner_name: ownerName.trim(),
        username: username.trim(),
        book_name: bookName.trim() || `Recetas de ${ownerName.trim()}`,
        palette,
      });
      if (profile && profile.username !== username.trim()) {
        await renameOwnAuthor(user.id, username.trim());
      }
      await refreshProfile();
      applyPalette(palette);
      toast.success("Perfil actualizado");
    } catch (error) {
      const message = String((error as { message?: string })?.message ?? "");
      toast.error(
        message.includes("duplicate")
          ? "Ese nombre de usuario ya está ocupado."
          : "No pudimos guardar los cambios. Revisa tu conexión.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (password.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) toast.error("No pudimos cambiar la contraseña.");
    else {
      setPassword("");
      toast.success("Contraseña actualizada");
    }
  }

  return (
    <AppShell title="Mi perfil" subtitle={user?.email ?? ""} back action={<span />}>
      <div className="space-y-6 pb-10">
        <section className="space-y-3 rounded-2xl border bg-card p-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Nombre</Label>
            <Input id="p-name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-user">Nombre de usuario</Label>
            <Input id="p-user" value={username} onChange={(e) => setUsername(e.target.value)} />
            <p className="text-xs text-muted-foreground">
              Aparece como autor en las recetas que creaste.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-book">Nombre del libro</Label>
            <Input id="p-book" value={bookName} onChange={(e) => setBookName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Paleta de colores</Label>
            <PalettePicker
              value={palette}
              onChange={(p) => {
                setPalette(p);
                applyPalette(p);
              }}
            />
          </div>
          <Button className="h-12 w-full text-base" onClick={save} disabled={saving}>
            <Save className="size-5" /> {saving ? "Guardando…" : "Guardar cambios"}
          </Button>
        </section>

        <section className="space-y-3 rounded-2xl border bg-card p-4">
          <h2 className="font-semibold">Seguridad</h2>
          <div className="space-y-1.5">
            <Label htmlFor="p-pass">Nueva contraseña</Label>
            <Input
              id="p-pass"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full" onClick={changePassword}>
            Cambiar contraseña
          </Button>
        </section>

        <ConfirmDialog
          title="¿Cerrar sesión?"
          description="Tus recetas quedan guardadas en la nube."
          confirmLabel="Cerrar sesión"
          onConfirm={async () => {
            await signOut();
            navigate({ to: "/auth", replace: true });
          }}
          trigger={
            <Button variant="outline" className="w-full text-destructive">
              <LogOut className="size-4" /> Cerrar sesión
            </Button>
          }
        />
      </div>
    </AppShell>
  );
}
