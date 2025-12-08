"use client";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { Button } from "../ui/button";

const ConnectWalletButton = () => {
  const { open } = useWeb3Modal();

  return (
    <Button size="lg" variant="connect" onClick={() => open()}>
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;
