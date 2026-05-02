const songs = [
  { t: "Olvídala", a: "Binomio de Oro", g: "Vallenato", trend: "up" },
  { t: "Para Tu Amor", a: "Juanes", g: "Pop Latino", trend: "up" },
  { t: "La Tierra del Olvido", a: "Carlos Vives", g: "Tropical", trend: "same" },
  { t: "Solo Para Ti", a: "Camilo", g: "Pop", trend: "up" },
  { t: "El Cantante", a: "Héctor Lavoe", g: "Salsa", trend: "down" },
  { t: "Pueblito Viejo", a: "Garzón y Collazos", g: "Andina", trend: "same" },
  { t: "Nuestro Juramento", a: "Julio Jaramillo", g: "Bolero", trend: "up" },
  { t: "Colombia Tierra Querida", a: "Lucho Bermúdez", g: "Cumbia", trend: "down" },
  { t: "Que Bonita Es Esta Vida", a: "Jorge Celedón", g: "Vallenato", trend: "up" },
  { t: "El Amor de Mi Vida", a: "Camilo Sesto", g: "Balada", trend: "same" },
];

const trendIcon = (t: string) =>
  t === "up" ? "▲" : t === "down" ? "▼" : "—";
const trendColor = (t: string) =>
  t === "up" ? "text-primary" : t === "down" ? "text-destructive" : "text-muted-foreground";

export function TopSongs() {
  return (
    <section id="top" className="relative py-24 lg:py-32 bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Ranking semanal</span>
            <h2 className="text-4xl lg:text-6xl font-black mt-3">Top 10 más sonadas</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">Las canciones más pedidas por nuestros oyentes esta semana en Ondas del Sur.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-3">
          {songs.map((s, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 p-4 rounded-xl bg-card/40 border border-border hover:border-primary/40 hover:bg-card/70 transition-all"
            >
              <div className={`text-3xl lg:text-4xl font-black w-12 text-right tabular-nums ${i < 3 ? "text-gradient-brand" : "text-muted-foreground/50"}`}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="relative h-14 w-14 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0 overflow-hidden">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-primary-foreground"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{s.t}</h3>
                <p className="text-sm text-muted-foreground truncate">{s.a} · {s.g}</p>
              </div>
              <span className={`text-xs font-mono ${trendColor(s.trend)}`}>{trendIcon(s.trend)}</span>
              <button className="h-9 w-9 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
