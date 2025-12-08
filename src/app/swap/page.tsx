"use client";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import React, { useState } from "react";
import {
  ETH_CHAINLINK_ABI,
  ETH_CHAINLINK_ADDRESS,
} from "~/constant/contractDetails";

const Page = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const [price, setPrice] = useState<null | string>(null);
  const [error, setError] = useState<null | string>(null);

  const getInfo = async () => {
    setError(null);
    setPrice(null);

    try {
      if (!walletProvider) {
        throw new Error("Wallet provider not available");
      }

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        ETH_CHAINLINK_ADDRESS,
        ETH_CHAINLINK_ABI,
        signer,
      );

      if (typeof contract.latestAnswer !== "function") {
        throw new Error("Contract doesn't have latestAnswer function");
      }

      const data = (await contract.latestAnswer()) as bigint;

      const formattedPrice = formatUnits(data, 8);
      setPrice(formattedPrice);
      console.info("Price:", formattedPrice);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div>
      <button className="m-auto bg-red-500 p-4" onClick={getInfo}>
        Get Latest Price
      </button>
      {price && <p>Latest price: ${parseFloat(price).toFixed(2)}</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};

export default Page;
