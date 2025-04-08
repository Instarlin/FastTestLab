import { useState } from "react";
import { CardSpotlight } from "~/components/CardSpotLight";
import { BreadcrumbLink } from "~/components/Sidebar";
import type { Route } from "./+types/home";
import { DialogDemo } from "~/components/Home/Dialog";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue, 
} from "~/components/Dropdown";
import { Button } from "~/components/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const handle = {
  breadcrumb: () => <BreadcrumbLink to="/home">Home</BreadcrumbLink>,
};

const Card = ({ size }: { size: string }) => {
  return (
    <CardSpotlight
      style={{
        flexBasis: `calc(${size} - 0.5rem)`,
        maxWidth: `calc(${size} - 0.5rem)`,
      }}
      className="border-gray-300 overflow-hidden p-0 min-h-[200px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
    >
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
  const [cardSize, setCardSize] = useState("25%");
  const [layout, setLayout] = useState(cardLayouts[0]);
  const totalCards = layout.columns * layout.rows;
  const cardsArray = Array.from({ length: totalCards });

  const handleCardSizeChange = (size: string) => {
    setCardSize(size);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 pl-6 overflow-y-scroll">
      <div className="sticky top-0 flex gap-4 z-30 pt-4">
        <Select>
          <SelectTrigger className="w-[180px] hover:cursor-pointer hover:bg-gray-100 transition-colours duration-300 focus:ring-0 bg-white border-gray-300">
            <SelectValue placeholder="Select card size" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-300">
            <SelectGroup>
              <SelectItem onClick={() => handleCardSizeChange("20%")} className="hover:bg-gray-200 hover:cursor-pointer rounded-m w-full" value="s">Small</SelectItem>
              <SelectItem onClick={() => handleCardSizeChange("25%")} className="hover:bg-gray-200 hover:cursor-pointer rounded-m w-full" value="m">Medium</SelectItem>
              <SelectItem onClick={() => handleCardSizeChange("33%")} className="hover:bg-gray-200 hover:cursor-pointer rounded-m w-full" value="l">Large</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
        <DialogDemo />
      </div>

      <div className="flex flex-1 flex-wrap justify-start gap-2 transition-all duration-300">
        {cardsArray.map((_, index) => (
          <Card size={cardSize} key={index} />
        ))}
      </div>
    </div>
  );
}
