import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";

import { imageUrl } from "@/lib/db";
import { cn } from "@/lib/utils";

export function RecipeImage({
  path,
  alt,
  className,
  fallback = false,
}: {
  path: string | null;
  alt: string;
  className?: string;
  fallback?: boolean;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setUrl(null);
    imageUrl(path)
      .then((u) => {
        if (active) setUrl(u);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [path]);

  if (!path || !url) {
    if (!fallback) return null;
    return (
      <div className={cn("grid place-items-center bg-secondary text-muted-foreground", className)}>
        <ImageIcon className="size-5" />
      </div>
    );
  }
  return <img src={url} alt={alt} loading="lazy" className={cn("object-cover", className)} />;
}
