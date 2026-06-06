import { Typography } from "@/components/Typography";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/Heading";

export type FeaturesProps = {
  tagline: string;
  heading: string;
  subheading: string;
  columns: "2" | "3" | "4";
  items: Array<{ title: string; body: string }>;
};

const colClass: Record<FeaturesProps["columns"], string> = {
  "2": "md:grid-cols-2",
  "3": "md:grid-cols-3",
  "4": "md:grid-cols-2 lg:grid-cols-4",
};

export function Features({ tagline, heading, subheading, columns, items }: FeaturesProps) {
  return (
    <section className="bg-background py-20 md:py-28">
      <Container>
        <Heading
          tagline={tagline}
          title={heading}
          subtitle={subheading}
          align="center"
          size="lg"
          className="mx-auto mb-16"
          maxWidth="max-w-2xl"
        />

        <div className={`grid grid-cols-1 gap-x-10 gap-y-12 ${colClass[columns]}`}>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Typography variant="caption">
                {String(i + 1).padStart(2, "0")}
              </Typography>
              <Typography variant="h5">{item.title}</Typography>
              <Typography variant="body2" className="text-muted-foreground">
                {item.body}
              </Typography>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
