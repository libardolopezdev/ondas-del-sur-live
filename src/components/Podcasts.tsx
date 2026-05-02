import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Mic, Play, Pause, Loader2 } from "lucide-react";
import type { Howl as HowlType } from "howler";

export function Podcasts() {
  const [pods, setPods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const soundRef = useRef<HowlType | null>(null);

  useEffect(() => {
    async function fetchPods() {
      const { data } = await supabase
        .from("featured_programs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      
      if (data) setPods(data);
      setLoading(false);
    }
    fetchPods();

    return () => {
      if (soundRef.current) soundRef.current.stop();
    };
  }, []);

  const handlePlay = async (pod: any) => {
    if (typeof window === 'undefined') return;
    if (playingId === pod.id) {
      if (soundRef.current?.playing()) {
        soundRef.current.pause();
      } else {
        soundRef.current?.play();
      }
      return;
    }

    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }

    if (!pod.audio_url) {
      alert("Este programa no tiene un audio disponible aún.");
      return;
    }

    const { Howl } = await import("howler");
    const sound = new Howl({
      src: [pod.audio_url],
      html5: true,
      onplay: () => setPlayingId(pod.id),
      onpause: () => {},
      onstop: () => setPlayingId(null),
      onend: () => setPlayingId(null),
    });

    soundRef.current = sound;
    sound.play();
  };

  return (
    <section id="podcast" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Bajo demanda</span>
            <h2 className="text-4xl lg:text-6xl font-black mt-3">Programas destacados</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">Entrevistas, repeticiones y contenido especial para escuchar cuando quieras.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {loading ? (
             <div className="col-span-full text-center py-12 text-slate-500 animate-pulse font-bold">Cargando programas...</div>
          ) : pods.map((p, i) => (
            <article key={i} className="group flex gap-5 p-5 lg:p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover-lift animate-fade-up" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="relative shrink-0">
                <div className="h-24 w-24 lg:h-28 lg:w-28 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
                   <Mic size={32} className="text-primary-foreground" />
                </div>
                <button 
                  onClick={() => handlePlay(p)}
                  className={`absolute inset-0 m-auto h-12 w-12 rounded-full backdrop-blur transition flex items-center justify-center shadow-2xl ${
                    playingId === p.id 
                      ? "bg-primary text-primary-foreground opacity-100" 
                      : "bg-background/80 text-primary opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {playingId === p.id ? <Pause size={20} /> : <Play size={20} fill="currentColor" className="translate-x-0.5" />}
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-widest uppercase mb-2">
                  <span>{p.date_label}</span><span>·</span><span className="text-primary font-mono">{p.duration}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition line-clamp-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                {playingId === p.id && (
                  <div className="mt-3 flex gap-1 h-3 items-end">
                    {[1,2,3,4,5].map(b => (
                      <div key={b} className={`w-1 bg-primary rounded-full animate-bounce-1`} style={{ animationDelay: `${b * 0.1}s`, height: `${Math.random() * 100}%` }} />
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
          {!loading && pods.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground italic">No hay programas destacados disponibles aún.</div>
          )}
        </div>
      </div>
    </section>
  );
}

