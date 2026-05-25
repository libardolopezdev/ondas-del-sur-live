import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const { data } = await supabase
        .from("news")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: false })
        .limit(3);
      if (data) setNews(data);
      setLoading(false);
    }
    fetchNews();
  }, []);

  return (
    <section id="noticias" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Información</span>
            <h2 className="text-4xl lg:text-6xl font-black mt-3">Noticias y actualidad</h2>
          </div>
          <Link to="/noticias" className="text-sm font-semibold text-primary hover:underline">Ver todas →</Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full text-center py-12 text-slate-500 animate-pulse">Cargando noticias...</div>
          ) : (
            news.map((n) => (
              <article key={n.id} className="group rounded-2xl overflow-hidden bg-card border border-border hover-lift">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={n.image_url || "https://placehold.co/600x400/0F172A/white?text=Noticias"} 
                    alt={n.title} 
                    width={400} 
                    height={250} 
                    loading="lazy" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold tracking-widest uppercase">
                    {n.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="text-xs text-muted-foreground tracking-widest uppercase mb-2">
                    {new Date(n.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition leading-tight">{n.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{n.body}</p>
                  {n.url && (
                    <a href={n.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer">
                      Leer más
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </a>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
