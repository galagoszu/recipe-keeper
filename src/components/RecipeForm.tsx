import { useState } from "react";
import { Check, Camera, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IngredientsEditor } from "@/components/IngredientsEditor";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { RecipeImage } from "@/components/RecipeImage";
import { CATEGORIES, subcategoriesOf } from "@/lib/categories";
import { formatDate, todayISO } from "@/lib/recipe-text";
import { uploadRecipeImage } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import type { RecipeDraft } from "@/lib/types";

export function RecipeForm({
  draft,
  onDraftChange,
  onSubmit,
  onCancel,
  saving,
  submitLabel = "Guardar receta",
}: {
  draft: RecipeDraft;
  onDraftChange: (d: RecipeDraft) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving?: boolean;
  submitLabel?: string;
}) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentDate, setCommentDate] = useState(todayISO());
  const [editingComment, setEditingComment] = useState<number | null>(null);

  const set = <K extends keyof RecipeDraft>(key: K, value: RecipeDraft[K]) =>
    onDraftChange({ ...draft, [key]: value });

  async function pickImage(file: File | undefined) {
    if (!file || !user) return;
    setUploading(true);
    try {
      const path = await uploadRecipeImage(user.id, file);
      set("image_url", path);
    } catch {
      toast.error("No pudimos guardar la imagen. Intenta con otra foto.");
    } finally {
      setUploading(false);
    }
  }

  function saveComment() {
    if (!commentText.trim()) return;
    const entry = { entry_date: commentDate, body: commentText.trim() };
    if (editingComment !== null) {
      const next = [...draft.comments];
      next[editingComment] = entry;
      set("comments", next);
      setEditingComment(null);
    } else {
      set("comments", [entry, ...draft.comments]);
    }
    setCommentText("");
    setCommentDate(todayISO());
  }

  return (
    <form
      className="space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.title.trim()) {
          toast.error("La receta necesita al menos un nombre.");
          return;
        }
        onSubmit();
      }}
    >
      <section className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="title">Nombre de la receta *</Label>
          <Input
            id="title"
            placeholder="Torta de Durazno y Manjar"
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Categoría</Label>
            <Select
              value={draft.category}
              onValueChange={(v) => onDraftChange({ ...draft, category: v, subcategory: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Elegir" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Subcategoría</Label>
            <Select
              value={draft.subcategory}
              onValueChange={(v) => set("subcategory", v)}
              disabled={!draft.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Elegir" />
              </SelectTrigger>
              <SelectContent>
                {subcategoriesOf(draft.category).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="keywords">Palabras clave</Label>
          <Input
            id="keywords"
            placeholder="torta, durazno, manjar, cumpleaños"
            value={draft.keywords.join(", ")}
            onChange={(e) =>
              set(
                "keywords",
                e.target.value
                  .split(",")
                  .map((k) => k.trim())
                  .filter(Boolean),
              )
            }
          />
          <p className="text-xs text-muted-foreground">Separadas por coma. Mejoran la búsqueda.</p>
        </div>

        {draft.origin_type === "texto" || draft.origin_type === "escaneada" ? (
          <div className="space-y-1.5">
            <Label htmlFor="source">Fuente (opcional)</Label>
            <Input
              id="source"
              placeholder="Blog de cocina de María"
              value={draft.source_note ?? ""}
              onChange={(e) => set("source_note", e.target.value)}
            />
          </div>
        ) : null}
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Imagen</h2>
        {draft.image_url ? (
          <div className="space-y-2">
            <RecipeImage
              path={draft.image_url}
              alt={draft.title}
              className="h-48 w-full rounded-xl"
              fallback
            />
            <ConfirmDialog
              title="¿Quitar la imagen?"
              confirmLabel="Quitar"
              onConfirm={() => set("image_url", null)}
              trigger={
                <Button type="button" variant="outline" className="w-full text-destructive">
                  <Trash2 className="size-4" /> Quitar imagen
                </Button>
              }
            />
          </div>
        ) : (
          <label className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm text-muted-foreground hover:bg-secondary">
            <Camera className="size-5" />
            {uploading ? "Subiendo…" : "Agregar imagen o tomar foto"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickImage(e.target.files?.[0])}
            />
          </label>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Descripción</h2>
        <Textarea
          rows={3}
          placeholder="Torta húmeda de durazno y manjar, ideal para cumpleaños."
          value={draft.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Ingredientes</h2>
        <IngredientsEditor value={draft.ingredients} onChange={(v) => set("ingredients", v)} />
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Preparación</h2>
        <Textarea
          rows={8}
          placeholder={"1. Precalentar el horno.\n2. Batir los huevos.\n3. Hornear 40 minutos."}
          value={draft.instructions}
          onChange={(e) => set("instructions", e.target.value)}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Mis comentarios</h2>
        <ul className="space-y-2">
          {draft.comments.map((c, index) => (
            <li key={index} className="rounded-xl border bg-card p-3">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary">{formatDate(c.entry_date)}</p>
                  <p className="mt-1 whitespace-pre-line text-sm">{c.body}</p>
                </div>
                <button
                  type="button"
                  aria-label="Editar comentario"
                  className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
                  onClick={() => {
                    setEditingComment(index);
                    setCommentText(c.body);
                    setCommentDate(c.entry_date);
                  }}
                >
                  <Pencil className="size-4" />
                </button>
                <ConfirmDialog
                  title="¿Eliminar este comentario?"
                  confirmLabel="Eliminar"
                  onConfirm={() =>
                    set(
                      "comments",
                      draft.comments.filter((_, i) => i !== index),
                    )
                  }
                  trigger={
                    <button
                      type="button"
                      aria-label="Eliminar comentario"
                      className="grid size-8 place-items-center rounded-full text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  }
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="space-y-2 rounded-xl border bg-card p-3">
          <Input
            type="date"
            aria-label="Fecha del comentario"
            value={commentDate}
            onChange={(e) => setCommentDate(e.target.value)}
          />
          <Textarea
            rows={3}
            placeholder="Preparación en horno eléctrico a 250° durante 1 hora."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" className="flex-1" onClick={saveComment}>
              {editingComment !== null ? <Check className="size-4" /> : <Plus className="size-4" />}
              {editingComment !== null ? "Guardar comentario" : "Agregar comentario"}
            </Button>
            {editingComment !== null ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-destructive"
                onClick={() => {
                  setEditingComment(null);
                  setCommentText("");
                }}
              >
                <X className="size-4" /> Cancelar
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between rounded-xl border bg-card p-3">
        <div>
          <p className="text-sm font-semibold">Guardar como borrador</p>
          <p className="text-xs text-muted-foreground">Para completarla más tarde</p>
        </div>
        <Switch
          checked={draft.status === "borrador"}
          onCheckedChange={(v) => set("status", v ? "borrador" : "listo")}
        />
      </section>

      <div className="sticky bottom-0 -mx-4 flex gap-2 border-t bg-background/95 px-4 py-3 backdrop-blur">
        <Button type="submit" className="h-12 flex-1 text-base" disabled={saving || uploading}>
          <Check className="size-5" /> {saving ? "Guardando…" : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 text-destructive"
          onClick={onCancel}
        >
          <X className="size-5" /> Cancelar
        </Button>
      </div>
    </form>
  );
}
