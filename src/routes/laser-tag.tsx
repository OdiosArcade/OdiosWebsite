import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { LaserHero } from "@/components/site/laser/LaserHero";
import { LaserHardware } from "@/components/site/laser/LaserHardware";
import { LaserContentMagnet } from "@/components/site/laser/LaserContentMagnet";
import { LaserArenaConfig } from "@/components/site/laser/LaserArenaConfig";
import { LaserModelsSplit } from "@/components/site/laser/LaserModelsSplit";
import { LaserContact } from "@/components/site/laser/LaserContact";

export const Route = createFileRoute("/laser-tag")({
  component: LaserTagPage,
  head: () => ({
    meta: [
      { title: "Odios Tactical — Immersion Engineered" },
      {
        name: "description",
        content:
          "Next-generation laser tag arena hardware — precision phasers, multi-zone vests, and wireless control hubs engineered to blur gaming and reality.",
      },
      { property: "og:title", content: "Odios Tactical — Immersion Engineered" },
      {
        property: "og:description",
        content:
          "Custom-engineered tactical hardware, smart hit detection, and turn-key themed arenas for premium B2B venues.",
      },
    ],
  }),
});

function LaserTagPage() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <LaserHero />
      <LaserHardware />
      <LaserContentMagnet />
      <LaserArenaConfig />
      <LaserModelsSplit />
      <LaserContact />
      <Footer />
    </main>
  );
}
