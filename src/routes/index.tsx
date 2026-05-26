import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { ProductGrid } from "@/components/site/ProductGrid";
import { AboutSummary } from "@/components/site/AboutSummary";
import { ContactBlock } from "@/components/site/ContactBlock";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Odios Racing — Custom Entertainment & Sporting Equipment" },
      {
        name: "description",
        content:
          "Odios builds custom go-karts, laser tag ecosystems, and skill-based games for the Indian entertainment industry. Whatever the need, we build it.",
      },
      { property: "og:title", content: "Odios Racing — Whatever the need, we build it." },
      {
        property: "og:description",
        content:
          "End-to-end entertainment engineering firm. Karts, laser tag, skill games — engineered in Kochi.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <Hero />
      <ProductGrid />
      <AboutSummary />
      <ContactBlock />
      <Footer />
    </main>
  );
}
