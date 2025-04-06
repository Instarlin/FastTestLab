import { useState } from "react";
import { CardSpotlight } from "~/components/CardSpotLight";
import { BreadcrumbLink } from "~/components/Sidebar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const handle = {
  breadcrumb: () => <BreadcrumbLink to="/home">Home</BreadcrumbLink>,
};

const Card = () => {
  return (
    <CardSpotlight className="flex-1 basis-[calc(33%-0.5rem)] min-w-[200px] max-w-[calc(33%-0.5rem)] border-gray-300 overflow-hidden p-0 min-h-[200px] flex flex-col items-center justify-center cursor-pointer">
      <div
        className="w-full flex-3 bg-cover bg-center bg-"
        style={{
          backgroundImage:
            "url('https://cdn.prod.website-files.com/645a9acecda2e0594fac6126/6685a488a38a8a680ba9e5f6_og-tiptap-editor.jpg')",
        }}
      ></div>
      <div className="w-full flex-1 bg-white z-20 flex justify-start items-center px-4 transition-all duration-300">
        Course Title goes here
      </div>
    </CardSpotlight>
  );
};

const cardLayouts = [
  { label: "6 x 2", columns: 6, rows: 2 },
  { label: "10 x 2", columns: 10, rows: 2 },
];

export default function Home() {
  const [layout, setLayout] = useState(cardLayouts[0]);
  const totalCards = layout.columns * layout.rows;
  const cardsArray = Array.from({ length: totalCards });

  return (
    <div className="flex flex-col gap-6 p-6 w-full h-full overflow-y-scroll">
      <div className="sticky top-0 flex gap-4 z-30">
        {cardLayouts.map((option) => (
          <button
            key={option.label}
            className={`px-4 py-2 rounded border ${
              layout.label === option.label
                ? "bg-blue-600 text-white"
                : "bg-white text-black border-gray-400"
            }`}
            onClick={() => setLayout(option)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-start gap-2 transition-all duration-300">
        {cardsArray.map((_, index) => (
          <Card key={index} />
        ))}
      </div>
    </div>
  );
}
