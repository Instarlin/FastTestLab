import { Outlet, redirect, useNavigation, type LoaderFunctionArgs } from "react-router";
import {
  // AutonomousBreadcrumbs,
  LoadIndicator,
  SidebarNav,
} from "~/components/widgets/Sidebar";
import type { Route } from "./+types/home";
import { getUserID } from "~/modules/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Navigation" },
    { name: "description", content: "Navigation interface" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userID = await getUserID(request);
  if (!userID) return redirect("/auth?formType=login");
  return {userID, request};
} 

export default function Home() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <LoadIndicator />
      <SidebarNav className="group peer"/>
      <div className="relative flex flex-col flex-shrink-0 min-w-0 sm:w-full md:w-[calc(100%-52px)] md:shadow-[-4px_0px_6px_-1px_rgba(0,0,0,0.15)] md:rounded-tl-4xl px-0 py-0 bg-white">
        {/* <AutonomousBreadcrumbs className="mt-4 px-6 pb-2 border-b-1 border-gray-200" /> */}
        {isLoading ? (
          <div className="flex flex-col w-full h-full justify-center items-center gap-4">
            <div className="loader self-center" />
            <p>Loading editor...</p>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
      <div className="opacity-0 peer-hover:opacity-30 transition-opacity duration-600 absolute right-0 top-0 h-full w-96 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
    </div>
  );
}
