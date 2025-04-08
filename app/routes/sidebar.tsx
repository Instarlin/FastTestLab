import { Outlet } from "react-router";
import {
  AutonomousBreadcrumbs,
  LoadIndicator,
  SidebarNav,
} from "~/components/Sidebar";
import type { Route } from "./+types/home";

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
      <SidebarNav className="group peer"/>
      <div className="relative flex flex-col flex-shrink-0 min-w-0 w-[calc(100%-52px)] border border-red-500 shadow-[-4px_0px_6px_-1px_rgba(0,0,0,0.15)] rounded-tl-4xl px-0 py-0 text-gray-950 bg-white">
        <AutonomousBreadcrumbs className="mt-4 px-6 pb-2 border-b-1 border-gray-200" />
        <Outlet />
      </div>
      <div className="opacity-0 peer-hover:opacity-30 transition-opacity duration-600 absolute right-0 top-0 h-full w-96 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
    </div>
  );
}
