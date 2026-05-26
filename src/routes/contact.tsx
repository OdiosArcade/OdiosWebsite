import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactBlock } from "@/components/site/ContactBlock";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Odios Racing" },
      {
        name: "description",
        content: "Get a quote, request a brief, or open a partnership channel with Odios Racing.",
      },
      { property: "og:title", content: "Contact — Odios Racing" },
      {
        property: "og:description",
        content: "Direct line to the founders. Engineering briefs welcomed.",
      },
    ],
  }),
});

function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <PageHeader
        eyebrow="Page / Contact"
        title="OPEN A"
        accent="CHANNEL."
        subtitle="Request a quote, partnership brief, or franchise pack. We respond within one business day."
      />
      <ContactBlock />
      <Footer />
    </main>
  );
}
