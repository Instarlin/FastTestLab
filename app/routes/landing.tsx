import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hero" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ matches }: Route.ComponentProps) {

  return (
    <>
      <div>Hero page</div>
    </>
  );
}
