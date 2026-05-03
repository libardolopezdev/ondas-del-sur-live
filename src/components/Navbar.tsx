import { useEffect, useState } from "react";
import logo137 from "@/assets/logo-137w.webp";
import logo274 from "@/assets/logo-274w.webp";

const links = [
  { href: "#en-vivo", label: "En vivo" },
  { href: "#programacion", label: "Programación" },
  { href: "#top", label: "Top 10" },
  { href: "#noticias", label: "Noticias" },
  { href: "#comunidad", label: "Comunidad" },
  { href: "#galeria", label: "Galería" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-elevated" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group relative">
          <img 
            src={logo137} 
            srcSet={`${logo137} 137w, ${logo274} 274w`}
            sizes="(min-width: 640px) 160px, 137px"
            width={137}
            height={64}
            alt="Ondas del Sur" 
            className="h-12 sm:h-14 w-auto object-contain rounded-[10%] shadow-glow transition-transform group-hover:scale-105" 
          />
        </a>

        <ul className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-foreground/80 hover:text-primary transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#en-vivo"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-brand text-primary-foreground text-sm font-semibold shadow-glow hover:scale-105 transition-transform"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary-foreground/60 animate-pulse-live" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
            </span>
            Escuchar
          </a>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menú"
            className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-full glass"
          >
            <span className="flex flex-col gap-1">
              <span className={`block h-0.5 w-5 bg-foreground transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-foreground transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden glass border-t border-border animate-fade-up">
          <ul className="px-5 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-lg text-foreground/90 hover:bg-primary/10 hover:text-primary transition"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
