import type { Route } from "../+types/home";
import { BreadcrumbLink } from "~/components/Breadcrumb";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const handle = {
  breadcrumb: () => <BreadcrumbLink to='/chimin/extrachimin'>Chimin But Extra!!</BreadcrumbLink>
}

export default function Home({ matches }: Route.ComponentProps) {
  return (
    <>
    </>
  );
}
