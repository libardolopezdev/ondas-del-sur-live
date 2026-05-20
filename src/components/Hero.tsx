import heroBg from "@/assets/hero-bg.webp";

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

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[0.95] mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Ondas del Sur <br />
            <span className="text-gradient-brand">106.6 FM</span>
          </h1>
          
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground/90 tracking-wide mb-6 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            La verdadera emisora del pueblo
          </h2>

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
        </div>

        {/* Stats strip */}
        <div className="mt-20 w-full animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="text-center mb-10">
              <span className="text-xs font-bold tracking-[0.3em] uppercase block mb-3" style={{ color: '#ff7626' }}>| NUESTRA RADIO |</span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                MÚSICA QUE TE<br />
                <span style={{ color: '#ff7626' }}>ACOMPAÑA SIEMPRE</span>
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '16px' }}>
              {[
                { 
                  v: "106.6", 
                  l: "FM Stereo",
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><line x1="17" y1="2" x2="17" y2="7"></line><rect x="6" y="11" width="4" height="7"></rect><rect x="14" y="11" width="4" height="7"></rect></svg>
                },
                { 
                  v: "24/7", 
                  l: "Transmisión",
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 19.1C3.1 17.3 2 14.8 2 12s1.1-5.3 2.9-7.1"/><path d="M19.1 4.9C20.9 6.7 22 9.2 22 12s-1.1 5.3-2.9 7.1"/><path d="M8.5 15.5C7.3 14.3 6.5 12.7 6.5 11s.8-3.3 2-4.5"/><path d="M15.5 8.5C16.7 9.7 17.5 11.3 17.5 13s-.8 3.3-2 4.5"/><circle cx="12" cy="12" r="2"/></svg>
                },
                { 
                  v: "+10K", 
                  l: "Oyentes",
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                },
              ].map((s) => (
                <div key={s.l} className="flex flex-col items-center text-center transition-transform hover:scale-105" style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,118,38,0.3)', borderRadius: '16px', padding: '24px', minWidth: '100px', flex: '1', maxWidth: '200px' }}>
                  <div className="flex items-center justify-center rounded-full mb-4 shrink-0" style={{ width: '60px', height: '60px', border: '1px solid #ff7626', color: '#ff7626' }}>
                    {s.icon}
                  </div>
                  <div className="text-2xl lg:text-3xl font-black text-white">{s.v}</div>
                  <div className="text-xs text-muted-foreground tracking-widest uppercase mt-1">{s.l}</div>
                  <div style={{ width: '30px', height: '2px', backgroundColor: '#ff7626', marginTop: '16px' }} />
                </div>
              ))}
            </div>
          </div>
      </div>

    </section>
  );
}
