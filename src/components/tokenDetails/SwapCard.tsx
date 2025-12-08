"use client";

import "./widget.css";
// import { SwapWidgetSkeleton } from "@dex-swap/widgets"
import dynamic from "next/dynamic";
const SwapWidget = dynamic(
  async () => (await import("@uniswap/widgets")).SwapWidget,
  {
    ssr: true,
  },
);
// The url of the default uniswap token list. This list will be passed to the Uniswap component
// and will appear by default in the token selector UI.

// const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

export function SwapCard({
  tokenAddress,
  name,
  symbol,
}: {
  tokenAddress: string;
  name: string;
  symbol: string;
}) {
  // if (typeof window !== "undefined") {
  //   // @ts-ignore
  //   window.Browser = {
  //     T: () => {},
  //   };
  // }

  const token = [
    {
      chainId: 8453,
      address: tokenAddress,
      symbol: symbol,
      name: name,
      decimals: 18,
      logoURI:
        "https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png",
    },
  ];
  return (
    <main>
      <SwapWidget
        // jsonRpcUrlMap={{
        //   1: [getRPC(1)!],
        // }}
        // Specifies the set of tokens that appear by default in the token selector list.
        tokenList={token}
        // Address of the token to be selected by default in the
        // input field (e.g. USDC) for each network chain ID.

        // defaultInputTokenAddress="NATIVE"

        // Default amount for the input field in this case 1 ETH
        defaultInputAmount="1"
        // Address of the token to be selected by default in the input field (e.g. USDC)
        // for each network chain ID.
        defaultOutputTokenAddress={tokenAddress}
      />
    </main>
  );
}
