import { useEffect, useState } from "react";
import { BreadcrumbLink } from "~/components/Sidebar";
import type { Route } from "./+types/home";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/Button";
import { Settings2Icon } from "lucide-react";
import { CardCreationDialog } from "~/components/CardCreationDialog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const handle = {
  breadcrumb: () => <BreadcrumbLink to="/home">Home</BreadcrumbLink>,
};

const cardLayouts = [
  { label: "6 x 2", columns: 6, rows: 2 },
  { label: "10 x 2", columns: 10, rows: 2 },
];

const lessons = [
  {
    title: "Lesson 1",
    description: "Lesson 1 Description",
    subLessons: [
      {
        title: "Sub Lesson 1",
        description: "Sub Lesson 1 Description",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson 2",
        description: "Sub Lesson 2 Description",
        icon: "theory",
        succsess: false,
      },
    ],
  },
  {
    title: "Lesson 2",
    description: "Lesson 2 Description",
    subLessons: [
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
      },
    ],
  },
  {
    title: "Lesson 3",
    description: "Lesson 3 Description",
    subLessons: [
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
    ],
  },
  {
    title: "Lesson 4",
    description: "Lesson 2 Description",
    subLessons: [
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
      },
      {
        title: "Sub Lesson CHIMIN",
        description: "Sub Lesson Chimin",
        icon: "practice",
        succsess: false,
      },
      {
        title: "Sub Lesson CHIMIN 2",
        description: "Sub Lesson Chimin 2",
        icon: "theory",
        succsess: true,
      },
    ],
  },
];

interface Card {
  title: string;
  description: string;
  color: string;
  progress: string;
  tags: string[];
  images: string[];
}

export default function Home() {
  const [cardSize, setCardSize] = useState<string>();
  const [layout, setLayout] = useState(cardLayouts[0]);
  const [cardsArray, setCardsArray] = useState<Card[]>([]);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  useEffect(() => {
    setCardSize(localStorage.getItem("cardSize") ?? "25%");
  }, []);

  useEffect(() => {
    if (cardSize !== undefined) localStorage.setItem("cardSize", cardSize);
  }, [cardSize]);

  const handleSaveCard = (card: Card) => {
    if (editingCardIndex !== null) {
      // Update existing card
      const updatedCards = [...cardsArray];
      updatedCards[editingCardIndex] = card;
      setCardsArray(updatedCards);
    } else {
      // Create new card
      setCardsArray([...cardsArray, card]);
    }
    setEditingCardIndex(null);
  };

  return (
    <div className="flex flex-1 flex-col pl-6 overflow-y-scroll group-hover:pointer-events-none">
      <div className="sticky top-0 flex align-middle gap-4 z-30 py-3">
        <Select value={cardSize} onValueChange={setCardSize}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select card size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="20%">Small Cards</SelectItem>
              <SelectItem value="25%">Medium Cards</SelectItem>
              <SelectItem value="33%">Large Cards</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <CardCreationDialog onSave={handleSaveCard} />
        {cardLayouts.map((option) => (
          <button
            key={option.label}
            className={`px-4 py-2 rounded border ${layout.label === option.label
                ? "bg-blue-600 text-white"
                : "bg-white text-black border-gray-400"
              }`}
            onClick={() => setLayout(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex flex-1 flex-wrap justify-start gap-2 transition-all duration-300">
        {cardsArray.map((card, index) => (
          <Card
            title={card.title}
            picture={card.images[0] || "https://cdn.prod.website-files.com/645a9acecda2e0594fac6126/6685a488a38a8a680ba9e5f6_og-tiptap-editor.jpg"}
            description={card.description}
            size={cardSize!}
            lessons={lessons}
            settingsButton={
              <CardCreationDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Settings2Icon className="size-4" />
                  </Button>
                }
                initialData={card}
                onSave={handleSaveCard}
                onOpenChange={(open) => {
                  if (open) {
                    setEditingCardIndex(index);
                  } else {
                    setEditingCardIndex(null);
                  }
                }}
              />
            }
          />
        ))}
      </div>
    </div>
  );
}
