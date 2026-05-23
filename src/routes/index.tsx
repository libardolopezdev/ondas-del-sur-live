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
        {/* <VideoDemo /> */}
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

function VideoDemo() {
  return (
    <section id="video-demo" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Proyecto</span>
          <h2 className="text-4xl lg:text-6xl font-black mt-3">Demostración del proyecto</h2>
          <p className="text-muted-foreground mt-3 max-w-xl">Conoce cómo fue desarrollado este sitio web</p>
        </div>
        <div
          className="overflow-hidden rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-border/40"
        >
          <iframe
            src="https://www.youtube.com/embed/zMGXzQI6kkM"
            title="Demostración del proyecto Ondas del Sur"
            width="100%"
            className="h-[250px] lg:h-[500px] border-0 block"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
