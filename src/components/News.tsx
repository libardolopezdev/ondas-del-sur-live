import n1 from "@/assets/news-1.jpg";
import n2 from "@/assets/news-2.jpg";
import n3 from "@/assets/news-3.jpg";

const news = [
  {
    img: n1,
    cat: "Local",
    title: "Sativasur celebra obras de mejoramiento en sus vías rurales",
    excerpt: "La administración municipal entregó nuevos tramos pavimentados que conectan veredas con el casco urbano.",
    date: "Hoy",
  },
  {
    img: n2,
    cat: "Comunidad",
    title: "Mercado campesino reúne a productores de toda la provincia",
    excerpt: "Más de 40 familias campesinas participaron en la jornada de comercialización este fin de semana.",
    date: "Ayer",
  },
  {
    img: n3,
    cat: "Cultura",
    title: "Festival de danzas tradicionales llena de color a Sativasur",
    excerpt: "Grupos folclóricos de Boyacá engalanaron la plaza principal en una noche inolvidable para la región.",
    date: "Hace 2 días",
  },
];

export function News() {
  return (
    <section id="noticias" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Información</span>
            <h2 className="text-4xl lg:text-6xl font-black mt-3">Noticias y actualidad</h2>
          </div>
          <a href="#" className="text-sm font-semibold text-primary hover:underline">Ver todas →</a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <article key={i} className="group rounded-2xl overflow-hidden bg-card border border-border hover-lift">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={n.img} alt={n.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold tracking-widest uppercase">
                  {n.cat}
                </span>
              </div>
              <div className="p-6">
                <div className="text-xs text-muted-foreground tracking-widest uppercase mb-2">{n.date}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition leading-tight">{n.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{n.excerpt}</p>
                <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Leer más
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
