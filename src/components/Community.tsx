const items = [
  { icon: "📢", tag: "Comunicado", title: "Suspensión temporal de servicio de agua", body: "El acueducto veredal informa mantenimiento el sábado de 8am a 12m." },
  { icon: "🛒", tag: "Clasificado", title: "Vendo terreno en vereda El Carmen", body: "1.5 hectáreas con agua, luz y vía de acceso. Contacto al 320 555 1234." },
  { icon: "🎉", tag: "Evento", title: "Misa de aguinaldos en la parroquia", body: "Acompáñanos cada noche a partir del 16 de diciembre. ¡Trae tu villancico!" },
  { icon: "📣", tag: "Anuncio", title: "Convocatoria a líderes comunales", body: "Reunión municipal este viernes para socializar el plan de desarrollo 2026." },
  { icon: "💛", tag: "Solidaridad", title: "Apoyo a familia afectada por incendio", body: "Recepción de donaciones en las instalaciones de la emisora." },
  { icon: "🐄", tag: "Agro", title: "Jornada de vacunación bovina", body: "Brigada del ICA recorrerá las veredas la próxima semana. Inscripciones abiertas." },
];

export function Community() {
  return (
    <section id="comunidad" className="relative py-24 lg:py-32 bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Servicios sociales</span>
          <h2 className="text-4xl lg:text-6xl font-black mt-3">La voz de la comunidad</h2>
          <p className="text-muted-foreground mt-4">Comunicados, clasificados, eventos y mensajes de interés general que mantienen unido a Sativasur.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-card/60 border border-border hover:border-primary/50 transition-all hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-brand/20 border border-primary/30 flex items-center justify-center text-2xl">
                  {it.icon}
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-primary">{it.tag}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition">{it.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
