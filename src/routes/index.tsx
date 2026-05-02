import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LivePlayer } from "@/components/LivePlayer";
import { Schedule } from "@/components/Schedule";
import { TopSongs } from "@/components/TopSongs";
import { News } from "@/components/News";
import { Community } from "@/components/Community";
import { Podcasts } from "@/components/Podcasts";
import { Gallery } from "@/components/Gallery";
import { Participation } from "@/components/Participation";
import { Team } from "@/components/Team";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ondas del Sur 106.6 FM Stereo — La Verdadera Emisora del Pueblo" },
      {
        name: "description",
        content:
          "Ondas del Sur 106.6 FM Stereo, emisora comunitaria de Sativasur, Boyacá. Música, noticias y la voz de nuestra comunidad las 24 horas del día.",
      },
      { property: "og:title", content: "Ondas del Sur 106.6 FM Stereo" },
      { property: "og:description", content: "La Verdadera Emisora del Pueblo · Sativasur, Boyacá, Colombia." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <LivePlayer />
        <Schedule />
        <TopSongs />
        <News />
        <Community />
        <Podcasts />
        <Gallery />
        <Team />
        <Participation />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
