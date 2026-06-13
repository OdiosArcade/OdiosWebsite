import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { IndustryProblems } from "@/components/site/IndustryProblems";
import { Hardware } from "@/components/site/Hardware";
import { ContentMagnet } from "@/components/site/ContentMagnet";
import { Configurator } from "@/components/site/Configurator";
import { BusinessModels } from "@/components/site/BusinessModels";

export const Route = createFileRoute("/go-karts")({
  component: GoKartsPage,
  head: () => ({
    meta: [
      { title: "Go-Karts — Odios Racing" },
      {
        name: "description",
        content:
          "Custom karts, track telemetry, and turnkey venues. Choose the soul of the machine — IC or Electric.",
      },
      { property: "og:title", content: "Go-Karts — Odios Racing" },
      {
        property: "og:description",
        content:
          "Engineered chassis, wireless safety, lap-timing & digital cockpits, all built in Kochi.",
      },
    ],
  }),
});

function GoKartsPage() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <PageHeader
        eyebrow="Sector / Go-Karts"
        title="ENGINEERED"
        accent="KARTS."
        subtitle="Chassis manufacturing, fleet telemetry, and turnkey venues — built end-to-end in our Kochi workshop."
      />
      <IndustryProblems />
      <Hardware />
      <ContentMagnet />
      <Configurator />
      <BusinessModels />
      <Footer />
    </main>
  );
}
