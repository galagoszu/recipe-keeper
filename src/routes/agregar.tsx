import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardPaste, FileDown, PenLine, ScanLine } from "lucide-react";
import type { ReactNode } from "react";

import { AppShell } from "@/components/AppShell";
import { Protected } from "@/components/Protected";

export const Route = createFileRoute("/agregar")({
  head: () => ({
    meta: [
      { title: "Agregar receta — Grimorio Dev" },
      {
        name: "description",
        content:
          "Crea una receta desde cero, pega un texto, importa un archivo .arkrecipe o escanea una página de tu cuaderno.",
      },
      { property: "og:title", content: "Agregar receta — Grimorio Dev" },
      {
        property: "og:description",
        content: "Cuatro formas de sumar recetas: escribir, pegar, importar o escanear.",
      },
    ],
  }),
  component: () => (
    <Protected>
      <AddHub />
    </Protected>
  ),
});

function AddHub() {
  return (
    <AppShell title="Agregar receta" subtitle="Elige cómo quieres empezar" back>
      <ul className="space-y-3 pb-10">
        <Option
          to="/receta/nueva"
          icon={<PenLine className="size-5" />}
          title="Escribir receta"
          text="Crea la receta paso a paso, como en tu cuaderno."
        />
        <Option
          to="/importar/texto"
          icon={<ClipboardPaste className="size-5" />}
          title="Pegar desde texto"
          text="Pega una receta que te compartieron por mensaje."
        />
        <Option
          to="/importar/archivo"
          icon={<FileDown className="size-5" />}
          title="Importar archivo .arkrecipe"
          text="Recupera una receta compartida desde Grimorio Dev."
        />
        <Option
          to="/escanear"
          icon={<ScanLine className="size-5" />}
          title="Escanear receta"
          text="Toma una foto de una receta escrita o impresa."
        />
      </ul>
    </AppShell>
  );
}

function Option({
  to,
  icon,
  title,
  text,
}: {
  to: "/receta/nueva" | "/importar/texto" | "/importar/archivo" | "/escanear";
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-start gap-3 rounded-2xl border bg-card p-4 transition-colors hover:bg-accent/50"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-primary">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{title}</span>
          <span className="block text-sm text-muted-foreground">{text}</span>
        </span>
      </Link>
    </li>
  );
}
