import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">404</p>
          <h1 className="mt-4 font-serif text-5xl">This page is not in the archive.</h1>
          <p className="mt-5 max-w-xl text-lg text-ink/80">
            The address may have changed, or the piece has not been published
            yet. Return to the homepage or browse the project directory.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/">Home</ButtonLink>
            <ButtonLink href="/projects" variant="secondary">
              Projects
            </ButtonLink>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
