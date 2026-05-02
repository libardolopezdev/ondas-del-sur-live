const schedule = [
  { time: "05:00 — 08:00", name: "Amanecer Andino", host: "Pedro Niño", tag: "Música popular" },
  { time: "08:00 — 11:00", name: "Mañanas del Sur", host: "Carlos Ramírez", tag: "Magazine", live: true },
  { time: "11:00 — 13:00", name: "Voces de la Comunidad", host: "María Fernanda", tag: "Comunitario" },
  { time: "13:00 — 15:00", name: "Almuerzo Musical", host: "DJ Sativa", tag: "Variedad" },
  { time: "15:00 — 17:00", name: "Noticias del Pueblo", host: "Luis Hernández", tag: "Información" },
  { time: "17:00 — 20:00", name: "Tardeando", host: "Andrea Castillo", tag: "Música" },
  { time: "20:00 — 22:00", name: "Boleros y Recuerdos", host: "Don Efraín", tag: "Romántico" },
  { time: "22:00 — 00:00", name: "Noche Latina", host: "Auto DJ", tag: "Salsa & Tropical" },
];

export function Schedule() {
  return (
    <section id="programacion" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Parrilla</span>
            <h2 className="text-4xl lg:text-6xl font-black mt-3">Programación de hoy</h2>
            <p className="text-muted-foreground mt-3 max-w-lg">Acompáñanos durante todo el día con la mejor música, noticias y la voz de nuestra gente.</p>
          </div>
          <div className="flex gap-2">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d, i) => (
              <button
                key={d}
                className={`h-10 w-10 rounded-full text-xs font-semibold transition ${
                  i === 1 ? "bg-gradient-brand text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-primary"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {schedule.map((s, i) => (
            <div
              key={i}
              className={`group relative grid grid-cols-[auto_1fr_auto] lg:grid-cols-[180px_1fr_auto_auto] items-center gap-4 lg:gap-6 p-5 rounded-2xl border transition-all hover-lift ${
                s.live
                  ? "bg-gradient-to-r from-primary/15 to-transparent border-primary/40 shadow-glow"
                  : "bg-card/40 border-border hover:border-primary/30"
              }`}
            >
              <div className="font-mono text-sm lg:text-base text-muted-foreground tracking-tight">{s.time}</div>
              <div className="min-w-0">
                <h3 className="text-lg lg:text-xl font-bold truncate">{s.name}</h3>
                <p className="text-sm text-muted-foreground truncate">con {s.host}</p>
              </div>
              <span className="hidden lg:inline-flex items-center px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                {s.tag}
              </span>
              <div className="flex items-center gap-2">
                {s.live ? (
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-live tracking-widest uppercase">
                    <span className="h-2 w-2 rounded-full bg-live animate-pulse-live" /> Al aire
                  </span>
                ) : (
                  <button className="opacity-0 group-hover:opacity-100 transition text-primary text-xs font-semibold">
                    Recordar →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
