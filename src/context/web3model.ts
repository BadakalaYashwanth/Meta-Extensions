"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

const projectId = "5a9c48a6ff2fcefd23f583b8b3a57775";

const base = {
  chainId: 8453,
  name: "Base",
  currency: "ETH",
  explorerUrl: "https://basescan.org",
  rpcUrl: "https://base.llamarpc.com",
};

const metadata = {
  name: "0xgasless",
  description: "",
  url: "https://earn.fun",
  icons: ["https://avatars.mywebsite.com/"],
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl:
    "https://rpc.ankr.com/multichain/6f20cdab3ec0a974bb9e2de2f15a6774fd3fd53fbcda6d51c0e03b09cab83149",
  defaultChainId: 8453,
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [base],
  projectId,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  enableOnramp: false, // Optional - false as default
});

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return children;
}
