"use client";

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Label } from "@prisma/client";
import { BoardDetail, CardDetail } from "@/types/board";
import {
  addCardLabel,
  removeCardLabel,
} from "@/app/(dashboard)/[username]/[boardSlug]/@card/(.)cards/[cardId]/actions";

interface CardContextProps {
  card: CardDetail;
  board: BoardDetail;
  path: string;
  toggleLabel: (label: Label, remove: boolean) => void;
}

const CardContext = createContext<CardContextProps>({} as CardContextProps);

export function useCardContext() {
  return useContext(CardContext) as CardContextProps;
}

interface CardContextProviderProps extends PropsWithChildren {
  card: CardDetail;
  board: BoardDetail;
}

const CardContextProvider: FC<CardContextProviderProps> = ({
  children,
  board,
  card: initialCard,
}) => {
  const [card, setCard] = useState(initialCard);
  const path = `/${board.owner.username}/${board.slug}/cards/${card.id}`;

  const toggleLabel = (label: Label, remove: boolean) => {
    setCard((prev) => {
      const newCard = structuredClone(prev);

      if (remove) {
        newCard.labels = prev.labels.filter((x) => x.id !== label.id);
        removeCardLabel(prev.id, label.id);
      } else {
        newCard.labels.push(label);
        addCardLabel(prev.id, label.id);
      }

      return newCard;
    });
  };

  return (
    <CardContext.Provider value={{ card, board, path, toggleLabel }}>
      {children}
    </CardContext.Provider>
  );
};

export default CardContextProvider;
