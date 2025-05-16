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
import { lessons } from "~/mock/lessons";
import { cardSizeSchema } from "../schemas/auth";

//* Previous implementation of API
// import { homeApi } from "~/lib/home.server";
// import { requireUser } from "~/lib/auth.server";
// import type { LoaderFunction } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// export const loader: LoaderFunction = async ({ request }: Route.LoaderArgs) => {
  // let user = await requireUser(request);
  // console.log(user);
  // return { user };
  //* Previous implementation of API
  // const user = await requireUser(request);
  // return { user };
// };

export default function Home() {
  const [cardSize, setCardSize] = useState<string>();
  const [cardsArray, setCardsArray] = useState<CardI[]>([]);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  useEffect(() => {
    //* Previous implementation of API
    // TODO: make card's fields fron response being aligned with CardI type
    // homeApi.getCards().then((cards) => {
    //   setCardsArray(cards);
    //   console.log("cards", cards);
    // });
    const savedSize = cardSizeSchema.safeParse(localStorage.getItem("cardSize"));
    setCardSize(savedSize.success ? savedSize.data : "25%");
  }, []);

  useEffect(() => {
    if (cardSize !== undefined) localStorage.setItem("cardSize", cardSize);
  }, [cardSize]);

  const handleSaveCard = async (card: CardI) => {
    //! Same here, might be done in other way
    // const res = await homeApi.createCard(card);
    // console.log(res)
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
      {/* Header Menu */}
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
      {/* Cards */}
      <div className="flex flex-1 flex-wrap justify-start gap-2 transition-all duration-300">
        {cardsArray.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            picture={card.picture || "https://cdn.prod.website-files.com/645a9acecda2e0594fac6126/6685a488a38a8a680ba9e5f6_og-tiptap-editor.jpg"}
            description={card.description}
            size={cardSize || "25%"}
            lessons={lessons}
            //* Card editing button
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
