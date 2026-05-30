import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

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
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs text-muted-foreground tracking-widest uppercase mb-2">
                    {new Date(n.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition leading-tight">{n.title}</h3>
                  <div 
                    className="text-sm text-muted-foreground mb-4 line-clamp-3 prose prose-sm prose-invert max-w-none w-full break-words overflow-wrap-anywhere"
                    dangerouslySetInnerHTML={{ __html: n.body }} 
                    style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                  />
                  <div className="mt-auto pt-4">
                    {n.url && n.url !== "null" && typeof n.url === "string" && n.url.trim() !== "" ? (
                      <a href={n.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff7626] cursor-pointer hover:underline">
                        Leer más
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </a>
                    ) : (
                      <button 
                        onClick={() => setExpandedId(n)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#ff7626] px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#ff7626]/80 transition-colors"
                      >
                        Leer nota completa
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {expandedId && typeof expandedId === 'object' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setExpandedId(null)}>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setExpandedId(null)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-primary text-white rounded-full transition-colors backdrop-blur">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="relative aspect-[16/9] w-full bg-slate-800">
               <img src={expandedId.image_url || "https://placehold.co/800x450/0F172A/white?text=Noticias"} className="w-full h-full object-cover" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>
            <div className="p-6 md:p-10 -mt-10 relative z-10">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black rounded uppercase tracking-widest">{expandedId.category}</span>
              <h2 className="text-2xl md:text-4xl font-black mt-4 mb-2 leading-tight">{expandedId.title}</h2>
              <div className="text-sm text-muted-foreground tracking-widest uppercase mb-8 border-b border-slate-800 pb-6 flex items-center justify-between">
                <span>{new Date(expandedId.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <button 
                  onClick={() => {
                    const url = `${window.location.origin}/noticias?id=${expandedId.id}`;
                    if (navigator.share) {
                      navigator.share({ title: expandedId.title, url }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(url);
                      alert("¡Enlace copiado al portapapeles!");
                    }
                  }}
                  className="flex items-center gap-2 text-primary hover:text-white transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                  Compartir
                </button>
              </div>
              <div 
                className="prose prose-invert prose-lg max-w-none w-full break-words overflow-wrap-anywhere" 
                dangerouslySetInnerHTML={{ __html: expandedId.body }} 
                style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
