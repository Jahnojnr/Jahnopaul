type SectionHeadingProps = {
  index: string;
  title: string;
  description?: string;
};

export function SectionHeading({ index, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-10 grid gap-4 border-b border-line pb-6 md:grid-cols-[120px_1fr] md:items-end">
      <p className="font-serif text-sm tracking-[0.18em] text-muted">{index}</p>
      <div>
        <h2 className="font-serif text-3xl text-charcoal md:text-4xl">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-muted">{description}</p> : null}
      </div>
    </div>
  );
}
