import heroBg from "@/assets/hero-bg.jpg";
import { Equalizer } from "./Equalizer";
import { LiveBadge } from "./LiveBadge";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Background image */}
      <img
        src={heroBg}
        alt=""
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

      {/* Floating orbs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />

      {/* Radar pulse */}
      <div className="absolute right-10 top-1/3 hidden lg:block">
        <div className="relative h-32 w-32">
          {[0, 0.5, 1].map((d, i) => (
            <span
              key={i}
              className="absolute inset-0 rounded-full border-2 border-primary/40 animate-radar"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
          <span className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-primary shadow-glow" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pt-28 pb-20 w-full">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6 animate-fade-up">
            <LiveBadge />
            <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
              Sativasur · Boyacá · Colombia
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[0.95] mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            La Verdadera <br />
            <span className="text-gradient-brand">Emisora del Pueblo</span>
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Música, información y la voz de nuestra comunidad sonando 24/7 en{" "}
            <span className="text-foreground font-semibold">106.6 FM Stereo</span>. La señal que nos une desde el corazón de Boyacá.
          </p>

          <div className="flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <a
              href="#en-vivo"
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gradient-brand text-primary-foreground font-bold shadow-glow hover:scale-[1.03] transition-transform"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15 group-hover:bg-primary-foreground/25 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
              Escuchar en vivo
            </a>
            <a
              href="#programacion"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass text-foreground font-semibold hover:border-primary/60 hover:text-primary transition"
            >
              Ver programación
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              { v: "106.6", l: "FM Stereo" },
              { v: "24/7", l: "Transmisión" },
              { v: "+10K", l: "Oyentes" },
            ].map((s) => (
              <div key={s.l} className="border-l-2 border-primary/60 pl-4">
                <div className="text-2xl lg:text-3xl font-black text-gradient-brand">{s.v}</div>
                <div className="text-xs text-muted-foreground tracking-widest uppercase mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom waveform */}
      <div className="absolute bottom-0 inset-x-0 h-24 flex items-end justify-center gap-[2px] px-4 opacity-40 pointer-events-none">
        {Array.from({ length: 120 }).map((_, i) => (
          <span
            key={i}
            className="w-[3px] bg-gradient-to-t from-primary to-transparent rounded-full animate-equalizer"
            style={{
              animationDelay: `${(i % 12) * 0.08}s`,
              animationDuration: `${0.8 + (i % 5) * 0.15}s`,
              height: `${10 + ((i * 7) % 60)}%`,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <span className="block h-8 w-px bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}
