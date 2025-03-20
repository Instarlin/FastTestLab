// import { Loader } from "~/components/Loader";
import { AutonomousBreadcrumbs } from "~/components/Autobreadcrumps";
import type { Route } from "./+types/home";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/Breadcrumb";
import { Link, Outlet } from "react-router";
import RichEditor from "~/components/RichEditor";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const handle = {
  breadcrumb: () => <BreadcrumbLink to='/tests'>Tests</BreadcrumbLink>
}

export default function Chimin({ matches }: Route.ComponentProps) {
  return (
    <div 
      className="flex relative flex-row justify-between items-start h-full overflow-y-scroll overflow-x-hidden"
      // style={{ boxShadow: "inset 20px 40px 20px 100px rgba(0, 0, 0, 1.0)" }}
    >
      <div></div>
      <RichEditor className="border-2 w-7/12 h-[200vh]"/>
      <div className="sticky top-4 right-4 flex flex-col gap-1.5">
        Navigation list
        <Link to='./extrachimin' className="text-blue-300">Chimin Extra</Link>
        New Link

      </div>
      <Outlet />
    </div>
  );
}
