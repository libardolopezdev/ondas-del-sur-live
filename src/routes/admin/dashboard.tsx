import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, Suspense, lazy } from "react";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/hooks/useSettings";
import { ContextHelp } from "@/components/admin/ContextHelp";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { HelpCircle } from "lucide-react";

// Lazy-load intro.js only on the client — it uses `document` at import time
const IntroSteps = lazy(() =>
  import("intro.js-react").then((m) => {
    // Also load the CSS dynamically (browser-only)
    import("intro.js/introjs.css");
    return { default: m.Steps };
  })
);

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [stepsEnabled, setStepsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("programacion");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  useEffect(() => {
    const hasCompletedTour = localStorage.getItem("ondas-admin-tour-completed");
    if (!hasCompletedTour) {
      setStepsEnabled(true);
    }
  }, []);

  const onTourExit = () => {
    setStepsEnabled(false);
    localStorage.setItem("ondas-admin-tour-completed", "true");
  };

  const startTour = () => {
    setStepsEnabled(true);
  };

  const steps = [
    {
      element: ".admin-header",
      intro: "👋 Bienvenido al panel de Ondas del Sur — te mostramos cómo funciona",
    },
    {
      element: "#tab-programacion",
      intro: "📻 Aquí editas la programación del día y marcas qué show está al aire",
    },
    {
      element: "#tab-noticias",
      intro: "📰 Desde aquí publicas noticias — solo escribe, sube la foto y publica",
    },
    {
      element: "#tab-galeria",
      intro: "🖼️ Sube fotos de eventos arrastrándolas directamente aquí",
    },
    {
      element: "#tab-equipo",
      intro: "👥 Aquí editas el equipo de locutores",
    },
    {
      element: "#tab-servicios",
      intro: "📢 Publica servicios sociales y comunicados a la comunidad",
    },
    {
      element: "#tab-programas",
      intro: "🎙️ Gestiona los programas destacados y audios bajo demanda",
    },
    {
      element: "#tab-top-songs",
      intro: "🎵 ¡Nuevo! Gestiona el ranking de las 10 más sonadas y sincroniza con Deezer",
    },
    {
      element: "#tab-configuracion",
      intro: "⚙️ En configuración ajustas el stream, la frecuencia y las redes",
    },
    {
      intro: "✅ ¡Listo! Puedes repetir este tour cuando quieras desde el botón ❓",
    },
  ];

  const tabs = [
    { id: "programacion", label: "Programación", icon: "📻" },
    { id: "noticias", label: "Noticias", icon: "📰" },
    { id: "newsapi", label: "Noticias de NewsAPI", icon: "🌐" },
    { id: "galeria", label: "Galería", icon: "📸" },
    { id: "equipo", label: "Equipo", icon: "👥" },
    { id: "servicios", label: "Servicios", icon: "📢" },
    { id: "programas", label: "Programas", icon: "🎙️" },
    { id: "top-songs", label: "TOP 10", icon: "🎵" },
    { id: "configuracion", label: "Configuración", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-black text-xl tracking-tight">Ondas Admin</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Panel v1.0</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition"
          >
            <span>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto relative">
        <Suspense fallback={null}>
          <IntroSteps
            enabled={stepsEnabled}
            steps={steps}
            initialStep={0}
            onExit={onTourExit}
            options={{
              nextLabel: "Siguiente",
              prevLabel: "Anterior",
              skipLabel: "Saltar",
              doneLabel: "Finalizar",
            }}
          />
        </Suspense>

        <header className="mb-10 admin-header">
          <h1 className="text-3xl lg:text-5xl font-black tracking-tight capitalize">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          <p className="text-slate-400 mt-2">Gestiona el contenido de esta sección para el sitio web.</p>
        </header>

        <div className="max-w-6xl">
          {activeTab === "programacion" && <AdminShows />}
          {activeTab === "noticias" && <AdminNews />}
          {activeTab === "newsapi" && <AdminNewsApi />}
          {activeTab === "galeria" && <AdminGallery />}
          {activeTab === "equipo" && <AdminTeam />}
          {activeTab === "servicios" && <AdminSocialServices />}
          {activeTab === "programas" && <AdminFeaturedPrograms />}
          {activeTab === "top-songs" && <AdminTopSongs />}
          {activeTab === "configuracion" && <AdminSettings />}
        </div>

        {/* Floating Help Button */}
        <button
          onClick={startTour}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-slate-900 border border-slate-800 text-primary shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group z-40"
          title="Necesitas ayuda?"
        >
          <HelpCircle size={28} />
          <span className="absolute right-full mr-4 px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">¿Necesitas ayuda?</span>
        </button>
      </main>
    </div>
  );
}

// Helpers for schedule validation
function parseTime(timeStr: string) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function parseDays(daysStr: string) {
  if (!daysStr) return [];
  const lower = daysStr.toLowerCase();
  const allDays = ["lunes", "martes", "miércoles", "miercoles", "jueves", "viernes", "sábado", "sabado", "domingo"];
  if (lower.includes("todos") || lower.includes("lunes a domingo")) return allDays;
  if (lower.includes("lunes a viernes")) return ["lunes", "martes", "miércoles", "miercoles", "jueves", "viernes"];
  return allDays.filter(d => lower.includes(d));
}

function shareDay(daysA: string, daysB: string) {
  const arrA = parseDays(daysA);
  const arrB = parseDays(daysB);
  if (arrA.length === 0 || arrB.length === 0) return true; // If parsing fails, assume overlap to be safe
  return arrA.some(d => arrB.includes(d));
}

// Subcomponents (Placeholders for now)
function AdminShows() {
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentShow, setCurrentShow] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    host: "", 
    time_start: "08:00", 
    time_end: "10:00", 
    tag: "En vivo",
    days: "Lunes, Martes, Miércoles, Jueves, Viernes",
    is_live: false 
  });
  const [autoShow, setAutoShow] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [conflictId, setConflictId] = useState<string | null>(null);

  useEffect(() => {
    fetchShows();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (shows.length > 0) {
      const interval = setInterval(detectAutoShow, 10000);
      detectAutoShow();
      return () => clearInterval(interval);
    }
  }, [shows]);

  async function fetchSettings() {
    const { data } = await supabase.from("settings").select("auto_schedule").single();
    setSettings(data);
  }

  const detectAutoShow = () => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const daysWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const currentDay = daysWeek[now.getDay()];

    const active = shows.find(s => {
      const start = parseInt(s.time_start.replace(/:/g, ""));
      const end = parseInt(s.time_end.replace(/:/g, ""));
      const dayMatches = s.days.toLowerCase().includes(currentDay.toLowerCase()) || s.days.toLowerCase().includes("todos");
      return currentTime >= start && currentTime < end && dayMatches;
    });
    setAutoShow(active);
  };

  async function fetchShows() {
    const { data } = await supabase.from("shows").select("*").order("time_start", { ascending: true });
    if (data) setShows(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setConflictId(null);

    const newStart = parseTime(formData.time_start);
    const newEnd = parseTime(formData.time_end);

    if (newEnd <= newStart) {
      setErrorMsg("La hora de fin debe ser después de la hora de inicio");
      return;
    }

    if (newEnd - newStart < 15) {
      setErrorMsg("El programa debe durar al menos 15 minutos");
      return;
    }

    // Overlap detection
    const conflict = shows.find(s => {
      if (currentShow && s.id === currentShow.id) return false;
      if (shareDay(formData.days, s.days)) {
        const existStart = parseTime(s.time_start);
        const existEnd = parseTime(s.time_end);
        return newStart < existEnd && newEnd > existStart;
      }
      return false;
    });

    if (conflict) {
      setErrorMsg(`⚠️ Este horario se cruza con '${conflict.title}' que va de ${conflict.time_start.substring(0,5)} a ${conflict.time_end.substring(0,5)}. Por favor elige un horario diferente.`);
      setConflictId(conflict.id);
      return;
    }

    setLoading(true);
    
    if (currentShow) {
      await supabase.from("shows").update(formData).eq("id", currentShow.id);
    } else {
      await supabase.from("shows").insert([formData]);
    }

    setIsEditing(false);
    setCurrentShow(null);
    setFormData({ title: "", host: "", time_start: "08:00", time_end: "10:00", tag: "En vivo", days: "Lunes a Viernes", is_live: false });
    
    setSuccessMsg("✅ Programa agregado correctamente");
    setTimeout(() => setSuccessMsg(""), 3000);
    
    fetchShows();
  };

  const toggleLive = async (id: string, currentStatus: boolean) => {
    // Primero ponemos todos en false
    await supabase.from("shows").update({ is_live: false }).neq("id", id);
    // Luego activamos/desactivamos el seleccionado
    const { error } = await supabase.from("shows").update({ is_live: !currentStatus }).eq("id", id);
    if (!error) fetchShows();
  };

  const deleteShow = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este programa?")) {
      const { error } = await supabase.from("shows").delete().eq("id", id);
      if (!error) fetchShows();
    }
  };

  if (loading && shows.length === 0) return <div className="text-slate-500 animate-pulse">Cargando programas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Parrilla de Programación</h3>
        {!isEditing && (
          <button 
            onClick={() => { 
              setIsEditing(true); 
              setCurrentShow(null); 
              setFormData({ title: "", host: "", time_start: "08:00", time_end: "10:00", tag: "En vivo", days: "Lunes a Viernes", is_live: false }); 
              setErrorMsg(""); 
              setSuccessMsg(""); 
              setConflictId(null); 
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 transition"
          >
            + Añadir Programa
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold rounded-xl animate-fade-up">
          {successMsg}
        </div>
      )}

      {settings?.auto_schedule && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-center gap-4 animate-pulse">
          <div className="h-3 w-3 bg-primary rounded-full" />
          <div className="text-sm">
            <span className="font-black text-primary uppercase mr-2 tracking-tighter">Modo Automático:</span>
            {autoShow ? (
              <span className="text-white font-bold">Detectado: <span className="text-primary">{autoShow.title}</span> ({autoShow.time_start} - {autoShow.time_end})</span>
            ) : (
              <span className="text-slate-500">No se detecta programa para esta hora/día. Sonará música aleatoria.</span>
            )}
          </div>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 animate-fade-up">
          
          {errorMsg && (
            <div className="p-4 bg-destructive/20 border border-destructive/50 text-destructive font-bold rounded-xl text-sm">
              {errorMsg}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Título del Programa</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                  placeholder="Ej: Mañanas con Ondas"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Locutor / Host</label>
                <input
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Inicio</label>
                <input
                  type="time"
                  required
                  value={formData.time_start}
                  onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Fin</label>
                <input
                  type="time"
                  required
                  value={formData.time_end}
                  onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Etiqueta (Tag)</label>
                <input
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                  placeholder="Ej: En vivo, Variedades, Musical"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Días de Transmisión</label>
                <input
                  value={(formData as any).days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                  placeholder="Ej: Lunes a Viernes, Sábados, Todos los días"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Vista previa del horario ({formData.days || "Sin días"})
            </label>
            <div className="relative h-8 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
              {shows
                .filter(s => (!currentShow || s.id !== currentShow.id) && shareDay(formData.days, s.days))
                .map(s => {
                  const sStart = parseTime(s.time_start);
                  const sEnd = parseTime(s.time_end);
                  const left = (sStart / 1440) * 100;
                  const width = ((sEnd - sStart) / 1440) * 100;
                  return (
                    <div 
                      key={s.id} 
                      className="absolute top-0 bottom-0 bg-orange-500/80 border-l border-orange-400 group/tt"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <div className="opacity-0 group-hover/tt:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20 pointer-events-none transition-opacity">
                        {s.title} ({s.time_start} - {s.time_end})
                      </div>
                    </div>
                  );
                })}
              
              {parseTime(formData.time_start) < parseTime(formData.time_end) && (
                <div 
                  className="absolute top-0 bottom-0 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] z-10 border-l-2 border-emerald-300" 
                  style={{ 
                    left: `${(parseTime(formData.time_start) / 1440) * 100}%`, 
                    width: `${((parseTime(formData.time_end) - parseTime(formData.time_start)) / 1440) * 100}%` 
                  }} 
                />
              )}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono font-bold">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-glow">Guardar Programa</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl">Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Programa</th>
                <th className="px-6 py-4">Días</th>
                <th className="px-6 py-4">Horario</th>
                <th className="px-6 py-4">Estado <ContextHelp text="Activa esto para mostrar cuál programa está al aire ahora mismo" /></th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {shows.map((show) => {
                const isConflict = conflictId === show.id;
                const isAuto = autoShow?.id === show.id && settings?.auto_schedule;
                let trClass = "transition hover:bg-slate-800/50";
                if (isConflict) trClass = "transition bg-destructive/10 border-l-4 border-l-destructive";
                else if (isAuto) trClass = "transition bg-primary/5 border-l-4 border-l-primary";
                
                return (
                <tr key={show.id} className={trClass}>
                  <td className="px-6 py-4">
                    <div className="font-bold">{show.title}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black">{show.host}</div>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400 max-w-[150px] truncate">{show.days}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{show.time_start.substring(0,5)} - {show.time_end.substring(0,5)}</td>
                  <td className="px-6 py-4">
                    {settings?.auto_schedule && autoShow?.id === show.id ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ⚡ AUTO-ACTIVE
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleLive(show.id, show.is_live)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition ${
                          show.is_live 
                            ? "bg-primary text-primary-foreground shadow-glow" 
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {show.is_live ? "🔴 MANUAL" : "OFFLINE"}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => { setCurrentShow(show); setFormData({ ...show }); setIsEditing(true); setErrorMsg(""); setSuccessMsg(""); setConflictId(null); }} className="text-primary hover:text-white transition text-sm font-bold">Editar</button>
                    <button onClick={() => deleteShow(show.id)} className="text-red-400 hover:text-red-300 transition text-sm font-bold">Eliminar</button>
                  </td>
                </tr>
                );
              })}
              {shows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 italic">No hay programas registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNews, setCurrentNews] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "", category: "", image_url: "", body: "", published: true });

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    const { data } = await supabase.from("news").select("*").order("date", { ascending: false });
    if (data) setNews(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (currentNews) {
      await supabase.from("news").update(formData).eq("id", currentNews.id);
    } else {
      await supabase.from("news").insert([formData]);
    }

    setIsEditing(false);
    setCurrentNews(null);
    setFormData({ title: "", category: "", image_url: "", body: "", published: true });
    fetchNews();
  };

  const deleteNews = async (id: string) => {
    if (confirm("¿Estás seguro?")) {
      await supabase.from("news").delete().eq("id", id);
      fetchNews();
    }
  };

  if (loading && news.length === 0) return <div className="text-slate-500 animate-pulse">Cargando noticias...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Gestión de Noticias</h3>
        <button 
          onClick={() => { setIsEditing(true); setCurrentNews(null); setFormData({ title: "", category: "Local", image_url: "", body: "", published: true }); }}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 transition"
        >
          + Nueva Noticia
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 animate-fade-up">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Título</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                >
                  <option value="Local">Local</option>
                  <option value="Regional">Regional</option>
                  <option value="Nacional">Nacional</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Cultura">Cultura</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Imagen de la noticia
                  <ContextHelp text="Sube una foto representativa. Se convertirá automáticamente a WebP para mayor velocidad." />
                </label>
                <ImageUploader 
                  folder="news" 
                  currentImageUrl={formData.image_url}
                  onUploadComplete={(url) => setFormData({ ...formData, image_url: url })} 
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Contenido</label>
                <textarea
                  required
                  rows={8}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="published" 
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary"
                />
                <label htmlFor="published" className="text-sm font-bold text-slate-300">
                  Publicar noticia 
                  <ContextHelp text="Solo las noticias publicadas aparecen en la página principal" />
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-glow">Guardar</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl">Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
              <div className="h-40 bg-slate-800 relative">
                {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" alt="" />}
                <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-[10px] font-black text-primary-foreground rounded uppercase">{item.category}</div>
              </div>
              <div className="p-5 flex-1">
                <h4 className="font-bold mb-2 line-clamp-2">{item.title}</h4>
                <p className="text-slate-500 text-xs line-clamp-3 mb-4">{item.body}</p>
                <div className="flex justify-between mt-auto">
                  <button onClick={() => { setCurrentNews(item); setFormData({ ...item }); setIsEditing(true); }} className="text-primary text-sm font-bold">Editar</button>
                  <button onClick={() => deleteNews(item.id)} className="text-red-500 text-sm font-bold">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
          {news.length === 0 && <div className="col-span-full p-10 text-center text-slate-500 italic">No hay noticias publicadas.</div>}
        </div>
      )}
    </div>
  );
}

function AdminGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState({ image_url: "", caption: "", event_name: "" });

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    if (data) setImages(data);
    setLoading(false);
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("gallery").insert([newImage]);
    if (!error) {
      setNewImage({ image_url: "", caption: "", event_name: "" });
      fetchGallery();
    }
  };

  const deleteImage = async (id: string) => {
    if (confirm("¿Eliminar foto?")) {
      await supabase.from("gallery").delete().eq("id", id);
      fetchGallery();
    }
  };

  if (loading && images.length === 0) return <div className="text-slate-500 animate-pulse">Cargando galería...</div>;

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Añadir a Galería</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Foto del evento</label>
            <ImageUploader 
              folder="gallery" 
              currentImageUrl={newImage.image_url}
              onUploadComplete={(url) => setNewImage({ ...newImage, image_url: url })} 
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Nombre del Evento</label>
              <input
                placeholder="ej. Fiesta del Pueblo"
                value={newImage.event_name}
                onChange={(e) => setNewImage({ ...newImage, event_name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Descripción</label>
              <textarea
                placeholder="Descripción corta de la foto..."
                rows={3}
                value={newImage.caption}
                onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none text-sm resize-none"
              />
            </div>
            <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-black tracking-tight rounded-xl shadow-glow">
              Publicar en Galería
            </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <img src={img.image_url} className="w-full h-full object-cover transition group-hover:scale-110" alt="" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-4 text-center">
              <p className="text-xs font-bold text-white mb-1">{img.event_name}</p>
              <p className="text-[10px] text-slate-300 mb-3">{img.caption}</p>
              <button onClick={() => deleteImage(img.id)} className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTeam() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", role: "", show: "", schedule: "", avatar_initials: "" });

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    const { data } = await supabase.from("team").select("*").order("name", { ascending: true });
    if (data) setTeam(data);
    setLoading(false);
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.avatar_initials) {
      formData.avatar_initials = formData.name.substring(0, 2).toUpperCase();
    }
    const { error } = await supabase.from("team").insert([formData]);
    if (!error) {
      setFormData({ name: "", role: "", show: "", schedule: "", avatar_initials: "" });
      fetchTeam();
    }
  };

  const deleteMember = async (id: string) => {
    if (confirm("¿Eliminar integrante?")) {
      await supabase.from("team").delete().eq("id", id);
      fetchTeam();
    }
  };

  if (loading && team.length === 0) return <div className="text-slate-500 animate-pulse">Cargando equipo...</div>;

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Nuevo Locutor / Integrante</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            required
            placeholder="Nombre completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
          />
          <input
            placeholder="Rol (ej. Director)"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
          />
          <input
            placeholder="Programa"
            value={formData.show}
            onChange={(e) => setFormData({ ...formData, show: e.target.value })}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
          />
          <input
            placeholder="Horario (ej. L-V 8am)"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
          />
        </div>
        <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-glow">Registrar</button>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((m) => (
          <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4 group">
            <div className="h-14 w-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-xl font-black text-primary-foreground shadow-glow shrink-0">
              {m.avatar_initials}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold truncate">{m.name}</h4>
              <p className="text-primary text-xs font-bold uppercase tracking-widest">{m.role}</p>
              <p className="text-slate-500 text-[10px] mt-1">{m.show} · {m.schedule}</p>
            </div>
            <button onClick={() => deleteMember(m.id)} className="opacity-0 group-hover:opacity-100 transition text-red-500 text-xs font-bold p-2 hover:bg-red-500/10 rounded-lg">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSettings() {
  const { settings, loading } = useSettings();
  const [formData, setFormData] = useState({
    stream_url: "",
    fm_frequency: "",
    facebook_url: "",
    phone: "",
    auto_schedule: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        stream_url: settings.stream_url || "",
        fm_frequency: settings.fm_frequency || "",
        facebook_url: settings.facebook_url || "",
        phone: settings.phone || "",
        auto_schedule: settings.auto_schedule ?? true,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("settings")
      .update(formData)
      .eq("id", (settings as any).id);

    if (error) {
      setMessage({ type: "error", text: "Error al guardar los cambios: " + error.message });
    } else {
      setMessage({ type: "success", text: "Configuración actualizada correctamente." });
    }
    setSaving(false);
  };

  if (loading) return <div className="text-slate-500 animate-pulse">Cargando configuración...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-6">
        <div>
          <h4 className="font-bold text-primary">Modo Automático</h4>
          <p className="text-xs text-slate-400">Activa o desactiva el cambio automático de programas según horario.</p>
        </div>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, auto_schedule: !formData.auto_schedule })}
          className={`w-14 h-8 rounded-full transition-colors relative ${formData.auto_schedule ? 'bg-primary' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${formData.auto_schedule ? 'left-7' : 'left-1'}`} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Stream URL (Radio Online)
            <ContextHelp text="La dirección web de tu transmisión en vivo. Ej: https://sonic.paulatina.co/8036/stream" />
          </label>
          <input
            type="url"
            value={formData.stream_url}
            onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Frecuencia FM
            <ContextHelp text="El número del dial de tu emisora. Ej: 106.6" />
          </label>
          <input
            type="text"
            value={formData.fm_frequency}
            onChange={(e) => setFormData({ ...formData, fm_frequency: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
            placeholder="106.6"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Facebook URL</label>
          <input
            type="url"
            value={formData.facebook_url}
            onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
            placeholder="https://facebook.com/..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Teléfono / WhatsApp</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
            placeholder="+57..."
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-4 bg-primary text-primary-foreground font-black tracking-tight rounded-xl shadow-glow hover:scale-[1.03] transition-transform disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}

function AdminTopSongs() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTopSongs();
  }, []);

  async function fetchTopSongs() {
    const { data } = await supabase
      .from("top_songs")
      .select("*")
      .order("position", { ascending: true });
    
    if (data && data.length > 0) {
      setSongs(data);
    } else {
      // Default initial data if table is empty
      setSongs(Array.from({ length: 10 }, (_, i) => ({
        position: i + 1,
        title: "",
        artist: "",
        genre: "",
        trend: "same"
      })));
    }
    setLoading(false);
  }

  const handleUpdate = (index: number, field: string, value: string) => {
    const newSongs = [...songs];
    newSongs[index] = { ...newSongs[index], [field]: value };
    setSongs(newSongs);
  };

  const saveAll = async () => {
    setSaving(true);
    const { error } = await supabase.from("top_songs").upsert(
      songs.map(s => ({
        position: s.position,
        title: s.title,
        artist: s.artist,
        genre: s.genre,
        trend: s.trend
      })),
      { onConflict: 'position' }
    );

    if (error) alert("Error al guardar: " + error.message);
    else alert("Ranking actualizado correctamente");
    setSaving(false);
  };

  if (loading) return <div className="text-slate-500 animate-pulse">Cargando ranking...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Ranking Semanal (Top 10)</h3>
        <button 
          onClick={saveAll}
          disabled={saving}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-black tracking-tight hover:scale-105 transition shadow-glow"
        >
          {saving ? "Guardando..." : "Guardar Ranking"}
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-500">
              <th className="px-6 py-4 w-16">#</th>
              <th className="px-6 py-4">Canción</th>
              <th className="px-6 py-4">Artista</th>
              <th className="px-6 py-4">Género</th>
              <th className="px-6 py-4">Tendencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {songs.map((s, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition">
                <td className="px-6 py-4 font-black text-primary">{s.position}</td>
                <td className="px-4 py-3">
                  <input
                    value={s.title}
                    onChange={(e) => handleUpdate(i, "title", e.target.value)}
                    placeholder="Título"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={s.artist}
                    onChange={(e) => handleUpdate(i, "artist", e.target.value)}
                    placeholder="Artista"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={s.genre}
                    onChange={(e) => handleUpdate(i, "genre", e.target.value)}
                    placeholder="Género"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={s.trend}
                    onChange={(e) => handleUpdate(i, "trend", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-primary"
                  >
                    <option value="up">▲ Sube</option>
                    <option value="same">— Mantiene</option>
                    <option value="down">▼ Baja</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSocialServices() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "", category: "Comunicado", date: new Date().toISOString().split('T')[0], description: "", published: true });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data } = await supabase.from("social_services").select("*").order("date", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (current) {
      await supabase.from("social_services").update(formData).eq("id", current.id);
    } else {
      await supabase.from("social_services").insert([formData]);
    }
    setIsEditing(false);
    setCurrent(null);
    setFormData({ title: "", category: "Comunicado", date: new Date().toISOString().split('T')[0], description: "", published: true });
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    if (confirm("¿Estás seguro?")) {
      await supabase.from("social_services").delete().eq("id", id);
      fetchItems();
    }
  };

  if (loading && items.length === 0) return <div className="text-slate-500 animate-pulse">Cargando servicios sociales...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Servicios Sociales</h3>
        <button 
          onClick={() => { setIsEditing(true); setCurrent(null); setFormData({ title: "", category: "Comunicado", date: new Date().toISOString().split('T')[0], description: "", published: true }); }}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 transition"
        >
          + Nuevo Comunicado
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 animate-fade-up">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Título</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                  placeholder="Ej: Gran Jornada de Limpieza"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                  >
                    <option value="Comunicado">Comunicado</option>
                    <option value="Evento">Evento</option>
                    <option value="Clasificado">Clasificado</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Fecha</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Descripción / Mensaje</label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none resize-none"
                placeholder="Escribe el mensaje completo aquí..."
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-glow">Guardar</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl">Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-primary/30 transition group">
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 bg-slate-800 text-[10px] font-black text-slate-400 rounded uppercase tracking-widest">{item.category}</span>
                <span className="text-[10px] text-slate-500 font-bold">{item.date}</span>
              </div>
              <h4 className="font-bold mb-2 group-hover:text-primary transition">{item.title}</h4>
              <p className="text-slate-500 text-xs line-clamp-2 mb-4">{item.description}</p>
              <div className="flex gap-4 pt-4 border-t border-slate-800/50">
                <button onClick={() => { setCurrent(item); setFormData({ ...item }); setIsEditing(true); }} className="text-primary text-[11px] font-bold uppercase tracking-widest">Editar</button>
                <button onClick={() => deleteItem(item.id)} className="text-red-500 text-[11px] font-bold uppercase tracking-widest">Eliminar</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="col-span-full p-12 text-center text-slate-500 italic">No hay servicios sociales registrados.</div>}
        </div>
      )}
    </div>
  );
}

function AdminFeaturedPrograms() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "", description: "", duration: "", date_label: "ESTA SEMANA", audio_url: "", published: true });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data } = await supabase.from("featured_programs").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (current) {
      await supabase.from("featured_programs").update(formData).eq("id", current.id);
    } else {
      await supabase.from("featured_programs").insert([formData]);
    }
    setIsEditing(false);
    setCurrent(null);
    setFormData({ title: "", description: "", duration: "", date_label: "ESTA SEMANA", audio_url: "", published: true });
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    if (confirm("¿Eliminar programa destacado?")) {
      await supabase.from("featured_programs").delete().eq("id", id);
      fetchItems();
    }
  };

  if (loading && items.length === 0) return <div className="text-slate-500 animate-pulse">Cargando programas destacados...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Programas Destacados (Podcasts)</h3>
        <button 
          onClick={() => { setIsEditing(true); setCurrent(null); setFormData({ title: "", description: "", duration: "", date_label: "ESTA SEMANA", audio_url: "", published: true }); }}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 transition"
        >
          + Nuevo Programa
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 animate-fade-up">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Título del Programa</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                  placeholder="Ej: Entrevista al Alcalde"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Etiqueta de Fecha</label>
                  <input
                    value={formData.date_label}
                    onChange={(e) => setFormData({ ...formData, date_label: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                    placeholder="Ej: ESTA SEMANA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Duración</label>
                  <input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                    placeholder="Ej: 42:15"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">URL del Audio</label>
                <input
                  value={formData.audio_url}
                  onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Descripción corta</label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none resize-none"
                placeholder="De qué trata el programa..."
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-glow">Guardar</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl">Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 group">
              <div className="h-16 w-16 bg-gradient-brand rounded-xl flex items-center justify-center shrink-0">
                <Music size={24} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest">{item.date_label}</span>
                  <span className="text-[9px] text-slate-500 font-bold">· {item.duration}</span>
                </div>
                <h4 className="font-bold truncate group-hover:text-primary transition">{item.title}</h4>
                <p className="text-slate-500 text-[10px] truncate">{item.description}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setCurrent(item); setFormData({ ...item }); setIsEditing(true); }} className="text-primary text-[10px] font-bold uppercase">Editar</button>
                <button onClick={() => deleteItem(item.id)} className="text-red-500 text-[10px] font-bold uppercase">Borrar</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="col-span-full p-12 text-center text-slate-500 italic">No hay programas destacados registrados.</div>}
        </div>
      )}
    </div>
  );
}

