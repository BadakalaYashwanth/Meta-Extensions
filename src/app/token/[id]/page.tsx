"use client";
import "@uniswap/widgets/fonts.css";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { CopyIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ShimmerEffect from "~/components/ui/card/ShimmerEffect";
import Forum from "~/components/ui/details/Forum";
import BuyCard from "~/components/tokenDetails/BuyCard";
import SellCard from "~/components/tokenDetails/SellCard";
import EditCoin from "~/components/tokenDetails/EditCoin";
import Logo from "../../../../public/logo-new.svg";
import type { StaticImageData } from "next/image";
import { BrowserProvider } from "ethers";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { toast } from "sonner";
import { type PoolInfo, getPoolInfo } from "~/lib/poolInfo";
import { Skeleton } from "~/components/ui/skeleton";
import Image from "next/image";
import { formatPrice } from "~/lib/utils";
import SocialLinks from "~/components/SocialLinks";

interface PairResponse {
  pairAddress: string;
  success?: boolean;
  error?: string;
}

function Page() {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const params = useParams();
  const router = useRouter();
  const [balance, setBalance] = useState<bigint>(BigInt(100));
  const [poolDetails, setPoolDetails] = useState<PoolInfo | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const id = typeof params?.id === "string" ? params.id : "";

  const { data: token, isLoading: isTokenLoading } =
    api.token.getOnetoken.useQuery({
      tokenAddress: id,
    });

  const updateToken = api.token.updateToken.useMutation();

  const getBalance = useCallback(async () => {
    if (walletProvider && address) {
      try {
        const ethersProvider = new BrowserProvider(walletProvider);
        const balancee = await ethersProvider.getBalance(address);
        setBalance(BigInt(balancee));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  }, [walletProvider, address]);

  const getPoolInfoo = useCallback(async () => {
    if (token?.pairAddress) {
      setIsLoading(true);
      try {
        const poolInfo = await getPoolInfo(token.pairAddress);
        if (poolInfo) setPoolDetails(poolInfo);
      } catch (error) {
        console.error("Error fetching pool info:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [token?.pairAddress]);

  const promoteToUniswap = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch("/api/pool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: token.id,
          tokenAddress: token.tokenAddress,
          pairAddress: token.pairAddress,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      const pair = JSON.parse(responseText) as PairResponse;

      if (!pair.pairAddress) {
        throw new Error("Invalid response format: missing pairAddress");
      }

      void updateToken.mutate({
        id: token.id,
        pairAddress: pair.pairAddress,
        isDeployed: true,
      });
    } catch (error) {
      console.error("Error in promoteToUniswap:", error);
    }
  }, [token, updateToken]);

  useEffect(() => {
    void getBalance();
  }, [isConnected, getBalance]);

  useEffect(() => {
    if (!isTokenLoading && token) {
      void getPoolInfoo();
    }
  }, [isTokenLoading, token, getPoolInfoo]);

  useEffect(() => {
    if (poolDetails) {
      void promoteToUniswap();
    }
  }, [poolDetails, promoteToUniswap]);

  useEffect(() => {
    console.log("Token data:", token);
  }, [token]);

  const handleCopy = useCallback(async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast(`Copied ${label} to clipboard`);
  }, []);

  const marketCapContent = useMemo(
    () =>
      isLoading ? (
        <Skeleton className="h-4 w-[100px]" />
      ) : (
        "$" + (poolDetails?.marketCapUSD ?? "N/A")
      ),
    [isLoading, poolDetails?.marketCapUSD],
  );

  const liquidityContent = useMemo(
    () =>
      isLoading ? (
        <Skeleton className="h-4 w-[100px]" />
      ) : (
        "$" + (poolDetails?.liquidityUSD ?? "N/A")
      ),
    [isLoading, poolDetails?.liquidityUSD],
  );

  const getImageUrl = useCallback(() => {
    return token?.image ?? "https://via.placeholder.com/200?text=No+Image";
  }, [token?.image]);

  const progressValue = useMemo(() => {
    if (!poolDetails) return 0;
    const maxMarketCap = 1000000;
    return Math.min(
      (Number(poolDetails.marketCapUSD) / maxMarketCap) * 100,
      100,
    );
  }, [poolDetails]);

  const formattedPrice = useMemo(() => {
    if (!poolDetails?.tokenPriceUSD) return "N/A";
    return formatPrice(parseFloat(poolDetails.tokenPriceUSD));
  }, [poolDetails?.tokenPriceUSD]);

  if (!id) {
    return <div>Invalid token ID</div>;
  }

  if (isTokenLoading) {
    return <ShimmerEffect />;
  }

  return (
    <>
      <span className="mx-auto mb-11 flex items-center justify-center text-center text-darkOrange md:text-[200px] text-8xl w-full max-w-[300px] md:max-w-[550px]">
        {/* <Image
          src={Logo as StaticImageData}
          alt="logo"
          priority
          className="h-auto w-full"
        /> */}
        Meta Extensions
      </span>
      <div className="w-full bg-newBlack text-darkOrange">
        <div className="mx-auto max-w-[1440px] px-4 py-4">
          <Button
            onClick={() => router.push("/")}
            variant="connect"
            className="mb-4 text-base font-bold text-white shadow-[4px_4px_0px_0px_rgba(255,130,0,0.3)] hover:no-underline"
          >
            ← BACK
          </Button>
          {/* Token Info Card */}
          <div className="mb-4 border-2 border-darkOrange/40 bg-darkOrange-bg p-4 shadow-[4px_4px_0px_0px_rgba(255,130,0,0.3)]">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="mb-4 w-full md:mb-0 md:w-1/6">
                <div className="mx-auto aspect-square max-w-[200px] overflow-hidden border-2 border-darkOrange/40 md:mx-0">
                  <Image
                    src={getImageUrl()}
                    alt={token?.name ?? "Token image"}
                    width={200}
                    height={200}
                    layout="responsive"
                    objectFit="cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-5/6">
                <h2 className="mb-2 border-b border-darkOrange/20 text-3xl font-bold text-darkOrange md:text-4xl">
                  {token?.name}
                </h2>
                <div className="mb-2 flex flex-col justify-between md:flex-row">
                  <p className="mb-2 text-base text-darkOrange/80 md:mb-0 md:text-lg">
                    <span className="font-bold">TICKER:</span>{" "}
                    <span className="underline">{token?.ticker}</span>
                  </p>
                  <p className="mb-2 text-base text-darkOrange/80 md:mb-0 md:text-lg">
                    <span className="font-bold">CA:</span>
                    <span className="underline">
                      {token?.tokenAddress?.slice(0, 6)}...
                      {token?.tokenAddress?.slice(-4)}
                    </span>
                    <CopyIcon
                      onClick={() =>
                        handleCopy(token?.tokenAddress ?? "", "token address")
                      }
                      className="ml-2 inline-block h-4 w-4 cursor-pointer"
                    />
                  </p>
                  <p className="mb-2 text-base text-darkOrange/80 md:mb-0 md:text-lg">
                    <span className="font-bold">CREATED BY:</span>{" "}
                    <span className="underline">
                      {token?.userAddress?.slice(0, 4)}...
                      {token?.userAddress?.slice(-4)}
                    </span>
                  </p>
                </div>
                <div className="my-2 border-t border-darkOrange/20"></div>
                <p className="p-2 text-base text-darkOrange/80 md:text-lg">
                  {token?.description ?? "No description available"}
                </p>
              </div>
            </div>
            <div className="my-2 border-t border-darkOrange/20"></div>
            <div className="mb-2 flex items-center">
              <div className="mr-2 h-4 w-[50%] bg-darkOrange/10 md:w-[20%]">
                <div
                  className="h-full bg-greenColorMain transition-all"
                  style={{ width: `${progressValue}%` }}
                ></div>
              </div>
              <span className="whitespace-nowrap font-mono text-sm font-bold text-darkOrange md:text-base">
                {formattedPrice}
              </span>
            </div>
            <div className="flex flex-col justify-between text-sm md:flex-row">
              <div className="mb-2 rounded-none border border-darkOrange/40 bg-newBlack px-2 py-1 font-mono text-darkOrange md:mb-0">
                MARKET CAP: {marketCapContent}
              </div>
              <div className="rounded-none border border-darkOrange/40 bg-newBlack px-2 py-1 font-mono text-darkOrange">
                LIQUIDITY: {liquidityContent}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Left Column - Chart and Forum */}
            <div className="w-full space-y-4 lg:w-3/4">
              {token && (
                <iframe
                  className="h-[300px] w-full border-2 border-darkOrange/40 shadow-[4px_4px_0px_0px_rgba(255,130,0,0.3)] sm:h-[400px]"
                  id="dextools-widget"
                  title="DEXTools Trading Chart"
                  src={`https://www.dextools.io/widget-chart/en/base/pe-light/${token?.pairAddress}?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false`}
                ></iframe>
              )}
              <Forum tokenId={token?.id} ticker={token?.ticker} />
            </div>

            {/* Right Column - Buy/Sell and Social Links */}
            <div className="w-full space-y-4 lg:w-1/4">
              {token?.userAddress === address && token && (
                <EditCoin id={token?.id} token={token?.ticker} />
              )}
              {token && (
                <div className="rounded-none border-2 border-darkOrange/40 bg-[#111111] p-4">
                  <Tabs defaultValue="buy">
                    <TabsList className="mb-4 grid w-full grid-cols-2 gap-3">
                      <TabsTrigger
                        value="buy"
                        className="rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg px-4 py-2 font-04b_19 text-darkOrange transition-all hover:bg-darkOrange hover:text-white data-[state=active]:bg-darkOrange data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:shadow-[4px_4px_0px_0px_rgba(255,130,0,0.3)]"
                      >
                        BUY
                      </TabsTrigger>
                      <TabsTrigger
                        value="sell"
                        className="rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg px-4 py-2 font-04b_19 text-darkOrange transition-all hover:bg-darkOrange hover:text-white data-[state=active]:bg-darkOrange data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:shadow-[4px_4px_0px_0px_rgba(255,130,0,0.3)]"
                      >
                        SELL
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="buy">
                      <BuyCard
                        ticker={token?.ticker}
                        tokenId={token?.id}
                        tokenAddress={token?.tokenAddress}
                        balance={balance}
                        provider={walletProvider!}
                        isUniswapRouter={token.isDeployed}
                        pairAddress={token?.pairAddress}
                      />
                    </TabsContent>
                    <TabsContent value="sell">
                      <SellCard
                        ticker={token?.ticker}
                        tokenId={token?.id}
                        tokenAddress={token?.tokenAddress}
                        provider={walletProvider!}
                        isUniswapRouter={token.isDeployed}
                        pairAddress={token?.pairAddress}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              <SocialLinks
                twitter={token?.twitter ?? undefined}
                website={token?.website ?? undefined}
                telegram={token?.telegram ?? undefined}
                youtube={token?.youtube ?? undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
