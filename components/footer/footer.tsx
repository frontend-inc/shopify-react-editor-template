import { useState } from "react";
import Link from "next/link";
import { Typography } from "@/components/Typography";
import { Container } from "@/components/layout/Container";

export type FooterProps = {
  brand: string;
  tagline: string;
  columns: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  social: Array<{ label: string; href: string }>;
  showNewsletter: "yes" | "no";
  newsletterHeading: string;
  newsletterEndpoint: string;
  copyright: string;
};

export function Footer({
  brand,
  tagline,
  columns,
  social,
  showNewsletter,
  newsletterHeading,
  newsletterEndpoint,
  copyright,
}: FooterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (newsletterEndpoint) {
      try {
        await fetch(newsletterEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch {}
    }
    setSubmitted(true);
  };

  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-20 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Typography variant="h5" as="p">
              {brand}
            </Typography>
            {tagline ? (
              <Typography variant="body2" className="mt-3 max-w-sm text-muted-foreground">
                {tagline}
              </Typography>
            ) : null}

            {showNewsletter === "yes" ? (
              <form onSubmit={submit} className="mt-8 max-w-sm">
                <p className="text-sm font-medium">{newsletterHeading}</p>
                {submitted ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Thanks — we'll be in touch.
                  </p>
                ) : (
                  <div className="mt-3 flex border-b border-border focus-within:border-foreground">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="flex-1 bg-transparent py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="ml-3 text-sm font-medium tracking-wide hover:opacity-70"
                    >
                      Subscribe →
                    </button>
                  </div>
                )}
              </form>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
            {columns.map((col, i) => (
              <div key={i}>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l, j) => (
                    <li key={j}>
                      <Link
                        href={l.href}
                        className="text-sm text-foreground/80 hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">{copyright}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {social.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="text-xs uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
