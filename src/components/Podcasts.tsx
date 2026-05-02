const pods = [
  { title: "Entrevista al Alcalde Municipal", desc: "Hablamos sobre los proyectos en curso para Sativasur.", duration: "42:15", date: "Esta semana" },
  { title: "Tradición y Memoria Andina", desc: "Don Efraín comparte historias y costumbres de nuestros abuelos.", duration: "28:40", date: "Hace 1 semana" },
  { title: "Especial Día del Campesino", desc: "Voces, música y reconocimientos al hombre y la mujer del campo.", duration: "1:05:22", date: "Hace 2 semanas" },
  { title: "Mujeres Líderes de Boyacá", desc: "Conversación con mujeres que transforman la región.", duration: "38:10", date: "Hace 3 semanas" },
];

export function Podcasts() {
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
          {pods.map((p, i) => (
            <article key={i} className="group flex gap-5 p-5 lg:p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover-lift">
              <div className="relative shrink-0">
                <div className="h-24 w-24 lg:h-28 lg:w-28 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-primary-foreground"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zm7 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12z" /></svg>
                </div>
                <button className="absolute inset-0 m-auto h-10 w-10 rounded-full bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5"><path d="M8 5v14l11-7z" /></svg>
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-widest uppercase mb-2">
                  <span>{p.date}</span><span>·</span><span className="text-primary font-mono">{p.duration}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">{p.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
