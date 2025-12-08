"use client";

import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, formatEther } from "ethers";
import { useEffect, useState } from "react";
import ConnectWalletButton from "./ConnectWalletButton";
import turunctateString from "~/utils/trunctateString";
import MyCoins from "./MyCoins";

const HeaderWallet = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [balance, setBalance] = useState<bigint | null>(null);
  const { open } = useWeb3Modal();

  useEffect(() => {
    const getBalance = async () => {
      if (!walletProvider || !address) return;

      try {
        const ethersProvider = new BrowserProvider(walletProvider);
        const balancee = await ethersProvider.getBalance(address);
        setBalance(BigInt(balancee));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(BigInt(0));
      }
    };

    void getBalance();
  }, [isConnected, walletProvider, address]);

  return (
    <div>
      {isConnected ? (
        <div className="flex flex-row items-center justify-center gap-5">
          <div
            onClick={async () => await open({ view: "Account" })}
            className="flex cursor-pointer items-center justify-center gap-3 bg-darkOrange p-1"
          >
            <h1 className="text-sm md:text-base">
              {balance !== null
                ? `${formatEther(balance).slice(0, 8)} ETH`
                : "Loading..."}
            </h1>
            <div className="flex gap-2 p-1 text-sm md:text-base">
              {turunctateString(address!)}
            </div>
          </div>
          <MyCoins />
        </div>
      ) : (
        <ConnectWalletButton />
      )}
    </div>
  );
};

export default HeaderWallet;
