"use client";

import MakeCoin from "~/components/ui/form/MakeCoin";
import DisplayCard from "~/components/ui/card/DisplayCard";
import { api } from "~/trpc/react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import arrow from "../../public/Arrow.svg";
import MainLogo from "../../public/logo-new.svg";
import gem from "../../public/Gem.svg";
import type { StaticImageData } from "next/image";
import { useState, useCallback, useEffect, useMemo } from "react";
import type { DisplayCardProps } from "~/components/ui/card/DisplayCard";

export default function Home() {
  const [animatingId, setAnimatingId] = useState<number | null>(null);
  const [lastAnimatedId, setLastAnimatedId] = useState<number | null>(null);
  const [cardOrder, setCardOrder] = useState<number[]>([]);
  const { data: token } = api.token.getAllTokens.useQuery();

  // Initialize card order when tokens are loaded
  useEffect(() => {
    if (token && cardOrder.length === 0) {
      setCardOrder(token.map(t => t.id));
    }
  }, [token, cardOrder.length]);

  const handleAnimation = useCallback((id: number, isAnimating: boolean) => {
    if (isAnimating) {
      // Only allow animation if it's not the last token that was animated
      if (id !== lastAnimatedId) {
        setAnimatingId(id);
        setLastAnimatedId(id);
        // Move the animating card to the start of the order
        setCardOrder(prev => {
          const newOrder = prev.filter(cardId => cardId !== id);
          return [id, ...newOrder];
        });
      }
    } else {
      setAnimatingId(null);
    }
  }, [lastAnimatedId]);

  const sortedTokens = useMemo(() => {
    if (!token) return [];
    // Sort tokens based on the cardOrder array
    return [...token].sort((a, b) => {
      const indexA = cardOrder.indexOf(a.id);
      const indexB = cardOrder.indexOf(b.id);
      return indexA - indexB;
    });
  }, [token, cardOrder]);

  return (
    <div className="flex flex-col gap-16">
      <div className="w-full">
        <span className="mx-auto mb-11 flex w-full items-center justify-center text-4xl text-darkOrange md:text-6xl">
          Meta Extensions
        </span>

        <p className="mb-8 flex flex-nowrap items-center justify-center text-sm font-bold sm:text-base md:text-lg lg:text-xl xl:text-2xl">
          <span className="whitespace-nowrap bg-gradient-to-r from-darkOrange via-white to-darkOrange bg-clip-text text-transparent">
            IS YOUR COIN THE NEXT
          </span>
          <span className="mx-1 inline-flex items-center text-darkOrange">
            <Image
              src={gem as StaticImageData}
              alt="gem"
              width={24}
              height={24}
              className="ml-1 inline h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
            />
          </span>
          <span className="whitespace-nowrap bg-gradient-to-r from-darkOrange via-white to-darkOrange bg-clip-text text-transparent">
            TO HIT $1B? LET&apos;S FIND OUT
          </span>
        </p>

        <div className="bg-striped mx-auto flex w-full max-w-md flex-row items-center justify-between space-x-10 rounded-lg border-2 border-dashed border-darkOrange/40  p-2 py-5 sm:p-3 md:space-x-11 md:p-4 md:py-7">
          <Image
            src={arrow as StaticImageData}
            alt="arrow"
            width={30}
            height={30}
            className="h-10 w-10 flex-shrink-0"
          />
          <div className="flex-grow">
            <MakeCoin />
          </div>
          <Image
            src={arrow as StaticImageData}
            alt="arrow"
            width={30}
            height={30}
            className="h-10 w-10 flex-shrink-0 rotate-180"
          />
        </div>
      </div>
      <div className="bg-newBlack">
        <div className="mx-auto flex w-full max-w-xs flex-col gap-4 px-4 py-6 sm:max-w-2xl sm:flex-row sm:gap-6 sm:px-0 sm:py-11">
          <Button
            variant="connect"
            className="h-10 w-full bg-darkOrange text-xs text-white shadow-[4px_4px_0px_0px_rgba(255,130,0,0.3)] hover:bg-darkOrange/90 sm:h-12 sm:text-sm md:text-base"
          >
            NEW PAIRS
          </Button>
          <Button
            variant="connect"
            className="h-10 w-full border-2 border-darkOrange/40 bg-darkOrange-bg text-xs text-darkOrange shadow-[4px_4px_0px_0px_rgba(255,130,0,0.3)] hover:bg-red-500 hover:text-white sm:h-12 sm:text-sm md:text-base"
          >
            🔥 HOT PAIRS 🔥
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedTokens?.map((token: DisplayCardProps) => (
            <DisplayCard
              key={token.id}
              {...token}
              onAnimationChange={(isAnimating) => handleAnimation(token.id, isAnimating)}
            />
          ))}
        </div>
        <footer className="w-full pt-11 text-center text-lg text-darkOrange/60">
          <p>© Meta Extensions, 2024.</p>
        </footer>
      </div>
    </div>
  );
}
