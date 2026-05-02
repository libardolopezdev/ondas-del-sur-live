import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, string> = {
  'Comunicado': '📢',
  'Evento': '🎉',
  'Clasificado': '🛒',
  'Urgente': '🚨',
  'Anuncio': '📣',
  'Solidaridad': '💛',
  'Agro': '🐄'
};

export function Community() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase
        .from("social_services")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: false });
      
      if (data) setItems(data);
      setLoading(false);
    }
    fetchItems();
  }, []);

  return (
    <section id="comunidad" className="relative py-24 lg:py-32 bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Servicios sociales</span>
          <h2 className="text-4xl lg:text-6xl font-black mt-3">La voz de la comunidad</h2>
          <p className="text-muted-foreground mt-4">Comunicados, clasificados, eventos y mensajes de interés general que mantienen unido a Sativasur.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
             <div className="col-span-full text-center py-12 text-slate-500 animate-pulse font-bold">Cargando anuncios...</div>
          ) : items.map((it, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-card/60 border border-border hover:border-primary/50 transition-all hover-lift animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-brand/20 border border-primary/30 flex items-center justify-center text-2xl">
                  {iconMap[it.category] || '📢'}
                </div>
                <div className="text-right">
                   <span className="block text-[10px] font-bold tracking-widest uppercase text-primary">{it.category}</span>
                   <span className="block text-[9px] text-muted-foreground font-mono mt-1">{it.date}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition">{it.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{it.description}</p>
            </div>
          ))}
          {!loading && items.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground italic">No hay servicios sociales publicados en este momento.</div>
          )}
        </div>
      </div>
    </section>
  );
}
