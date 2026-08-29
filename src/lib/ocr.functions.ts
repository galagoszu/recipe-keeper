import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  imageDataUrl: z.string().min(32).max(12_000_000),
});

/** Transcribe una foto de receta a texto plano usando Lovable AI. */
export const transcribeRecipeImage = createServerFn({ method: "POST" })
  .inputValidator((input) => schema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false as const, error: "config" };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "Transcribes fotos de recetas de cocina a texto plano en español. Devuelve solo el texto con esta estructura, sin comentarios ni markdown:\nNombre de la receta\n\nIngredientes\n- cantidad unidad ingrediente\n\nPreparación\n1. paso\n2. paso\nNo inventes ingredientes ni pasos que no aparezcan en la imagen.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Transcribe esta receta." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (response.status === 429) return { ok: false as const, error: "rate" };
    if (!response.ok) return { ok: false as const, error: "gateway" };

    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "empty" };
    return { ok: true as const, text };
  });
