import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";

const items = [
  { img: g1, label: "La cabina", cls: "lg:col-span-2 lg:row-span-2" },
  { img: g2, label: "Nuestra comunidad" },
  { img: g3, label: "Eventos" },
  { img: g4, label: "Locutores" },
];

export function Gallery() {
  return (
    <section id="galeria" className="relative py-24 lg:py-32 bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Galería</span>
          <h2 className="text-4xl lg:text-6xl font-black mt-3">Momentos de la emisora</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 lg:gap-4 lg:h-[600px]">
          {items.map((it, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-2xl ${it.cls ?? ""}`}>
              <img src={it.img} alt={it.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <span className="text-xs tracking-widest uppercase text-primary font-bold">Foto</span>
                <h3 className="text-xl lg:text-2xl font-black mt-1">{it.label}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
