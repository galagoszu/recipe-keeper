import { createFileRoute } from "@tanstack/react-router";

import { NewRecipeScreen } from "@/components/NewRecipeScreen";
import { Protected } from "@/components/Protected";
import { emptyDraft } from "@/lib/types";

export const Route = createFileRoute("/receta/nueva")({
  head: () => ({
    meta: [
      { title: "Escribir receta — Grimorio Dev" },
      {
        name: "description",
        content:
          "Escribe una receta nueva con ingredientes, cantidades, preparación, imagen y tus comentarios fechados.",
      },
      { property: "og:title", content: "Escribir receta — Grimorio Dev" },
      {
        property: "og:description",
        content: "Ingredientes, preparación, foto y comentarios en un solo formulario simple.",
      },
    ],
  }),
  component: () => (
    <Protected>
      <NewRecipeScreen
        title="Nueva receta"
        subtitle="Los campos con * son obligatorios"
        initial={emptyDraft()}
      />
    </Protected>
  ),
});
