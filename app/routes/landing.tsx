import type { Route } from "./+types/home";
import { WavyBackground } from "~/components/Hero/HeroBg";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hero" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Hero({ matches }: Route.ComponentProps) {

  return (
    <>
      <WavyBackground />
    </>
  );
}
