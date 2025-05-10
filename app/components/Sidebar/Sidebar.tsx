import {
  AtomIcon,
  BotIcon,
  DatabaseIcon,
  LogOutIcon,
  LucideBolt,
} from "lucide-react";
import {
  Logo,
  Sidebar,
  SidebarBody,
  SidebarLink,
  SidebarPopoverLink,
  SidebarProvider,
} from "./SidebarComponents";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";


export function SidebarNav({ className }: { className?: string }) {
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
      link: "/chat",
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
      link: "/login",
      icon: (
        <LogOutIcon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarBody className={cn("justify-between gap-10", className)}>
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-12 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className="hover:bg-sidebar-border duration-150 rounded-lg pl-2 py-2 mr-3"
                />
              ))}
            </div>
          </div>
          <div className="overflow-x-hidden overflow-y-auto">
            <SidebarPopoverLink
              className="hover:bg-sidebar-border duration-150 rounded-lg pl-0.5 py-2 mr-3"
              link={{
                label: "Profile",
                icon: (
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </SidebarProvider>
  );
}
