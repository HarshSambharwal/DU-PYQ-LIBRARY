import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-palette-green/10 dark:bg-palette-green/55", className)} />;
}
