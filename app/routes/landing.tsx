import { WavyBackground } from "~/components/Hero/HeroBg";
import type { Route } from "./+types/home";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import axios from "axios";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hero" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Hero({ matches }: Route.ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePostRequest = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('https://api.ilcloud.tech/auth/login', {
        "email": "admin@example.com",
        "password": "admin"
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <WavyBackground />
    </>
  );
}
