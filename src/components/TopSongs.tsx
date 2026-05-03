import { useState, useRef, useEffect } from "react";
import type { Howl as HowlType } from "howler";
import { Play, Pause, Loader2, Music } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function TopSongs() {
  const [songs, setSongs] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<{ [key: number]: string | null }>({});
  const [loadingSongs, setLoadingSongs] = useState(true);
  
  const soundRef = useRef<HowlType | null>(null);
  const progressInterval = useRef<any>(null);

  useEffect(() => {
    async function fetchSongs() {
      const { data } = await supabase
        .from("top_songs")
        .select("*")
        .order("position", { ascending: true });
      
      if (data) setSongs(data);
      setLoadingSongs(false);
    }
    fetchSongs();
  }, []);

  const fetchPreview = async (index: number) => {
    const song = songs[index];
    const query = encodeURIComponent(`${song.artist} ${song.title}`);
    const deezerUrl = `https://api.deezer.com/search?q=${query}&limit=1`;

    try {
      setLoadingId(index);
      
      // Utilizando JSONP para evitar problemas de CORS de forma nativa sin proxies
      const data = await new Promise<any>((resolve, reject) => {
        const callbackName = 'deezer_jsonp_' + Math.round(1000000 * Math.random());
        const script = document.createElement('script');
        script.src = `${deezerUrl}&output=jsonp&callback=${callbackName}`;
        
        (window as any)[callbackName] = (response: any) => {
          delete (window as any)[callbackName];
          document.body.removeChild(script);
          resolve(response);
        };
        
        script.onerror = () => {
          delete (window as any)[callbackName];
          document.body.removeChild(script);
          reject(new Error("JSONP failed"));
        };
        
        document.body.appendChild(script);
      });
      
      if (data.data && data.data.length > 0) {
        const previewUrl = data.data[0].preview;
        setPreviews(prev => ({ ...prev, [index]: previewUrl }));
        return previewUrl;
      } else {
        setPreviews(prev => ({ ...prev, [index]: null }));
        return null;
      }
    } catch (error) {
      console.error("Error fetching Deezer preview:", error);
      setPreviews(prev => ({ ...prev, [index]: null }));
      return null;
    } finally {
      setLoadingId(null);
    }
  };

  const handlePlay = async (index: number) => {
    if (typeof window === 'undefined') return;
    // If clicking the same song that is playing, toggle
    if (currentId === index && soundRef.current) {
      if (playing) {
        soundRef.current.pause();
        setPlaying(false);
      } else {
        soundRef.current.play();
        setPlaying(true);
      }
      return;
    }

    // Stop previous song
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
      clearInterval(progressInterval.current);
    }

    let url = previews[index];
    if (url === undefined) {
      url = await fetchPreview(index);
    }

    if (!url) {
      alert("Vista previa no disponible para esta canción");
      return;
    }

    const { Howl } = await import("howler");
    const sound = new Howl({
      src: [url],
      html5: true,
      onplay: () => {
        setPlaying(true);
        setCurrentId(index);
        progressInterval.current = setInterval(() => {
          if (soundRef.current) {
            const seek = soundRef.current.seek() as number;
            const duration = soundRef.current.duration();
            setProgress((seek / duration) * 100);
          }
        }, 100);
      },
      onpause: () => setPlaying(false),
      onstop: () => {
        setPlaying(false);
        setProgress(0);
        clearInterval(progressInterval.current);
      },
      onend: () => {
        setPlaying(false);
        setProgress(0);
        setCurrentId(null);
        clearInterval(progressInterval.current);
      }
    });

    soundRef.current = sound;
    sound.play();
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
      clearInterval(progressInterval.current);
    };
  }, []);

  const trendIcon = (t: string) => (t === "up" ? "▲" : t === "down" ? "▼" : "—");
  const trendColor = (t: string) => (t === "up" ? "text-primary" : t === "down" ? "text-destructive" : "text-muted-foreground");

  return (
    <section id="top" className="relative py-24 lg:py-32 bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Ranking semanal</span>
            <h2 className="text-4xl lg:text-6xl font-black mt-3">Top 10 más sonadas</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground max-w-sm">Las canciones más pedidas por nuestros oyentes esta semana en Ondas del Sur.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {loadingSongs ? (
            <div className="col-span-full text-center py-12 text-slate-500 animate-pulse">Cargando ranking...</div>
          ) : (
            songs.map((s, i) => (
              <div
                key={i}
                className={`group relative flex flex-col rounded-2xl border transition-all ${
                  currentId === i 
                    ? "bg-primary/5 border-primary/40 shadow-glow" 
                    : "bg-card/40 border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className={`text-3xl lg:text-4xl font-black w-12 text-right tabular-nums ${i < 3 ? "text-gradient-brand" : "text-muted-foreground/50"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  
                  <div className="relative h-14 w-14 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                    <Music className="text-primary-foreground" size={24} />
                    {currentId === i && playing && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                         <div className="flex gap-0.5 items-end h-6">
                            <div className="w-1 bg-white animate-bounce-1" />
                            <div className="w-1 bg-white animate-bounce-2" />
                            <div className="w-1 bg-white animate-bounce-3" />
                         </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate group-hover:text-primary transition">{s.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{s.artist} · {s.genre}</p>
                    {currentId === i && (
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 animate-pulse">
                        Vista previa 30s · Deezer
                      </p>
                    )}
                    {previews[i] === null && (
                      <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mt-1">
                        Vista previa no disponible
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-mono hidden sm:block ${trendColor(s.trend)}`}>
                      {trendIcon(s.trend)}
                    </span>
                    
                    <button 
                      onClick={() => handlePlay(i)}
                      disabled={loadingId === i}
                      aria-label={currentId === i && playing ? "Pausar reproducción" : "Reproducir canción"}
                      className={`h-12 w-12 rounded-full flex items-center justify-center transition shadow-lg ${
                        currentId === i && playing
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      {loadingId === i ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : currentId === i && playing ? (
                        <Pause size={20} />
                      ) : (
                        <Play size={20} fill="currentColor" />
                      )}
                    </button>
                  </div>
                </div>

                {currentId === i && (
                  <div className="h-1 bg-slate-800 w-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-100" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs font-medium text-muted-foreground italic">
            🎵 Las vistas previas son de 30 segundos · Escúchalas completas en tu plataforma favorita
          </p>
        </div>
      </div>
    </section>
  );
}
