import { useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/Heading";

export type EmailProvider = "none" | "mailchimp" | "klaviyo";

export type NewsletterCtaProps = {
  tagline: string;
  heading: string;
  subheading: string;
  buttonLabel: string;
  emailProvider: EmailProvider;
  endpoint?: string;
  mailchimpApiKey?: string;
  mailchimpServerPrefix?: string;
  mailchimpAudienceId?: string;
  klaviyoCompanyId?: string;
  klaviyoListId?: string;
  imageUrl: string;
  layout: "split" | "stacked";
};

export function NewsletterCta({
  tagline,
  heading,
  subheading,
  buttonLabel,
  emailProvider,
  endpoint,
  mailchimpApiKey,
  mailchimpServerPrefix,
  mailchimpAudienceId,
  klaviyoCompanyId,
  klaviyoListId,
  imageUrl,
  layout,
}: NewsletterCtaProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      if (emailProvider === "mailchimp") {
        if (mailchimpServerPrefix && mailchimpAudienceId && mailchimpApiKey) {
          await fetch(
            `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${mailchimpAudienceId}/members`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${mailchimpApiKey}`,
              },
              body: JSON.stringify({
                email_address: email,
                status: "subscribed",
              }),
            },
          );
        }
      } else if (emailProvider === "klaviyo") {
        if (klaviyoCompanyId && klaviyoListId) {
          await fetch(
            `https://a.klaviyo.com/client/subscriptions/?company_id=${klaviyoCompanyId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                revision: "2024-10-15",
              },
              body: JSON.stringify({
                data: {
                  type: "subscription",
                  attributes: {
                    profile: {
                      data: {
                        type: "profile",
                        attributes: { email },
                      },
                    },
                  },
                  relationships: {
                    list: { data: { type: "list", id: klaviyoListId } },
                  },
                },
              }),
            },
          );
        }
      } else if (endpoint) {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const Form = (
    <form
      onSubmit={submit}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center"
    >
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="h-11 flex-1"
      />
      <Button type="submit" size="lg" disabled={submitting} className="h-11">
        {submitting ? "Joining…" : buttonLabel}
      </Button>
    </form>
  );

  const isStacked = layout === "stacked";

  return (
    <section className="bg-background">
      <Container className="py-20 md:py-28">
        <div
          className={cn(
            "grid grid-cols-1 gap-10",
            isStacked
              ? "mx-auto max-w-3xl items-center text-center"
              : "items-center md:grid-cols-12 md:gap-16",
          )}
        >
          {imageUrl ? (
            <div className={cn(!isStacked && "md:col-span-7")}>
              <div className="relative overflow-hidden rounded-xl bg-muted">
                <img
                  src={imageUrl}
                  alt=""
                  className={cn(
                    "w-full object-cover transition-transform duration-700 hover:scale-105",
                    isStacked ? "aspect-[16/9]" : "aspect-[4/3]",
                  )}
                />
              </div>
            </div>
          ) : null}
          <div
            className={cn(
              "flex w-full flex-col",
              isStacked ? "items-center" : "items-start md:col-span-5",
            )}
          >
            <Heading
              tagline={tagline}
              title={heading}
              subtitle={subheading}
              align={isStacked ? "center" : "left"}
              size="lg"
              subtitleClassName={isStacked ? "mx-auto max-w-xl" : "max-w-md"}
            />
            <div
              className={cn(
                "mt-8 w-full",
                isStacked && "flex justify-center",
              )}
            >
              {submitted ? (
                <p className="text-sm font-medium uppercase tracking-wide">
                  You're in. See you Monday at 5:30am.
                </p>
              ) : (
                Form
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
