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
      {/* <WavyBackground /> */}
      <div className="p-4">
        <Button 
          onClick={handlePostRequest}
          disabled={isLoading}
          className="mb-4"
        >
          {isLoading ? 'Sending...' : 'Send POST Request'}
        </Button>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It's animated by default, but you can disable it if you prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
