import appIcon from "@/assets/grimorio-icon.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * Marca de Grimorio Dev teñida con la paleta activa.
 * Usa el PNG como máscara y pinta la silueta con el color primario,
 * por lo que cambia automáticamente al cambiar la paleta.
 */
export function BrandMark({
  className,
  label = "Grimorio Dev",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn("block bg-primary", className)}
      style={{
        WebkitMaskImage: `url(${appIcon.url})`,
        maskImage: `url(${appIcon.url})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
