import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { Equalizer } from "./Equalizer";
import { LiveBadge } from "./LiveBadge";

import { useSettings } from "@/hooks/useSettings";

const DEFAULT_STREAM_URL = "https://sonic.paulatina.co/8036/stream";

export function LivePlayer() {
  const { settings } = useSettings();
  const streamUrl = settings?.stream_url || DEFAULT_STREAM_URL;
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume / 100);
    }
  }, [volume]);

  const togglePlay = () => {
    if (playing) {
      soundRef.current?.pause();
      setPlaying(false);
    } else {
      setError(null);
      if (!soundRef.current) {
        setLoading(true);
        soundRef.current = new Howl({
          src: [streamUrl],
          html5: true,
          format: ["mp3"],
          volume: volume / 100,
          onload: () => {
            setLoading(false);
            soundRef.current?.play();
          },
          onplay: () => {
            setPlaying(true);
            setLoading(false);
          },
          onpause: () => setPlaying(false),
          onstop: () => setPlaying(false),
          onloaderror: () => {
            setError("Error de conexión con la señal");
            setLoading(false);
            setPlaying(false);
            soundRef.current = null;
          },
          onplayerror: () => {
            setError("Error al reproducir la señal");
            setLoading(false);
            setPlaying(false);
            soundRef.current?.unload();
            soundRef.current = null;
          },
        });
      } else {
        soundRef.current.play();
      }
    }
  };

  return (
    <section id="en-vivo" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-surface" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Reproductor</span>
          <h2 className="text-4xl lg:text-6xl font-black mt-3">Sintoniza la señal</h2>
        </div>

        <div className="glass rounded-3xl p-6 lg:p-10 shadow-elevated">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Album/cover */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-brand blur-2xl opacity-50" />
              <div className="relative h-44 w-44 lg:h-56 lg:w-56 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow overflow-hidden">
                <div className={`absolute inset-0 ${playing ? "animate-spin" : ""}`} style={{ animationDuration: "20s" }}>
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary-foreground/30" />
                </div>
                <span className="relative text-6xl lg:text-7xl font-black text-primary-foreground">106.6</span>
              </div>
            </div>

            {/* Info + controls */}
            <div className="flex-1 w-full text-center lg:text-left">
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-3">
                <LiveBadge />
                <span className="text-xs text-muted-foreground tracking-widest uppercase">
                  {playing ? "En vivo · FM 106.6" : "Ahora suena"}
                </span>
              </div>

              <h3 className="text-2xl lg:text-4xl font-black mb-1">Ondas del Sur</h3>
              <p className="text-muted-foreground mb-6">
                La señal que nos une desde el corazón de Boyacá · <span className="text-primary font-semibold">106.6 FM Stereo</span>
              </p>

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-fade-up">
                  {error}. Por favor, intenta de nuevo.
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center gap-4 justify-center lg:justify-start mb-6">
                <button
                  onClick={togglePlay}
                  disabled={loading}
                  aria-label={playing ? "Pausar" : "Reproducir"}
                  className={`h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-gradient-brand flex items-center justify-center shadow-glow hover:scale-105 transition-transform ${loading ? "opacity-70 cursor-wait" : ""}`}
                >
                  {loading ? (
                    <div className="h-6 w-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : playing ? (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="text-primary-foreground"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
                  ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="text-primary-foreground translate-x-0.5"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>

                <div className="flex items-center gap-3 ml-4 min-w-[80px]">
                  {playing ? (
                    <div className="flex items-center gap-3">
                      <Equalizer bars={4} />
                      <span className="text-xs text-primary font-bold animate-pulse-live">PLAYING</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">{loading ? "Conectando..." : "Detenido"}</span>
                  )}
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 max-w-sm mx-auto lg:mx-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground shrink-0">
                  <path d="M3 9v6h4l5 5V4L7 9H3z" />
                </svg>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-1 rounded-full bg-muted appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-glow"
                  style={{ background: `linear-gradient(to right, oklch(0.74 0.19 48) 0%, oklch(0.74 0.19 48) ${volume}%, oklch(0.26 0.030 262) ${volume}%)` }}
                />
                <span className="text-xs font-mono text-muted-foreground w-8 text-right">{volume}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="mt-10 overflow-hidden border-y border-border py-4">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-12 shrink-0">
                {["Música del recuerdo", "Noticias locales", "Saludos de la comunidad", "Música popular", "Eventos de Sativasur", "Voces de Boyacá", "106.6 FM Stereo"].map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
