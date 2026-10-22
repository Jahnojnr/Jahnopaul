"use client";

export function PrintResumeButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center border border-charcoal/20 px-5 text-sm uppercase tracking-[0.08em] text-charcoal hover:border-accent hover:text-accent print:hidden"
    >
      Print or save as PDF
    </button>
  );
}
