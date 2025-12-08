/* eslint-disable */

"use client";
import React, { type FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useWeb3ModalAccount, useWeb3Modal } from "@web3modal/ethers/react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import {
  BrowserProvider,
  Contract,
  type Eip1193Provider,
  ethers,
  formatEther,
  TransactionResponse,
} from "ethers";
import { sellToken } from "~/lib/funRouter";
import { TokenDetailsAbi, routerAddress } from "~/constant/contractDetails";
import { Progress } from "../ui/progress"; // Import the Progress component
import { sellUniswapToken } from "~/lib/uniswap";

interface SellCardProps {
  ticker: string;
  tokenId: number;
  tokenAddress: string;
  provider: Eip1193Provider;
  isUniswapRouter: boolean;
  pairAddress: string;
}

const SellCard: FC<SellCardProps> = ({
  ticker,
  tokenId,
  tokenAddress,
  provider,
  isUniswapRouter,
  pairAddress,
}) => {
  const [price, setPrice] = useState("0");
  const [balance, setBalance] = useState(BigInt(0));
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { address: userAddress } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  const [ethersProvider, setEthersProvider] = useState<BrowserProvider | null>(
    null,
  );
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (provider) {
      const newEthersProvider = new BrowserProvider(provider);
      setEthersProvider(newEthersProvider);

      const newTokenContract = new Contract(
        tokenAddress,
        TokenDetailsAbi,
        newEthersProvider,
      );
      setTokenContract(newTokenContract);
    }
  }, [provider, tokenAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleBadgeClick = (value: string) => {
    if (balance > BigInt(0)) {
      const percentage = parseInt(value) / 100;
      const amount = BigInt(Math.floor(Number(balance) * percentage));
      setPrice(formatEther(amount));
    }
  };

  const transaction = api.transaction.addTransaction.useMutation({
    onSuccess: () => {
      setPrice("0");
      toast("Transaction successful");
      setLoading(false);
      setProgress(0);
      window.location.reload();
      void getBalance(); // Refresh balance after successful transaction
    },
    onError: (error) => {
      setPrice("0");
      toast(`Transaction failed: ${error.message}`);
      setLoading(false);
      setProgress(0);
    },
  });

  const getBalance = async () => {
    if (!tokenContract || !tokenContract.balanceOf || !userAddress) return;
    try {
      const balancee = await tokenContract.balanceOf(userAddress);
      console.log("balance", balancee);
      setBalance(BigInt(balancee));
      return BigInt(balancee);
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast("Failed to fetch balance");
    }
  };

  const handleSell = async () => {
    if (!userAddress) {
      open();
      return;
    }
    if (!price || price === "0") {
      toast("Please enter a valid amount");
      return;
    }
    if (!tokenId || !ethersProvider || !tokenContract) {
      toast("Unable to process transaction at this time");
      return;
    }

    const balanceInEther = formatEther(balance);
    if (parseFloat(price) > parseFloat(balanceInEther)) {
      toast("Insufficient balance");
      return;
    }

    setLoading(true);
    setProgress(10);

    if (!tokenContract.allowance) return;
    const allowance = (await tokenContract.allowance(
      userAddress,
      routerAddress,
    )) as number;
    console.log("allowance", allowance);
    const parsedPrice = ethers.parseEther(price);

    setProgress(30);

    if (allowance < parsedPrice) {
      const signer = await ethersProvider.getSigner();
      const runner = new Contract(tokenAddress, TokenDetailsAbi, signer);
      if (!runner.approve) return;
      const response = (await runner.approve(
        routerAddress,
        parsedPrice,
      )) as TransactionResponse;
      console.log("approval response", response);
      await response.wait();
    }

    setProgress(60);

    if (isUniswapRouter) {
      const transactionHash = await sellUniswapToken(
        userAddress,
        tokenAddress,
        provider,
        price,
        isUniswapRouter,
      );
      console.log("returned", transactionHash);
      setProgress(60);
      transactionHash &&
        transaction.mutate({
          type: "sell",
          userAddress,
          transactionHash,
          tokenId,
          amount: price,
          fees: "0.1",
        });
      setProgress(80);
    } else {
      const transactionHash = await sellToken(
        userAddress,
        tokenAddress,
        provider,
        price,
        isUniswapRouter,
        pairAddress,
      );
      console.log("returned", transactionHash);
      setProgress(60);
      transactionHash &&
        transaction.mutate({
          type: "sell",
          userAddress,
          transactionHash,
          tokenId,
          amount: price,
          fees: "0.1",
        });
      setProgress(80);
    }

    setProgress(90);
  };

  useEffect(() => {
    void getBalance();
  }, [userAddress, tokenContract]);

  const badgeValues = ["25", "50", "75", "100"];

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <span className="mb-1 font-04b_19 text-lg text-white/90 sm:mb-0">
          SELL TOKEN
        </span>
        <span className="font-mono text-sm text-white/60">
          Balance: {formatEther(balance).slice(0, 8)} {ticker}
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
        {["25", "50", "100"].map((value) => (
          <Button
            key={value}
            variant="outline"
            className="h-10 rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg font-04b_19 text-sm text-darkOrange hover:bg-darkOrange hover:text-white"
            onClick={() => handleBadgeClick(value)}
          >
            {value}%
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
        onClick={handleSell}
        disabled={loading}
        className="h-12 w-full rounded-none border-2 border-darkOrange/40 bg-orange-gradient font-04b_19 text-base text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "PROCESSING..." : "TRADE"}
      </Button>
    </div>
  );
};

export default SellCard;
