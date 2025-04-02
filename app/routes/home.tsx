import type { Route } from "./+types/home";
import { BreadcrumbLink } from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const handle = {
  breadcrumb: () => <BreadcrumbLink to='/home'>Home</BreadcrumbLink>
}

export default function Home({ matches }: Route.ComponentProps) {

  return (
    <>
    <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-5 h-5 animate-spin"></div>
      
    </>
  );
}
