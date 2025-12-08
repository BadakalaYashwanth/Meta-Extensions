"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";

interface Transaction {
  type: "buy" | "sell" | "create";
  address: string;
  amount?: string;
  tokenName: string;
  timestamp?: Date;
  tokenAddress: string;
}

interface NotificationState {
  transaction: Transaction | null;
  isNew: boolean;
  colorIndex: number;
}

const NOTIFICATION_COLORS = [
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * NOTIFICATION_COLORS.length);
  return randomIndex;
};

const NotificationBox = ({
  transaction,
  isNew,
  colorIndex,
}: NotificationState) => {
  if (!transaction) return null;

  const isTradeTransaction =
    transaction.type === "buy" || transaction.type === "sell";

  return (
    <div
      className={`flex h-10 w-80 cursor-pointer items-center justify-center font-04b_19 ${
        NOTIFICATION_COLORS[colorIndex]
      } p-1 text-sm text-white transition-all ${isNew ? "animate-shake" : ""}`}
    >
      <span className="truncate px-2">
        {transaction.address.slice(0, 6)}{" "}
        {isTradeTransaction ? (
          <>
            {transaction.type === "buy" ? "bought" : "sold"}{" "}
            {transaction.amount}{" "}
            <Link
              href={`/token/${transaction.tokenAddress}`}
              className="underline hover:opacity-80"
            >
              ${transaction.tokenName}
            </Link>
          </>
        ) : (
          <>
            Created{" "}
            <Link
              href={`/token/${transaction.tokenAddress}`}
              className="underline hover:opacity-80"
            >
              ${transaction.tokenName}
            </Link>
          </>
        )}
      </span>
    </div>
  );
};

export const TokenNotification = () => {
  const [createState, setCreateState] = useState<NotificationState>({
    transaction: null,
    isNew: false,
    colorIndex: getRandomColor(),
  });

  const [tradeState, setTradeState] = useState<NotificationState>({
    transaction: null,
    isNew: false,
    colorIndex: getRandomColor(),
  });

  // Store history of transactions
  const [tradeHistory, setTradeHistory] = useState<Transaction[]>([]);
  const [createHistory, setCreateHistory] = useState<Transaction[]>([]);
  const MAX_HISTORY = 50; // Keep last 50 transactions in history

  const { data: latestTokens } = api.token.getLatestTokens.useQuery(undefined, {
    refetchInterval: 1500,
  });

  const { data: latestTransactions } =
    api.transaction.getLatestTransactions.useQuery(undefined, {
      refetchInterval: 1500,
    });

  const getRandomTransaction = (transactions: Transaction[]) => {
    if (transactions.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * transactions.length);
    return transactions[randomIndex];
  };

  const handleNewTransaction = (
    newTx: Transaction,
    currentState: NotificationState,
    setState: (
      state:
        | NotificationState
        | ((prev: NotificationState) => NotificationState),
    ) => void,
  ) => {
    setState({
      transaction: newTx,
      isNew: true,
      colorIndex: getRandomColor(),
    });

    setTimeout(() => {
      setState((prev) => ({ ...prev, isNew: false }));
    }, 500);
  };

  // Update histories when new data arrives
  useEffect(() => {
    if (latestTokens) {
      setCreateHistory((prev) => {
        const newTokens = latestTokens
          .map((token) => ({
            type: "create" as const,
            address: token.userAddress,
            tokenName: token.ticker,
            tokenAddress: token.tokenAddress,
            timestamp: new Date(),
          }))
          .filter(
            (newToken) =>
              !prev.some((t) => t.tokenAddress === newToken.tokenAddress),
          );

        return [...newTokens, ...prev].slice(0, MAX_HISTORY);
      });
    }

    if (latestTransactions) {
      const newTrades = latestTransactions
        .filter((tx) => tx.type === "buy" || tx.type === "sell")
        .map((tx) => ({
          type: tx.type as "buy" | "sell",
          address: tx.userAddress,
          amount: tx.amount,
          tokenName: tx.token.ticker,
          tokenAddress: tx.token.tokenAddress,
          timestamp: tx.createdAt,
        }));

      setTradeHistory((prev) => {
        const uniqueNewTrades = newTrades.filter(
          (newTrade) =>
            !prev.some(
              (t) =>
                t.timestamp?.getTime() === newTrade.timestamp?.getTime() &&
                t.tokenAddress === newTrade.tokenAddress &&
                t.address === newTrade.address,
            ),
        );
        return [...uniqueNewTrades, ...prev].slice(0, MAX_HISTORY);
      });
    }
  }, [latestTokens, latestTransactions]);

  // Randomly update displayed transactions with staggered timing
  useEffect(() => {
    // Random interval between 1.5 to 3 seconds for trades
    const getRandomTradeInterval = () => Math.random() * 1500 + 1000;
    
    // Random interval between 1.5 to 3 seconds for creates
    const getRandomCreateInterval = () => Math.random() * 1500 + 1000;

    let tradeTimeoutId: NodeJS.Timeout;
    let createTimeoutId: NodeJS.Timeout;

    const updateTrade = () => {
      const randomTrade = getRandomTransaction(tradeHistory);
      if (randomTrade) {
        handleNewTransaction(randomTrade, tradeState, setTradeState);
      }
      tradeTimeoutId = setTimeout(updateTrade, getRandomTradeInterval());
    };

    const updateCreate = () => {
      const randomCreate = getRandomTransaction(createHistory);
      if (randomCreate) {
        handleNewTransaction(randomCreate, createState, setCreateState);
      }
      createTimeoutId = setTimeout(updateCreate, getRandomCreateInterval());
    };

    // Start both update cycles
    tradeTimeoutId = setTimeout(updateTrade, getRandomTradeInterval());
    createTimeoutId = setTimeout(updateCreate, getRandomCreateInterval());

    return () => {
      clearTimeout(tradeTimeoutId);
      clearTimeout(createTimeoutId);
    };
  }, [tradeHistory, createHistory]);

  return (
    <div className="hidden md:flex md:flex-wrap md:gap-5">
      <NotificationBox {...tradeState} />
      <NotificationBox {...createState} />
    </div>
  );
};
