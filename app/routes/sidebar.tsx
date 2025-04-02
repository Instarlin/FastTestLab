import { Outlet } from "react-router";
import type { Route } from "./+types/home";
import { SidebarNav, AutonomousBreadcrumbs, LoadIndicator } from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <LoadIndicator />
      <SidebarNav />
      <div className="flex flex-col shadow-[-4px_0px_6px_-1px_rgba(0,0,0,0.15)] rounded-tl-4xl pl-0 py-0 text-gray-950 bg-white w-full">
        <AutonomousBreadcrumbs className="mt-4 pl-6 pb-2 border-b-1 border-gray-200" />
        <Outlet />
      </div>
    </div>
  );
}