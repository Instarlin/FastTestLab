import { Outlet } from "react-router";
import type { Route } from "./+types/home";
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider, Logo } from "~/components/Sidebar";
import { LogOutIcon, LucideBolt, UserSearchIcon, AtomIcon, BotIcon, DatabaseIcon } from "lucide-react";
import { AutonomousBreadcrumbs } from "~/components/Autobreadcrumps";
import { motion } from "framer-motion";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const links = [
    {
      label: "Tests",
      link: "/tests",
      icon: (
        <AtomIcon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Database",
      link: "#",
      icon: (
        <DatabaseIcon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Chat Bot",
      link: "#",
      icon: (
        <BotIcon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      link: "#",
      icon: (
        <LucideBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      link: "#",
      icon: (
        <LogOutIcon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <motion.div 
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1}}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 !m-0 p-0 w-full h-1 bg-blue-500 rounded-3xl my-4"
      />
      <SidebarProvider open={false}>
        <Sidebar>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              <Logo />
              <div className="mt-12 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} className="hover:bg-gray-200 duration-150 rounded-lg pl-2 py-2 mr-3"/>
                ))}
              </div>
            </div>
            <div className="overflow-x-hidden overflow-y-auto">
              <SidebarLink
                link={{
                  label: "New profile 1",
                  link: "/profile",
                  icon: (
                    <img
                      src="https://assets.aceternity.com/manu.png"
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
                className="py-2 px-2 -ml-1 hover:bg-gray-200 duration-150 rounded-lg"
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </SidebarProvider>
      <div className="flex flex-col shadow-[-4px_0px_6px_-1px_rgba(0,0,0,0.15)] rounded-tl-4xl pl-6 py-0 text-gray-950 bg-white w-full">
        <AutonomousBreadcrumbs className="my-4" />
        <Outlet />
      </div>
    </div>
  );
}