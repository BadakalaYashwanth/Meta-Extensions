"use client";

import React, {
  type FC,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { LinkIcon, TwitterIcon, YoutubeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "../badge";
import { Button } from "../button";
import truncateString from "~/utils/trunctateString";
import { type PoolInfo, getPoolInfo } from "~/lib/poolInfo";
import { cn } from "~/lib/utils";
import { FaTelegramPlane } from "react-icons/fa";

export interface DisplayCardProps {
  id: number;
  name: string;
  ticker: string;
  description: string;
  twitter: string | null;
  youtube: string | null;
  website: string | null;
  telegram: string | null;
  image: string;
  userAddress: string;
  marketCap: number;
  tokenAddress: string;
  liquidity: number;
  pairAddress: string;
  isDeployed: boolean;
  onAnimationChange?: (isAnimating: boolean) => void;
}

const DisplayCard: FC<DisplayCardProps> = ({
  id: _id,
  name,
  description,
  ticker,
  website,
  twitter,
  telegram,
  youtube,
  image,
  userAddress: _userAddress,
  tokenAddress,
  pairAddress,
  onAnimationChange,
}) => {
  const router = useRouter();
  const [poolDetails, setPoolDetails] = useState<PoolInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastAnimatedId, setLastAnimatedId] = useState<number | null>(null);

  // Random animation interval between 1 to 3 seconds
  const getRandomInterval = () => Math.random() * 2000 + 1000;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerAnimation = () => {
      setIsAnimating(true);
      onAnimationChange?.(true);
      
      setTimeout(() => {
        setIsAnimating(false);
        onAnimationChange?.(false);
      }, 800);
      
      timeoutId = setTimeout(triggerAnimation, getRandomInterval());
    };

    timeoutId = setTimeout(triggerAnimation, getRandomInterval());

    return () => clearTimeout(timeoutId);
  }, [onAnimationChange]);

  const fetchPoolInfo = useCallback(
    async (retryCount = 0) => {
      try {
        setLoading(true);
        if (pairAddress) {
          const info = await getPoolInfo(pairAddress);
          if (info) {
            setPoolDetails(info);
            setLoading(false);
          } else {
            throw new Error("No pool information returned");
          }
        } else {
          throw new Error("Pair address not found");
        }
      } catch (err) {
        console.error("Error fetching pool info:", err);
        if (retryCount < 3) {
          console.log(`Retrying... Attempt ${retryCount + 1}`);
          setTimeout(
            () => {
              void fetchPoolInfo(retryCount + 1);
            },
            2000 * (retryCount + 1),
          );
        } else {
          setLoading(false);
        }
      }
    },
    [pairAddress],
  );

  useEffect(() => {
    void fetchPoolInfo();
  }, [fetchPoolInfo]);

  const handleRoute = useCallback(
    (link: string) => {
      router.push(link);
    },
    [router],
  );

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event
    try {
      await navigator.clipboard.writeText(tokenAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const progressValue = useMemo(() => {
    if (!poolDetails) return 0;
    const maxMarketCap = 1000000; 
    return Math.min(
      (Number(poolDetails.marketCapUSD) / maxMarketCap) * 100,
      100,
    );
  }, [poolDetails]);

  const poolInfo = useMemo(() => {
    if (loading) {
      return <div>Loading pool information...</div>;
    }
    if (poolDetails) {
      return (
        <>
          <div className="mb-2 flex items-center">
            <div className="mr-2 h-4 w-full rounded-none bg-darkOrange/10">
              <div
                className="h-full bg-darkOrange transition-all"
                style={{ width: `${progressValue}%`}}
              ></div>
            </div>
            <span className="whitespace-nowrap font-mono text-sm font-bold text-darkOrange">
              ${Number(poolDetails.tokenPriceUSD).toLocaleString(undefined, {
                maximumFractionDigits: 10,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <div className="rounded-none border border-darkOrange/40 bg-newBlack px-2 py-1 font-mono text-xs text-darkOrange">
              MARKET CAP: $
              {Number(poolDetails.marketCapUSD).toLocaleString(undefined, {
                maximumFractionDigits: 10,
              })}
            </div>
            <div className="rounded-none border border-darkOrange/40 bg-newBlack px-2 py-1 font-mono text-xs text-darkOrange">
              LIQUIDITY: $
              {Number(poolDetails.liquidityUSD).toLocaleString(undefined, {
                maximumFractionDigits: 10,
              })}
            </div>
          </div>
        </>
      );
    }
    return <div>No pool information available</div>;
  }, [loading, poolDetails, progressValue]);

  const socialButtons = useMemo(() => {
    console.log("Social links:", { website, twitter, youtube });
    return (
      <div className="relative z-10 mt-4 flex flex-row gap-2">
        {website && (
          <Button
            size="sm"
            className="h-8 rounded-none border border-darkOrange/40 bg-darkOrange-bg text-darkOrange hover:bg-darkOrange hover:text-white"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleRoute(website);
            }}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        )}
        {telegram && (
          <Button
            size="sm"
            className="h-8 rounded-none border border-darkOrange/40 bg-darkOrange-bg text-darkOrange hover:bg-darkOrange hover:text-white"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleRoute(telegram);
            }}
          >
            <FaTelegramPlane className="h-4 w-4" />
          </Button>
        )}
        {twitter && (
          <Button
            size="sm"
            className="h-8 rounded-none border border-darkOrange/40 bg-darkOrange-bg text-darkOrange hover:bg-darkOrange hover:text-white"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleRoute(twitter);
            }}
          >
            <TwitterIcon className="h-4 w-4" />
          </Button>
        )}
        {youtube && (
          <Button
            size="sm"
            className="h-8 rounded-none border border-darkOrange/40 bg-darkOrange-bg text-darkOrange hover:bg-darkOrange hover:text-white"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleRoute(youtube);
            }}
          >
            <YoutubeIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }, [website, twitter, telegram, youtube, handleRoute]);

  return (
    <Card
      className={cn(
        "mx-auto flex w-full max-w-sm cursor-pointer flex-col rounded-none border border-darkOrange/20 bg-gradient-to-b from-[#140904] to-newBlack transition-all duration-200",
        isAnimating ? "animate-card-shake z-10 shadow-[0_0_50px_rgba(255,130,0,0.5)]" : "hover:border-darkOrange/40"
      )}
      onClick={() => router.push(`/token/${tokenAddress}`)}
    >
      <CardContent className="flex flex-grow flex-col p-0">
        {/* Header Section with Image */}
        <div className="relative aspect-square w-full overflow-hidden border-b border-darkOrange/20">
          <Image
            src={image}
            alt={`${name} logo`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-200 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140904] via-[#140904]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-04b_19 text-2xl text-white truncate">{name}</h2>
              <Badge variant="neutral" className="bg-darkOrange/20 text-darkOrange border-none">
                ${ticker}
              </Badge>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex items-center text-xs text-darkOrange/80">
                <span className="font-mono">
                  {truncateString(tokenAddress)}
                </span>
                <button onClick={handleCopy} className="ml-1 focus:outline-none">
                  <CopyIcon className={cn("h-3 w-3", copied ? "text-green-500" : "text-darkOrange/60")} />
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4 p-4">
          {/* Price and Stats */}
          {loading ? (
            <div className="text-sm text-darkOrange/60">Loading stats...</div>
          ) : poolDetails ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-darkOrange/60">Current Price</span>
                <span className="font-mono text-lg font-bold text-darkOrange">
                  ${Number(poolDetails.tokenPriceUSD).toLocaleString(undefined, {
                    maximumFractionDigits: 10,
                  })}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-darkOrange/10">
                <div
                  // className="h-full bg-gradient-to-r from-darkOrange/60 to-darkOrange transition-all"
                  className="h-full bg-greenColorMain transition-all"
                  style={{ width: `${progressValue}%` }}
                />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-none border border-darkOrange/20 bg-darkOrange/5 p-2">
                  <div className="text-xs text-darkOrange/60">Market Cap</div>
                  <div className="font-mono text-sm text-darkOrange">
                    ${Number(poolDetails.marketCapUSD).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}
                  </div>
                </div>
                <div className="rounded-none border border-darkOrange/20 bg-darkOrange/5 p-2">
                  <div className="text-xs text-darkOrange/60">Liquidity</div>
                  <div className="font-mono text-sm text-darkOrange">
                    ${Number(poolDetails.liquidityUSD).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-darkOrange/60">No stats available</div>
          )}
          {/* Description */}
          <p className="text-sm text-darkOrange/80">{description}</p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {website && (
              <Button
                size="icon"
                variant="neutral"
                className="h-10 w-10 rounded-none bg-darkOrange/10 p-0 text-darkOrange hover:bg-darkOrange hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoute(website);
                }}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            )}
            {twitter && (
              <Button
                size="icon"
                variant="neutral"
                className="h-10 w-10 rounded-none bg-darkOrange/10 p-0 text-darkOrange hover:bg-darkOrange hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoute(twitter);
                }}
              >
                <TwitterIcon className="h-4 w-4" />
              </Button>
            )}
             {youtube && (
              <Button
                size="icon"
                variant="neutral"
                className="h-10 w-10 rounded-none bg-darkOrange/10 p-0 text-darkOrange hover:bg-darkOrange hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoute(youtube);
                }}
              >
                <YoutubeIcon className="h-4 w-4" />
              </Button>
            )}
             {telegram && (
              <Button
                size="icon"
                variant="neutral"
                className="h-10 w-10 rounded-none bg-darkOrange/10 p-0 text-darkOrange hover:bg-darkOrange hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoute(telegram);
                }}
              >
                <FaTelegramPlane className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* View Details Button */}
          <Button 
            variant="connect" 
            className="w-full rounded-none border border-darkOrange bg-orange-gradient py-3 font-04b_19 text-sm text-white hover:opacity-90"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/token/${tokenAddress}`);
            }}
          >
            VIEW DETAILS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 4h8v8H4z" />
    </svg>
  );
}

export default DisplayCard;
