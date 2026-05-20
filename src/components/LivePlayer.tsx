import { useState, useEffect, useRef } from "react";
import type { Howl as HowlType } from "howler";
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
  const soundRef = useRef<HowlType | null>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const [coverSize, setCoverSize] = useState(176); // tamaño por defecto (h-44 = 176px)

  const [songTitle, setSongTitle] = useState<string>("Ondas del Sur");
  const [songArtist, setSongArtist] = useState<string>("La señal que nos une desde el corazón de Boyacá");
  const [artwork, setArtwork] = useState<string | null>(null);
  const [fadeAnim, setFadeAnim] = useState(false);
  
  const currentTitleRef = useRef("Ondas del Sur");

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch("https://api.allorigins.win/raw?url=https://sonic.paulatina.co/8036/status-json.xsl");
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error("Invalid JSON response");
        }
        
        if (!data?.icestats?.source) throw new Error("No source in icestats");
        
        const sources = Array.isArray(data.icestats.source) ? data.icestats.source : [data.icestats.source];
        const source = sources.find(s => s && s.title) || sources[0];
        
        if (!source) throw new Error("No valid source found");

        const fullTitle = source.title || "";
        let newArtist = "Ondas del Sur";
        let newTitle = "FM 106.6";

        if (fullTitle.includes(" - ")) {
          const parts = fullTitle.split(" - ");
          newArtist = parts[0].trim();
          newTitle = parts.slice(1).join(" - ").trim();
        } else if (fullTitle) {
          newTitle = fullTitle;
          newArtist = "Ondas del Sur · FM 106.6";
        }

        if (newTitle !== currentTitleRef.current && fullTitle !== "") {
          currentTitleRef.current = newTitle;
          
          let newArtwork = null;
          try {
            const dzQuery = encodeURIComponent(newArtist + " " + newTitle);
            const dzUrl = `https://api.deezer.com/search?q=${dzQuery}&limit=1`;
            const dzRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(dzUrl)}`);
            const dzData = await dzRes.json();
            if (dzData.data && dzData.data.length > 0) {
              newArtwork = dzData.data[0].album.cover_medium;
            }
          } catch (e) {
            // Silently ignore deezer fetch errors
          }

          setFadeAnim(true);
          
          setTimeout(() => {
            setSongTitle(newTitle);
            setSongArtist(newArtist);
            setArtwork(newArtwork);
            setFadeAnim(false);
          }, 300);
        }
      } catch (err) {
        // Silently ignore metadata fetch errors to prevent console noise
      }
    };

    fetchMetadata();
    const interval = setInterval(fetchMetadata, 30000);
    return () => clearInterval(interval);
  }, []);

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

  // Medir el contenedor de la portada para calcular el radio del visualizador
  useEffect(() => {
    const el = coverRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setCoverSize(entry.contentRect.width);
      }
    });
    ro.observe(el);
    setCoverSize(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const togglePlay = async () => {
    if (playing) {
      soundRef.current?.pause();
      setPlaying(false);
    } else {
      setError(null);
      if (!soundRef.current) {
        if (typeof window === 'undefined') return;
        setLoading(true);
        const { Howl } = await import("howler");
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
              <div ref={coverRef} className="relative h-44 w-44 lg:h-56 lg:w-56 rounded-2xl bg-card border border-border flex items-center justify-center shadow-glow overflow-hidden group">
                
                {/* Fallback / Background */}
                <div className={`absolute inset-0 bg-gradient-brand transition-opacity duration-500 ${artwork ? 'opacity-0' : 'opacity-100'}`} />
                {!artwork && (
                  <>
                    <style>{`
                      @keyframes bar-pulse-scale {
                        0%   { transform: scaleY(0.2); }
                        100% { transform: scaleY(1); }
                      }
                    `}</style>

                    {/* Círculo punteado giratorio — solo visible cuando NO playing */}
                    <div
                      className="absolute inset-0 animate-spin"
                      style={{
                        animationDuration: '20s',
                        opacity: playing ? 0 : 1,
                        transition: 'opacity 0.5s ease',
                      }}
                    >
                      <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary-foreground/30" />
                    </div>

                    {/* Visualizador radial circular — patrón pivot-zero */}
                    <div
                      className="absolute inset-0"
                      style={{
                        opacity: playing ? 1 : 0,
                        transition: 'opacity 0.6s ease',
                        pointerEvents: 'none',
                      }}
                    >
                      {(() => {
                        const BAR_COUNT = 40;
                        // Radio interno: ~55% del ancho del contenedor / 2
                        // h-44 = 176px → radio ~48px | lg:h-56 = 224px → radio ~62px
                        // Usamos CSS variable vía un ref para ser reactivos al tamaño real
                        return Array.from({ length: BAR_COUNT }).map((_, i) => {
                          const angle = (i / BAR_COUNT) * 360;
                          const duration = 0.5 + (i % 7) * 0.1;
                          const delay = (i % 11) * 0.06;
                          const barH = 8 + (i % 5) * 5; // 8–28px
                          return (
                            <div
                              key={i}
                              style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                width: 0,
                                height: 0,
                                transform: `rotate(${angle}deg)`,
                              }}
                            >
                          <span
                                style={{
                                  display: 'block',
                                  position: 'absolute',
                                  width: '3px',
                                  height: `${barH}px`,
                                  left: '-1.5px',
                                  // Radio dinámico: 50% del tamaño real menos un margen para el texto
                                  bottom: `${Math.round(coverSize * 0.29)}px`,
                                  borderRadius: '2px',
                                  backgroundColor: '#000000',
                                  opacity: 0.55 + (i % 5) * 0.09,
                                  transformOrigin: 'bottom center',
                                  animation: playing
                                    ? `bar-pulse-scale ${duration}s ease-in-out ${delay}s infinite alternate`
                                    : 'none',
                                }}
                              />
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* 106.6 — siempre centrado y visible */}
                    <span
                      className="relative font-black text-primary-foreground z-10"
                      style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}
                    >
                      106.6
                    </span>
                  </>
                )}

                {/* Artwork */}
                {artwork && (
                  <img 
                    src={artwork} 
                    alt={songTitle} 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${fadeAnim ? 'opacity-0' : 'opacity-100'}`}
                    onError={(e) => {
                       (e.target as HTMLImageElement).src = "https://placehold.co/300x300/1E293B/white?text=🎵";
                    }}
                  />
                )}
                
                {/* Live pulsing badge on artwork */}
                <div className="absolute top-3 right-3 px-2 py-1 bg-live/90 backdrop-blur-md rounded border border-live-foreground/20 flex items-center gap-1.5 z-10 shadow-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-live-foreground animate-pulse-live" />
                  <span className="text-[9px] font-black tracking-widest text-live-foreground uppercase">En vivo</span>
                </div>
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

              <div className={`transition-all duration-300 ${fadeAnim ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"}`}>
                <h3 className="text-2xl lg:text-4xl font-black mb-1 line-clamp-1" title={songTitle}>{songTitle}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-1" title={songArtist}>
                  {songArtist}
                </p>
              </div>

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
                  aria-label={playing ? "Pausar reproducción" : "Reproducir radio en vivo"}
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
                <label htmlFor="volume-slider" className="sr-only">Control de volumen</label>
                <button aria-label="Control de volumen" className="shrink-0" onClick={() => setVolume(volume === 0 ? 70 : 0)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground">
                    <path d="M3 9v6h4l5 5V4L7 9H3z" />
                  </svg>
                </button>
                <input
                  id="volume-slider"
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
