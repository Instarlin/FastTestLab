import { BreadcrumbLink } from "~/components/Breadcrumb";
import type { Route } from "./+types/home";
import { useNavigation } from "react-router";

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
  const navigation = useNavigation();
  const isNavigation = Boolean(navigation.location);

  return (
    <>
    <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-5 h-5 animate-spin"></div>
    </>
  );
}
