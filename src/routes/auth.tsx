import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PALETTES, applyPalette, type PaletteId } from "@/lib/palettes";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar a Grimorio Dev — Tu libro de recetas" },
      {
        name: "description",
        content:
          "Crea tu cuenta o inicia sesión en Grimorio Dev para recuperar todas tus recetas en cualquier dispositivo.",
      },
      { property: "og:title", content: "Entrar a Grimorio Dev" },
      {
        property: "og:description",
        content: "Crea tu libro de recetas y recupéralo en cualquier dispositivo.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/", replace: true });
  }, [loading, session, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="page pt-12">
        <div className="mb-8 text-center">
          <p className="text-3xl">📖</p>
          <h1 className="mt-2 text-3xl font-bold">Grimorio Dev</h1>
          <p className="reading mx-auto mt-2 text-sm text-muted-foreground">
            La simplicidad de un cuaderno de recetas, con la comodidad de una aplicación moderna.
          </p>
        </div>

        <Tabs defaultValue="registro">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="registro">Crear mi libro</TabsTrigger>
            <TabsTrigger value="entrar">Iniciar sesión</TabsTrigger>
          </TabsList>
          <TabsContent value="registro" className="pt-4">
            <SignUpForm />
          </TabsContent>
          <TabsContent value="entrar" className="pt-4">
            <SignInForm />
          </TabsContent>
        </Tabs>

        <p className="mt-10 text-center text-[11px] text-muted-foreground">
          Desarrollado por ArkanDev
        </p>
      </div>
    </div>
  );
}

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast.error(
        error.message.toLowerCase().includes("invalid")
          ? "Correo o contraseña incorrectos."
          : "No pudimos iniciar sesión. Revisa tu conexión.",
      );
      return;
    }
    toast.success("Bienvenido de vuelta");
  }

  async function recover() {
    if (!email.trim()) {
      toast.error("Escribe tu correo para enviarte el enlace de recuperación.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/perfil`,
    });
    if (error) toast.error("No pudimos enviar el correo de recuperación.");
    else toast.success("Te enviamos un correo para recuperar el acceso.");
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-4 shadow-card">
      <div className="space-y-1.5">
        <Label htmlFor="in-email">Correo</Label>
        <Input
          id="in-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <PasswordField
        id="in-pass"
        label="Contraseña"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
      />
      <Button type="submit" className="h-12 w-full text-base" disabled={busy}>
        {busy ? "Entrando…" : "Entrar a mi libro"}
      </Button>
      <button
        type="button"
        onClick={recover}
        className="w-full text-center text-xs text-muted-foreground underline"
      >
        Olvidé mi contraseña
      </button>
    </form>
  );
}

function PasswordField({
  id,
  label,
  autoComplete,
  value,
  onChange,
}: {
  id: string;
  label: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

function SignUpForm() {
  const [ownerName, setOwnerName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bookName, setBookName] = useState("");
  const [palette, setPalette] = useState<PaletteId>("verde");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setBusy(false);
      const msg = error.message.toLowerCase();
      toast.error(
        msg.includes("already") || msg.includes("registered")
          ? "Este correo ya tiene una cuenta. Inicia sesión."
          : "No pudimos crear la cuenta. Revisa los datos e intenta de nuevo.",
      );
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setBusy(false);
      toast.success("Revisa tu correo para confirmar la cuenta y luego inicia sesión.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      owner_name: ownerName.trim(),
      username: username.trim(),
      book_name: bookName.trim() || `Recetas de ${ownerName.trim() || username.trim()}`,
      palette,
    });
    setBusy(false);

    if (profileError) {
      toast.error(
        profileError.code === "23505" || profileError.message.includes("duplicate")
          ? "Ese nombre de usuario ya está ocupado. Prueba con otro."
          : "Creamos tu cuenta, pero faltan datos del libro. Ajústalos en Perfil.",
      );
      return;
    }
    applyPalette(palette);
    toast.success("Tu libro está listo");
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-4 shadow-card">
      <div className="space-y-1.5">
        <Label htmlFor="up-name">Nombre</Label>
        <Input
          id="up-name"
          placeholder="Tamara"
          required
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="up-user">Nombre de usuario</Label>
        <Input
          id="up-user"
          placeholder="tamara77"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="up-email">Correo</Label>
        <Input
          id="up-email"
          type="email"
          autoComplete="email"
          placeholder="usuario@correo.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <PasswordField
        id="up-pass"
        label="Contraseña"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
      />
      <div className="space-y-1.5">
        <Label htmlFor="up-book">Nombre del libro</Label>
        <Input
          id="up-book"
          placeholder="Recetas de Tamara"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
        />
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
      <Button type="submit" className="h-12 w-full text-base" disabled={busy}>
        {busy ? "Creando…" : "Crear mi libro"}
      </Button>
    </form>
  );
}

export function PalettePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (p: PaletteId) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {PALETTES.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={cn(
            "rounded-xl border p-2 text-left transition-colors",
            value === p.id ? "border-primary bg-accent" : "hover:bg-secondary",
          )}
        >
          <span className="flex gap-1">
            {p.swatch.map((c) => (
              <span
                key={c}
                className="size-4 rounded-full border"
                style={{ backgroundColor: c }}
              />
            ))}
          </span>
          <span className="mt-1.5 block text-xs">{p.label}</span>
        </button>
      ))}
    </div>
  );
}
