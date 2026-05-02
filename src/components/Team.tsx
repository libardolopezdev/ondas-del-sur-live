import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Team() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      const { data } = await supabase.from("team").select("*").order("name", { ascending: true });
      if (data) setTeam(data);
      setLoading(false);
    }
    fetchTeam();
  }, []);

  return (
    <section id="equipo" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
        <div className="mb-12">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Nuestro equipo</span>
          <h2 className="text-4xl lg:text-6xl font-black mt-3">Las voces del Sur</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-slate-500 animate-pulse">Cargando equipo...</div>
          ) : (
            team.map((m) => (
              <div key={m.id} className="group relative">
                <div className="h-32 w-32 mx-auto rounded-3xl bg-gradient-brand flex items-center justify-center text-4xl font-black text-primary-foreground shadow-glow group-hover:scale-110 transition-transform duration-500">
                  {m.avatar_initials}
                </div>
                <div className="mt-4">
                  <h4 className="font-bold text-lg">{m.name}</h4>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest">{m.role}</p>
                  <p className="text-muted-foreground text-[10px] mt-1">{m.show} · {m.schedule}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
