import { WavyBackground } from "~/components/widgets/Hero/HeroBg";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Landing" },
    { name: "description", content: "Landing" },
  ];
}

export default function Hero() {

  return (
    <>
      {/* <WavyBackground /> */}
    </>
  );
}
