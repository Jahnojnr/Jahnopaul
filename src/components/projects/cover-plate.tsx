import { cn } from "@/lib/utils";

type CoverPlateProps = {
  label: string;
  title: string;
  className?: string;
};

export function CoverPlate({ label, title, className }: CoverPlateProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-[16/10] flex-col justify-between overflow-hidden bg-accent p-6 text-paper",
        className,
      )}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -right-8 top-8 h-40 w-40 rounded-full border border-paper/60" />
        <div className="absolute bottom-6 left-10 h-24 w-48 border border-paper/30" />
      </div>
      <p className="relative text-xs uppercase tracking-[0.2em]">{label}</p>
      <p className="relative max-w-sm font-serif text-2xl leading-snug md:text-3xl">
        {title}
      </p>
    </div>
  );
}
