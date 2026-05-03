import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Schedule() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentDayName, setCurrentDayName] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      const { data: shows } = await supabase.from("shows").select("*").order("time_start", { ascending: true });
      const { data: sett } = await supabase.from("settings").select("auto_schedule").single();
      
      if (shows) setSchedule(shows);
      if (sett) setSettings(sett);
      setLoading(false);
    }
    fetchData();

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.getHours() * 100 + now.getMinutes());
      const daysWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      setCurrentDayName(daysWeek[now.getDay()]);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 10000);

    const channel = supabase
      .channel("schedule-updates")
      .on("postgres_changes", { event: "*", table: "shows" }, () => fetchData())
      .on("postgres_changes", { event: "*", table: "settings" }, () => fetchData())
      .subscribe();

    return () => { 
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const isShowLive = (show: any) => {
    // Si está marcado como manual, manda
    if (show.is_live) return true;
    
    // Si el modo automático está apagado, solo cuenta el is_live
    if (!settings?.auto_schedule) return false;

    // Lógica automática
    const start = parseInt(show.time_start.replace(/:/g, ""));
    const end = parseInt(show.time_end.replace(/:/g, ""));
    const dayMatches = show.days.toLowerCase().includes(currentDayName.toLowerCase()) || show.days.toLowerCase().includes("todos");
    
    return currentTime >= start && currentTime < end && dayMatches;
  };

  return (
    <section id="programacion" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Parrilla</span>
            <h2 className="text-4xl lg:text-6xl font-black mt-3">Programación de hoy</h2>
            <p className="text-muted-foreground mt-3 max-w-lg">Acompáñanos durante todo el día con la mejor música, noticias y la voz de nuestra gente.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 lg:mx-0 lg:px-0 lg:pb-0 w-full lg:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d, i) => {
               const dayIndex = [1,2,3,4,5,6,0][i]; // Corregir índice para que coincida con Date()
               const isToday = new Date().getDay() === dayIndex;
               return (
                <button
                  key={d}
                  className={`h-10 w-10 shrink-0 rounded-full text-xs font-semibold transition ${
                    isToday ? "bg-gradient-brand text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-primary"
                  }`}
                >
                  {d}
                </button>
               );
            })}
          </div>
        </div>

        <div className="grid gap-3">
          {loading ? (
            <div className="text-center py-12 text-slate-500 animate-pulse">Cargando programación...</div>
          ) : (
            schedule.map((s) => {
              const live = isShowLive(s);
              return (
                <div
                  key={s.id}
                  className={`group relative flex flex-col lg:grid lg:grid-cols-[180px_1fr_auto_auto] lg:items-center gap-3 lg:gap-6 p-4 lg:p-5 rounded-2xl border transition-all hover-lift ${
                    live
                      ? "bg-gradient-to-r from-primary/15 to-transparent border-primary/40 shadow-glow"
                      : "bg-card/40 border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex justify-between items-center lg:block">
                    <div className="font-mono text-sm lg:text-base text-muted-foreground tracking-tight">
                      {s.time_start.substring(0, 5)} — {s.time_end.substring(0, 5)}
                    </div>
                    {/* Indicador Móvil */}
                    <div className="lg:hidden shrink-0 ml-3">
                      {live ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-live tracking-widest uppercase">
                          <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulse-live" /> EN VIVO
                        </span>
                      ) : (
                        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider px-2 py-1 bg-slate-800/50 rounded-md block max-w-[120px] truncate">
                          {s.days}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg lg:text-xl font-bold leading-tight mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">con {s.host}</p>
                  </div>

                  <span className="hidden lg:inline-flex items-center px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                    {s.tag}
                  </span>

                  {/* Indicador Escritorio */}
                  <div className="hidden lg:flex items-center gap-2">
                    {live ? (
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-live tracking-widest uppercase">
                        <span className="h-2 w-2 rounded-full bg-live animate-pulse-live" /> Al aire
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-2 py-1 bg-slate-800/50 rounded truncate max-w-[200px]">
                        {s.days}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
          {!loading && schedule.length === 0 && (
            <div className="text-center py-20 text-muted-foreground italic">No hay programas programados para hoy.</div>
          )}
        </div>
      </div>
    </section>
  );
}
