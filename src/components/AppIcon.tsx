import appIcon from "@/assets/grimorio-icon.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * Icono de Grimorio Dev. Se tiñe automáticamente según la paleta activa
 * mediante la variable CSS --logo-hue definida en styles.css.
 */
export function AppIcon({
  className,
  size = 36,
  alt = "Grimorio Dev",
}: {
  className?: string;
  size?: number;
  alt?: string;
}) {
  return (
    <img
      src={appIcon.url}
      alt={alt}
      width={size}
      height={size}
      className={cn("app-icon", className)}
    />
  );
}
