import { AnimatePresence, motion } from "motion/react";
import React, { createContext, useContext, useState } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { Switch } from "../../ui/switch";

interface Links {
  label: string;
  link: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarPopoverLinkProps {
  link: {
    label: string;
    icon: React.ReactNode;
  };
  className?: string;
};

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-2 py-4 -mr-2 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "260px" : "60px") : "260px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-white dark:bg-neutral-800"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full hover:cursor-pointer">
          <MenuIcon
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 hover:cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <XIcon />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate, setOpen } = useSidebar();
  return (
    <Link
      to={link.link}
      className={cn(
        "flex relative items-center justify-start gap-2 group/sidebar",
        className
      )}
      onClick={() => setOpen(!open)}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="absolute left-10 text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export const SidebarPopoverLink = ({ link, className }: SidebarPopoverLinkProps) => {
  const { open, animate } = useSidebar();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn("flex relative items-center gap-2 cursor-pointer", className)}
        >
          {link.icon}
          <motion.span
            animate={{
              display: animate ? (open ? "inline-block" : "none") : "inline-block",
            }}
            className="absolute left-10 text-neutral-700 dark:text-neutral-200 text-sm transition duration-150 whitespace-pre inline-block"
          >
            {link.label}
          </motion.span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              layout
              animate={{ height: "auto" }}
              transition={{ duration: 0.1 }}
            >
              <TabsContent value="profile" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <Button className="w-full">Save Changes</Button>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notifications</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications" className="text-sm">Email</Label>
                        <Switch id="email-notifications" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-notifications" className="text-sm">Push</Label>
                        <Switch id="push-notifications" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/settings">View Full Settings</Link>
                  </Button>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export const Logo = () => {
  const { open, animate, setOpen } = useSidebar();
  return (
    <Link
      to="/home"
      className="relative z-20 flex items-center space-x-3 py-1 text-sm font-normal text-black pl-2"
      onClick={() => setOpen(!open)}
    >
      <div className="h-6 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        animate={{ opacity: animate ? (open ? 1 : 0) : 1 }}
        className="absolute left-10 font-medium whitespace-pre text-black dark:text-white"
      >
        Fast Test Lab
      </motion.span>
    </Link>
  );
};
