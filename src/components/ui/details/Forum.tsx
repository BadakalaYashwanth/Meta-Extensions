"use client";
import React, { type FC } from "react";
import { api } from "~/trpc/react";
import turunctateString from "~/utils/trunctateString";

interface ForumProps {
  tokenId: number | undefined;
  ticker: string | undefined;
}

const Forum: FC<ForumProps> = ({ tokenId, ticker }) => {
  if (!tokenId) {
    return null;
  }
  const { data: transactions, isLoading } =
    api.transaction.getTransactionsByToken.useQuery({
      id: tokenId,
    });

  function formatDate(date: Date): string {
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h`;
    return `${Math.floor(diffSeconds / 86400)}d`;
  }

  return (
    <div className="flex w-full flex-col gap-4 bg-[#111111] p-4">
      <h1 className="font-04b_19 text-2xl text-white/90 md:text-3xl">
        TRADES
      </h1>
      {isLoading ? (
        <p className="text-lg text-white/60">Loading trades...</p>
      ) : transactions && transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-separate border-spacing-y-1">
            <thead>
              <tr className="text-left font-mono text-sm text-white/50 md:text-base">
                <th className="py-2">ACCOUNT</th>
                <th className="py-2">TYPE</th>
                <th className="py-2">{ticker?.toUpperCase()}/ETH</th>
                <th className="py-2">DATE</th>
                <th className="py-2">TRANSACTION</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="text-sm text-white/80 hover:bg-white/5 md:text-base"
                >
                  <td className="px-2 py-2 font-mono">
                    {turunctateString(transaction.userAddress)}
                  </td>
                  <td className="px-2 py-2">
                    <span
                      className={`px-2 py-1 font-mono text-sm uppercase md:text-base
                        ${transaction.type.toLowerCase() === "buy" 
                          ? "text-[#00FFA3]" 
                          : "text-[#FF4D4D]"}`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-2 py-2 font-mono">{transaction.amount}</td>
                  <td className="px-2 py-2 font-mono text-white/40">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="px-2 py-2">
                    <a
                      href={`https://basescan.org/tx/${transaction.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[#00FFA3] hover:underline"
                    >
                      {turunctateString(transaction.transactionHash)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-lg text-white/60">No trades available for this token yet.</p>
          <p className="mt-2 text-base text-[#00FFA3]">
            Be the first to trade {ticker}!
          </p>
        </div>
      )}
    </div>
  );
};

export default Forum;
