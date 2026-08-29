import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Protected } from "@/components/Protected";
import { NewRecipeScreen } from "@/components/NewRecipeScreen";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { parseRecipeText } from "@/lib/recipe-text";
import type { RecipeDraft } from "@/lib/types";

export const Route = createFileRoute("/importar/texto")({
  head: () => ({
    meta: [
      { title: "Pegar receta desde texto — Grimorio Dev" },
      {
        name: "description",
        content:
          "Pega una receta que te compartieron por mensaje y Grimorio Dev la ordena en ingredientes y preparación.",
      },
      { property: "og:title", content: "Pegar receta desde texto — Grimorio Dev" },
      {
        property: "og:description",
        content: "Convierte un mensaje de texto en una receta ordenada y editable.",
      },
    ],
  }),
  component: () => (
    <Protected>
      <ImportText />
    </Protected>
  ),
});

const EXAMPLE = `Torta de Durazno

Ingredientes
200 g harina
3 huevos
1 taza de azúcar

Preparación
1. Batir los huevos con el azúcar.
2. Agregar la harina.
3. Hornear 40 minutos.`;

function ImportText() {
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<RecipeDraft | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  if (draft) {
    return (
      <NewRecipeScreen
        title="Revisar receta"
        subtitle="Revisa y corrige antes de guardar"
        initial={draft}
        banner={<ReviewBanner warnings={warnings} />}
      />
    );
  }

  return (
    <AppShell title="Pegar desde texto" subtitle="Pega el mensaje completo" back>
      <div className="space-y-4 pb-10">
        <Textarea
          rows={14}
          placeholder={EXAMPLE}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          className="h-12 w-full text-base"
          onClick={() => {
            if (text.trim().length < 10) {
              toast.error("Pega primero el texto de la receta.");
              return;
            }
            const result = parseRecipeText(text);
            setWarnings(result.warnings);
            setDraft(result.draft);
          }}
        >
          <Wand2 className="size-5" /> Ordenar receta
        </Button>
        <p className="text-xs text-muted-foreground">
          Detectamos el nombre, los ingredientes y la preparación. Después puedes corregir todo a
          mano.
        </p>
      </div>
    </AppShell>
  );
}

export function ReviewBanner({ warnings }: { warnings: string[] }) {
  return (
    <div className="space-y-1 rounded-xl border bg-accent/50 p-3 text-xs">
      <p className="font-semibold">Revisa antes de guardar</p>
      {warnings.length ? (
        <ul className="list-disc pl-4 text-muted-foreground">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">
          Ordenamos la receta. Verifica cantidades y unidades antes de guardar.
        </p>
      )}
    </div>
  );
}