function AdminNewsApi() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setLoading(true);
    const { data } = await supabase
      .from("news")
      .select("*")
      .eq("published", false)
      .order("date", { ascending: false });
    if (data) setNews(data);
    setLoading(false);
  }

  const publishNews = async (id: string) => {
    if (confirm("¿Estás seguro de publicar esta noticia?")) {
      await supabase.from("news").update({ published: true }).eq("id", id);
      fetchNews();
    }
  };

  const deleteNews = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta noticia?")) {
      await supabase.from("news").delete().eq("id", id);
      fetchNews();
    }
  };

  if (loading && news.length === 0) return <div className="text-slate-500 animate-pulse">Cargando noticias pendientes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Noticias de NewsAPI</h3>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
            {item.image_url ? (
              <div className="h-40 bg-slate-800 relative">
                <img src={item.image_url} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-[10px] font-black text-primary-foreground rounded uppercase">{item.category}</div>
              </div>
            ) : (
              <div className="h-40 bg-slate-800 relative flex items-center justify-center">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Sin imagen</span>
                <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-[10px] font-black text-primary-foreground rounded uppercase">{item.category}</div>
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="font-bold mb-2 line-clamp-2">{item.title}</h4>
              <p className="text-slate-500 text-[10px] mb-2 font-bold uppercase tracking-widest">
                {new Date(item.date || new Date()).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-slate-500 text-xs line-clamp-3 mb-4">{item.body}</p>
              <div className="flex justify-between mt-auto gap-3">
                <button onClick={() => publishNews(item.id)} className="flex-1 text-emerald-400 hover:text-emerald-300 transition text-sm font-bold bg-emerald-500/10 py-2 rounded-lg text-center">Publicar</button>
                <button onClick={() => deleteNews(item.id)} className="flex-1 text-red-400 hover:text-red-300 transition text-sm font-bold bg-red-500/10 py-2 rounded-lg text-center">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
        {news.length === 0 && <div className="col-span-full p-10 text-center text-slate-500 italic">No hay noticias pendientes de NewsAPI.</div>}
      </div>
    </div>
  );
}
