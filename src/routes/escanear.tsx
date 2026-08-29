import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Camera, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Protected } from "@/components/Protected";
import { NewRecipeScreen } from "@/components/NewRecipeScreen";
import { ReviewBanner } from "@/routes/importar.texto";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { transcribeRecipeImage } from "@/lib/ocr.functions";
import { parseRecipeText } from "@/lib/recipe-text";
import type { RecipeDraft } from "@/lib/types";

export const Route = createFileRoute("/escanear")({
  head: () => ({
    meta: [
      { title: "Escanear receta — Grimorio Dev" },
      {
        name: "description",
        content:
          "Toma una foto de una receta escrita o impresa y Grimorio Dev la transcribe para que la revises y guardes.",
      },
      { property: "og:title", content: "Escanear receta — Grimorio Dev" },
      {
        property: "og:description",
        content: "Digitaliza las recetas de tu cuaderno con una foto.",
      },
    ],
  }),
  component: () => (
    <Protected>
      <ScanPage />
    </Protected>
  ),
});

const ERRORS: Record<string, string> = {
  config: "El escaneo no está disponible por ahora. Puedes pegar la receta como texto.",
  rate: "Hay muchos escaneos en curso. Espera un momento e intenta de nuevo.",
  gateway: "No pudimos leer la foto. Intenta con mejor luz o escribe la receta a mano.",
  empty: "No encontramos texto en la foto. Prueba con una foto más nítida.",
};

function ScanPage() {
  const transcribe = useServerFn(transcribeRecipeImage);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<RecipeDraft | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  async function pick(file: File | undefined) {
    if (!file) return;
    if (file.size > 8_000_000) {
      toast.error("La foto es muy grande. Intenta con una imagen más liviana.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("read"));
      reader.readAsDataURL(file);
    });
    setPreview(dataUrl);
    setBusy(true);
    try {
      const result = await transcribe({ data: { imageDataUrl: dataUrl } });
      if (!result.ok) {
        toast.error(ERRORS[result.error] ?? ERRORS["gateway"]!);
        return;
      }
      setText(result.text);
      toast.success("Transcribimos la receta. Revisa el texto.");
    } catch {
      toast.error("No pudimos procesar la foto. Revisa tu conexión.");
    } finally {
      setBusy(false);
    }
  }

  if (draft) {
    return (
      <NewRecipeScreen
        title="Revisar receta escaneada"
        subtitle="Corrige lo que el escaneo no leyó bien"
        initial={draft}
        banner={<ReviewBanner warnings={warnings} />}
      />
    );
  }

  return (
    <AppShell title="Escanear receta" subtitle="Una foto por receta" back>
      <div className="space-y-4 pb-10">
        {preview ? (
          <img src={preview} alt="Foto de la receta" className="h-48 w-full rounded-2xl object-cover" />
        ) : null}

        <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-sm text-muted-foreground hover:bg-secondary">
          <Camera className="size-6" />
          {busy ? "Leyendo la foto…" : preview ? "Tomar otra foto" : "Tomar o elegir foto"}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </label>

        {text ? (
          <>
            <Textarea rows={12} value={text} onChange={(e) => setText(e.target.value)} />
            <Button
              className="h-12 w-full text-base"
              onClick={() => {
                const result = parseRecipeText(text);
                result.draft.origin_type = "escaneada";
                setWarnings(result.warnings);
                setDraft(result.draft);
              }}
            >
              <Wand2 className="size-5" /> Ordenar receta
            </Button>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Consejo: apoya la hoja en una superficie plana y con buena luz.
          </p>
        )}
      </div>
    </AppShell>
  );
}
