import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    // If not on the login page and not authenticated, redirect to login
    if (!session && location.pathname !== "/admin/login") {
      throw redirect({
        to: "/admin/login",
        search: {
          redirect: location.pathname,
        },
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      <Outlet />
    </div>
  );
}
