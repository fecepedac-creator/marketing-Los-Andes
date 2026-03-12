import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex rounded-full bg-secondary px-2 py-1 text-xs font-medium", className)} {...props} />;
}
