import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Gallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      const { data } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setItems(data);
      setLoading(false);
    }
    fetchGallery();
  }, []);

  return (
    <section id="galeria" className="relative py-24 lg:py-32 bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Galería</span>
          <h2 className="text-4xl lg:text-6xl font-black mt-3">Momentos de la emisora</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 lg:gap-4 lg:h-[600px]">
          {loading ? (
             <div className="col-span-full text-center py-12 text-slate-500 animate-pulse">Cargando galería...</div>
          ) : (
            items.map((it, i) => (
              <div 
                key={it.id} 
                className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
              >
                <img 
                  src={it.image_url} 
                  alt={it.caption} 
                  width={600} 
                  height={400} 
                  loading="lazy" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="text-xs tracking-widest uppercase text-primary font-bold">
                    {it.event_name || "Foto"}
                  </span>
                  <h3 className="text-xl lg:text-2xl font-black mt-1 line-clamp-1">{it.caption}</h3>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
