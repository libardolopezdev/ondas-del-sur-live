const WHATSAPP = "https://wa.me/573232464160";

export function Participation() {
  return (
    <section id="contacto" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/15 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Participa</span>
          <h2 className="text-4xl lg:text-6xl font-black mt-3">Tu voz al aire</h2>
          <p className="text-muted-foreground mt-4 text-lg">Envíanos tu saludo, pide tu canción favorita o cuéntanos lo que pasa en tu vereda. Esta emisora es tuya.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* WhatsApp principal */}
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:col-span-2 group relative overflow-hidden rounded-3xl p-8 lg:p-10 bg-gradient-brand text-primary-foreground shadow-glow hover-lift"
          >
            <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-primary-foreground/10 blur-2xl" />
            <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold tracking-widest uppercase opacity-80">WhatsApp oficial</div>
                <h3 className="text-2xl lg:text-4xl font-black mt-1">Envía tu saludo por WhatsApp</h3>
                <p className="opacity-90 mt-2">+57 323 246 4160 · Conecta con la cabina al instante</p>
              </div>
              <span className="self-end lg:self-center inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary-foreground text-primary font-bold whitespace-nowrap group-hover:scale-105 transition-transform">
                Abrir chat
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:radialcomunitaria106.6@hotmail.com"
            className="group p-8 rounded-3xl glass hover-lift"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5 text-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>
            </div>
            <div className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Correo</div>
            <h3 className="font-bold text-lg leading-tight break-all group-hover:text-primary transition">radialcomunitaria106.6@hotmail.com</h3>
          </a>

          {/* Cabina */}
          <div className="p-8 rounded-3xl glass">
            <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5 text-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.07 15.07 0 0 1-6.59-6.58l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/></svg>
            </div>
            <div className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Cabina</div>
            <h3 className="font-bold text-lg leading-tight">+57 323 246 4160</h3>
            <p className="text-sm text-muted-foreground mt-2">Llámanos durante la transmisión en vivo.</p>
          </div>

          {/* Redes */}
          <div className="lg:col-span-2 p-8 rounded-3xl glass flex flex-col sm:flex-row sm:items-center gap-6">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Síguenos</div>
              <h3 className="font-bold text-lg">Conéctate en redes sociales</h3>
            </div>
            <div className="flex flex-wrap gap-3 sm:ml-auto">
              {[
                { l: "Facebook", p: "M9 8h-3v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" },
                { l: "Instagram", p: "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.18 8.8 2.16 12 2.16zm0 5.18a4.66 4.66 0 1 0 0 9.32 4.66 4.66 0 0 0 0-9.32zm0 7.69a3.03 3.03 0 1 1 0-6.06 3.03 3.03 0 0 1 0 6.06zm5.92-7.94a1.09 1.09 0 1 1-2.18 0 1.09 1.09 0 0 1 2.18 0z" },
                { l: "YouTube", p: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" },
                { l: "TikTok", p: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.45a8.16 8.16 0 0 0 4.77 1.52V6.5a4.78 4.78 0 0 1-1.84-.81z" },
              ].map((s) => (
                <a
                  key={s.l}
                  href="#"
                  aria-label={s.l}
                  className="h-12 w-12 rounded-full bg-secondary hover:bg-gradient-brand hover:text-primary-foreground flex items-center justify-center transition-all hover:scale-110"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={s.p} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
