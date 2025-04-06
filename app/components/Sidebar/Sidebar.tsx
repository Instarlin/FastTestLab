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
  SidebarProvider,
} from "./SidebarComponents";

export function SidebarNav() {
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
      link: "/login",
      icon: (
        <LogOutIcon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  return (
    <SidebarProvider open={false}>
      <Sidebar>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-12 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className="hover:bg-gray-200 duration-150 rounded-lg pl-2 py-2 mr-3"
                />
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
  );
}
