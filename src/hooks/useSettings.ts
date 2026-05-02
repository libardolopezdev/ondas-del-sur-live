import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Settings {
  id: number;
  stream_url: string;
  fm_frequency: string;
  facebook_url: string;
  phone: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();

      if (data) {
        setSettings(data);
      }
      setLoading(false);
    }

    fetchSettings();

    // Subscribe to changes
    const channel = supabase
      .channel("settings-changes")
      .on(
        "postgres_changes",
        { event: "*", table: "settings" },
        (payload) => {
          setSettings(payload.new as Settings);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
}
