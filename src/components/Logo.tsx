import markAsset from "@/assets/terto-mark.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-3", className)}>
      <img
        src={markAsset.url}
        alt="Terto Imóveis"
        className="h-9 w-auto shrink-0 sm:h-10"
        width={36}
        height={62}
      />
      {!compact && (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="font-display truncate text-lg font-semibold tracking-[0.22em] uppercase sm:text-xl">
            Terto
          </span>
          <span className="text-muted-foreground truncate text-[0.6rem] tracking-[0.42em] uppercase">
            Imóveis
          </span>
        </span>
      )}
    </span>
  );
}
