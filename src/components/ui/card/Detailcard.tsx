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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Badge } from "../badge";
import { Button } from "../button";
import truncateString from "~/utils/trunctateString";
import { type PoolInfo, getPoolInfo } from "~/lib/poolInfo";

export interface DetailCardProps {
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
  tokenAddress: string;
  pairAddress: string;
}

const DetailCard: FC<DetailCardProps> = ({
  name,
  description,
  ticker,
  website,
  twitter,
  youtube,
  image,
  userAddress,
  pairAddress,
}) => {
  const router = useRouter();
  const [poolDetails, setPoolDetails] = useState<PoolInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoolInfo = useCallback(
    async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);
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
          setError(
            `Failed to fetch pool information: ${(err as Error).message}`,
          );
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

  const progressValue = useMemo(() => {
    if (!poolDetails) return 0;
    const maxMarketCap = 1000000; // Adjust this value based on your needs
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
          <Progress value={progressValue} />
          <div className="flex justify-between">
            <span>
              $
              {Number(poolDetails.tokenPriceUSD).toLocaleString(undefined, {
                maximumFractionDigits: 10,
              })}
            </span>
            <span>
              Market Cap: $
              {Number(poolDetails.marketCapUSD).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </>
      );
    }
    return <div>No pool information available</div>;
  }, [loading, poolDetails, progressValue]);

  const socialButtons = useMemo(
    () => (
      <div className="mt-4 flex w-full flex-row justify-between gap-3">
        {website && (
          <Button className="" onClick={() => handleRoute(website)}>
            <LinkIcon />
          </Button>
        )}
        {twitter && (
          <Button className="" onClick={() => handleRoute(twitter)}>
            <TwitterIcon />
          </Button>
        )}
        {youtube && (
          <Button className="" onClick={() => handleRoute(youtube)}>
            <YoutubeIcon />
          </Button>
        )}
      </div>
    ),
    [website, twitter, youtube, handleRoute],
  );

  return (
    <Card className="">
      <CardHeader className="flex items-center justify-center">
        <img
          className="rounded-md border"
          src={image}
          alt="logo"
          width={200}
          height={200}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-2">
        <div className="flex flex-col gap-2">{poolInfo}</div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xl font-bold">{name}</span>
            <span className="text-base">
              <Badge>${ticker}</Badge>
            </span>
          </div>
          <span>created by: {truncateString(userAddress)} </span>
          <span>{description}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">{socialButtons}</CardFooter>
    </Card>
  );
};

export default DetailCard;
