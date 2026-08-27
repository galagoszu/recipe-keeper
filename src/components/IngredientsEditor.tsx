import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { UNIT_GROUPS } from "@/lib/units";
import { ingredientLine } from "@/lib/recipe-text";
import type { Ingredient } from "@/lib/types";

interface DraftIngredient {
  quantity: string;
  unit: string;
  name: string;
  note: string;
}

const EMPTY: DraftIngredient = { quantity: "", unit: "", name: "", note: "" };

function toIngredient(d: DraftIngredient): Ingredient {
  const q = d.quantity.replace(",", ".").trim();
  return {
    quantity: q === "" ? null : Number(q),
    unit: d.unit,
    name: d.name.trim(),
    note: d.note.trim() || null,
  };
}

function toDraft(i: Ingredient): DraftIngredient {
  return {
    quantity: i.quantity === null || i.quantity === undefined ? "" : String(i.quantity),
    unit: i.unit ?? "",
    name: i.name,
    note: i.note ?? "",
  };
}

function IngredientFields({
  value,
  onChange,
  onAccept,
  onCancel,
}: {
  value: DraftIngredient;
  onChange: (v: DraftIngredient) => void;
  onAccept: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-2 rounded-xl border-2 border-dashed border-primary/40 bg-accent/40 p-3">
      <div className="flex gap-2">
        <Input
          inputMode="decimal"
          aria-label="Cantidad"
          placeholder="0.0"
          className="w-20 bg-card"
          value={value.quantity}
          onChange={(e) => onChange({ ...value, quantity: e.target.value })}
        />
        <Select value={value.unit} onValueChange={(unit) => onChange({ ...value, unit })}>
          <SelectTrigger aria-label="Unidad" className="w-32 bg-card">
            <SelectValue placeholder="gramos" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {UNIT_GROUPS.map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.units.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        aria-label="Ingrediente"
        placeholder="Harina sin polvo"
        className="bg-card"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
      <Input
        aria-label="Nota"
        placeholder="Nota (opcional)"
        className="bg-card"
        value={value.note}
        onChange={(e) => onChange({ ...value, note: e.target.value })}
      />
      <div className="flex gap-2">
        <Button type="button" size="sm" className="flex-1" onClick={onAccept}>
          <Check className="size-4" /> Aceptar
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex-1 text-destructive"
          onClick={onCancel}
        >
          <X className="size-4" /> Cancelar
        </Button>
      </div>
    </div>
  );
}

export function IngredientsEditor({
  value,
  onChange,
}: {
  value: Ingredient[];
  onChange: (list: Ingredient[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState<DraftIngredient>(EMPTY);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<DraftIngredient>(EMPTY);

  function accept() {
    const item = toIngredient(newItem);
    if (!item.name) return;
    onChange([...value, item]);
    setNewItem(EMPTY);
    setAdding(false);
  }

  function acceptEdit() {
    if (editIndex === null) return;
    const item = toIngredient(editItem);
    if (!item.name) return;
    const next = [...value];
    next[editIndex] = item;
    onChange(next);
    setEditIndex(null);
  }

  return (
    <div className="space-y-2">
      <ul className="divide-y rounded-xl border bg-card">
        {value.length === 0 && !adding ? (
          <li className="px-3 py-4 text-sm text-muted-foreground">
            Sin ingredientes todavía. Ejemplo: 200 g Harina sin polvo
          </li>
        ) : null}
        {value.map((ing, index) =>
          editIndex === index ? (
            <li key={index} className="p-2">
              <IngredientFields
                value={editItem}
                onChange={setEditItem}
                onAccept={acceptEdit}
                onCancel={() => setEditIndex(null)}
              />
            </li>
          ) : (
            <li key={index} className="flex items-center gap-2 px-3 py-2.5">
              <span className="flex-1 text-sm">{ingredientLine(ing)}</span>
              <button
                type="button"
                aria-label="Editar ingrediente"
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-ink"
                onClick={() => {
                  setEditIndex(index);
                  setEditItem(toDraft(ing));
                }}
              >
                <Pencil className="size-4" />
              </button>
              <ConfirmDialog
                title="¿Eliminar este ingrediente?"
                description={ingredientLine(ing)}
                confirmLabel="Eliminar"
                onConfirm={() => onChange(value.filter((_, i) => i !== index))}
                trigger={
                  <button
                    type="button"
                    aria-label="Eliminar ingrediente"
                    className="grid size-8 place-items-center rounded-full text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </button>
                }
              />
            </li>
          ),
        )}
      </ul>

      {adding ? (
        <IngredientFields
          value={newItem}
          onChange={setNewItem}
          onAccept={accept}
          onCancel={() => {
            setNewItem(EMPTY);
            setAdding(false);
          }}
        />
      ) : (
        <Button type="button" variant="outline" className="w-full" onClick={() => setAdding(true)}>
          <Plus className="size-4" /> Agregar ingrediente
        </Button>
      )}
    </div>
  );
}
