import logo from "@/assets/logo-v4.webp";

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-border">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Ondas del Sur" className="h-16 sm:h-20 w-auto object-contain rounded-[10%] shadow-glow" loading="lazy" />
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Emisora comunitaria al servicio de Sativasur, Boyacá. La verdadera emisora del pueblo, transmitiendo música, noticias y la voz de nuestra gente las 24 horas del día.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm tracking-widest uppercase text-primary">Navegación</h4>
            <ul className="space-y-2 text-sm">
              {[
                ["#en-vivo", "En vivo"],
                ["#programacion", "Programación"],
                ["#top", "Top 10"],
                ["#noticias", "Noticias"],
                ["#galeria", "Galería"],
              ].map(([h, l]) => (
                <li key={h}><a href={h} className="text-muted-foreground hover:text-primary transition">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm tracking-widest uppercase text-primary">Contacto</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mt-1 text-primary shrink-0"><path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 11.5 7.3 11.7.4.3 1 .3 1.4 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                Sativasur, Boyacá, Colombia
              </li>
              <li>
                <a href="mailto:radialcomunitaria106.6@hotmail.com" className="hover:text-primary transition break-all">
                  radialcomunitaria106.6@hotmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/573232464160" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                  WhatsApp +57 323 246 4160
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Ondas del Sur 106.6 FM Stereo. Todos los derechos reservados.</p>
          <p className="tracking-widest uppercase">La Verdadera Emisora del Pueblo</p>
        </div>
      </div>
    </footer>
  );
}
