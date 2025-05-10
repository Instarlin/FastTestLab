import { useEffect, useState } from "react";
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
import { Button } from "~/components/ui/button";
import { Settings2Icon } from "lucide-react";
import { CardDialog, type CardI } from "~/components/CardDialog";
import { homeApi } from "~/lib/homeApi";
// import { requireUser } from "~/lib/auth.server";
// import type { LoaderFunction } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

//! Needs to be done on server, kubernetes required
// export const loader: LoaderFunction = async ({ request }: Route.LoaderArgs) => {
  // const user = await requireUser(request);
  // return { user };
// };

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

export default function Home() {
  const [cardSize, setCardSize] = useState<string>();
  const [cardsArray, setCardsArray] = useState<CardI[]>([]);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const allowedSizes = ["20%", "25%", "33%"];

  useEffect(() => {
    homeApi.getCards().then((cards) => {
      // TODO: make card's fields fron response being aligned with CardI type
      // setCardsArray(cards);
      console.log("cards", cards);
    });
    const savedSize = localStorage.getItem("cardSize");
    setCardSize(allowedSizes.includes(savedSize || "") && savedSize ? savedSize : "25%");
  }, []);

  useEffect(() => {
    if (cardSize !== undefined) localStorage.setItem("cardSize", cardSize);
  }, [cardSize]);

  const handleSaveCard = async (card: CardI) => {
    const res = await homeApi.createCard(card);
    console.log(res)
    if (editingCardIndex !== null) {
      const updatedCards = [...cardsArray];
      updatedCards[editingCardIndex] = card;
      setCardsArray(updatedCards);
    } else {
      setCardsArray([...cardsArray, card]);
    }
    setEditingCardIndex(null);
  };

  return (
    <div className="flex flex-1 flex-col pl-5 pt-5 overflow-y-scroll">
      <div className="sticky top-0 flex align-middle gap-4 z-30">
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
        <CardDialog onSave={handleSaveCard} />
      </div>
      <div className="flex flex-1 flex-wrap justify-start gap-2 transition-all duration-300">
        {cardsArray.map((card, index) => (
          <Card
            title={card.title}
            picture={card.picture || "https://cdn.prod.website-files.com/645a9acecda2e0594fac6126/6685a488a38a8a680ba9e5f6_og-tiptap-editor.jpg"}
            description={card.description}
            size={cardSize || "25%"}
            lessons={lessons}
            settingsButton={
              <CardDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white hover:bg-accent"
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
