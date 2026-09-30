import { Skeleton } from "@/components/ui/skeleton";

export default function PaperDetailLoading() {
  return (
    <div className="space-y-6 py-10">
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-64 w-full rounded-3xl" />
      <Skeleton className="h-[65vh] w-full rounded-3xl" />
    </div>
  );
}
