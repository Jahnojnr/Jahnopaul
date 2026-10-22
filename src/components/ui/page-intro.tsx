type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <header className="max-w-3xl border-b border-line pb-10">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
      <h1 className="mt-4 font-serif text-4xl leading-tight text-charcoal md:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-ink/80">{description}</p>
    </header>
  );
}
