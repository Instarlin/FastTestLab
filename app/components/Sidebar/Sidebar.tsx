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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../Input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { motion, animate } from "motion/react";


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
        <SidebarBody className={cn("justify-between gap-10", className)}>
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
            <Popover>
              <PopoverTrigger asChild>
                {/* <SidebarProvider> */}
                <SidebarPopoverLink
                  className="hover:bg-gray-200 duration-150 rounded-lg pl-0.5 py-2 mr-3"
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
                {/* </SidebarProvider> */}
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Dimensions</h4>
                    <p className="text-sm text-muted-foreground">
                      Set the dimensions for the layer.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        defaultValue="100%"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="maxWidth">Max. width</Label>
                      <Input
                        id="maxWidth"
                        defaultValue="300px"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        defaultValue="25px"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="maxHeight">Max. height</Label>
                      <Input
                        id="maxHeight"
                        defaultValue="none"
                        className="col-span-2 h-8"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </SidebarBody>
      </Sidebar>
    </SidebarProvider>
  );
}
