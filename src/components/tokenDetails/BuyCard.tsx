/* eslint-disable */

"use client";
import React, { type FC, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { toast } from "sonner";
import { type Eip1193Provider, formatEther } from "ethers";
import { buyToken } from "~/lib/funRouter";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { buyUniswapToken } from "~/lib/uniswap";
import { Progress } from "../ui/progress"; // Import the Progress component

interface BuyCardProps {
  ticker: string | undefined;
  tokenId: number | undefined;
  tokenAddress: string | undefined;
  balance: bigint;
  provider: Eip1193Provider;
  isUniswapRouter: boolean;
  pairAddress: string;
}

const BuyCard: FC<BuyCardProps> = ({
  ticker,
  tokenId,
  tokenAddress,
  balance,
  provider,
  isUniswapRouter,
  pairAddress,
}) => {
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const badgeValues = ["0", "0.1", "0.5", "1"];

  const { address: userAddress } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleBadgeClick = (value: string) => {
    setPrice(value);
  };

  const transaction = api.transaction.addTransaction.useMutation({
    onSuccess: () => {
      setPrice("0");
      toast("Transaction successful");
      window.location.reload();
    },
    onError: () => {
      setPrice("0");
      toast("Transaction failed");
    },
  });

  const handleBuy = async () => {
    if (!userAddress) {
      open();
      return;
    }
    if (!price || price === "0") {
      toast("Please enter a price");
      return;
    }
    if (!tokenId || !tokenAddress) {
      toast("Unable to process transaction at this time");
      return;
    }

    setLoading(true);
    setProgress(10);

    console.log("buying token", tokenAddress, userAddress, price);

    try {
      if (isUniswapRouter) {
        setProgress(15);
        const transactionHash = await buyUniswapToken(
          userAddress,
          tokenAddress,
          provider,
          price,
          isUniswapRouter,
        );
        console.log("returned", transactionHash);
        setProgress(50);

        if (transactionHash) {
          transaction.mutate({
            type: "buy",
            userAddress,
            transactionHash,
            tokenId,
            amount: price,
            fees: "0.1",
          });
          setProgress(80);
        }
      } else {
        setProgress(30);
        const transactionHash = await buyToken(
          userAddress,
          tokenAddress,
          provider,
          price,
          isUniswapRouter,
          pairAddress,
        );
        console.log("returned", transactionHash);
        setProgress(60);

        if (transactionHash) {
          transaction.mutate({
            type: "buy",
            userAddress,
            transactionHash,
            tokenId,
            amount: price,
            fees: "0.1",
          });
          setProgress(80);
        }
      }

      setProgress(90);
    } catch (error) {
      console.error("Error during buy transaction:", error);
      toast("An error occurred during the transaction");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <span className="mb-1 font-04b_19 text-lg text-white/90 sm:mb-0">
          BUY TOKEN
        </span>
        <span className="font-mono text-sm text-white/60">
          Balance: {formatEther(balance.toString()).slice(0, 8)} ETH
        </span>
      </div>

      <div className="group rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg p-3 transition-colors hover:border-darkOrange/60">
        <Input
          value={price}
          onChange={handleInputChange}
          className="h-12 w-full border-0 bg-transparent font-mono text-lg text-white placeholder:text-darkOrange/50 focus:outline-none"
          placeholder="0.0"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Button
          variant="outline"
          className="h-10 rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg font-04b_19 text-sm text-darkOrange hover:bg-darkOrange hover:text-white"
          onClick={() => handleBadgeClick("0")}
        >
          RESET
        </Button>
        {["0.1", "0.5", "1"].map((value) => (
          <Button
            key={value}
            variant="outline"
            className="h-10 rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg font-04b_19 text-sm text-darkOrange hover:bg-darkOrange hover:text-white"
            onClick={() => handleBadgeClick(value)}
          >
            {value} ETH
          </Button>
        ))}
      </div>

      {loading && (
        <div className="space-y-2">
          <span className="font-04b_19 text-center text-sm text-darkOrange">
            Transaction in progress...
          </span>
          <div className="h-3 border-2 border-darkOrange/40 bg-darkOrange-bg">
            <div 
              className="h-full bg-darkOrange transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <Button
        onClick={handleBuy}
        disabled={loading}
        className="h-12 w-full rounded-none border-2 border-darkOrange/40 bg-orange-gradient font-04b_19 text-base text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "PROCESSING..." : "TRADE"}
      </Button>
    </div>
  );
};

export default BuyCard;
