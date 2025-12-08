// utils/poolInfo.ts

import { BigNumberish, ethers, formatUnits } from "ethers";
import {
  ETH_CHAINLINK_ABI,
  ETH_CHAINLINK_ADDRESS,
  WETH,
} from "~/constant/contractDetails";

// Uniswap V2 Pool ABI
const POOL_ABI = [
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];

// ERC20 Token ABI
const ERC20_ABI = [
  "function totalSupply() external view returns (uint256)",
  "function decimals() external view returns (uint8)",
];

const RPC_URL = "https://mainnet.base.org";

export interface PoolInfo {
  marketCapUSD: string;
  liquidityUSD: string;
  tokenPriceUSD: string;
  token0Reserve?: string;
  token1Reserve?: string;
  tokenTotalSupply?: string;
  ethPriceUSD?: number;
}

// async function getEthPriceInUSD(): Promise<number> {
//   try {
//     const response = await fetch(
//       "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
//     );
//     const data = (await response.json()) as { ethereum: { usd: number } };
//     return data.ethereum.usd;
//   } catch (error) {
//     console.error("Failed to fetch ETH price:", error);
//     throw new Error("Failed to fetch ETH price");
//   }
// }

async function getLatestRoundData(): Promise<string | undefined> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const contract = new ethers.Contract(
    ETH_CHAINLINK_ADDRESS,
    ETH_CHAINLINK_ABI,
    provider,
  );

  try {
    if (typeof contract.latestAnswer !== "function") {
      console.log("function not found");
      return;
    }

    // Type assertion for the contract call
    const answer = (await contract.latestAnswer()) as bigint;

    // Log the raw answer and formatted value
    console.info("answer", answer.toString(), formatUnits(answer, 8));

    return formatUnits(answer, 8);
  } catch (error) {
    console.error("Error fetching latest round data:", error);
    return undefined;
  }
}

export async function getPoolInfo(
  poolAddress: string,
): Promise<PoolInfo | undefined> {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);

    if (
      !poolContract.token0 ||
      !poolContract.token1 ||
      !poolContract.getReserves
    ) {
      return;
    }

    const token0 = (await poolContract.token0()) as string;
    const token1 = (await poolContract.token1()) as string;

    const token0Contract = new ethers.Contract(token0, ERC20_ABI, provider);
    const token1Contract = new ethers.Contract(token1, ERC20_ABI, provider);

    if (
      !token0Contract.decimals ||
      !token1Contract.decimals ||
      !token1Contract.totalSupply
    ) {
      return;
    }

    const reserves = (await poolContract.getReserves()) as [number, number];
    const [token0Reserve, token1Reserve] = reserves;

    let [tokenReserve, wethReserve] =
      token1.toLowerCase() === WETH.toLowerCase()
        ? [token0Reserve, token1Reserve]
        : [token1Reserve, token0Reserve];
    tokenReserve = Number(tokenReserve);
    wethReserve = Number(wethReserve);

    // const token0Decimals = await token0Contract.decimals();
    // const token1Decimals = await token1Contract.decimals();
    // const tokenTotalSupply = await token1Contract.totalSupply();

    const tokenTotalSupply = 1000000000;

    const ethPriceInUSD = await getLatestRoundData();

    if (!ethPriceInUSD) {
      console.log("ethPriceInUSD", ethPriceInUSD);
      return;
    }

    console.log({
      token0Reserve,
      token1Reserve,
      tokenTotalSupply,
      ethPriceInUSD,
    });

    // // Calculate CXZ price in ETH
    // const cxzPriceInEth =
    //   Number(ethers.formatUnits(token0Reserve, token0Decimals)) /
    //   Number(ethers.formatUnits(token1Reserve, token1Decimals));

    // // Calculate CXZ price in USD
    // const cxzPriceInUSD = cxzPriceInEth * ethPriceInUSD;

    // // Calculate market cap in USD
    // const marketCapInUSD =
    //   Number(ethers.formatUnits(tokenTotalSupply, token1Decimals)) *
    //   cxzPriceInUSD;

    // // Calculate liquidity in USD
    // const liquidityInUSD =
    //   Number(ethers.formatUnits(token0Reserve, token0Decimals)) *
    //   ethPriceInUSD *
    //   2;

    const liquidity =
      Number(ethers.formatEther(wethReserve * 2)) * Number(ethPriceInUSD);
    const tokenPrice = (wethReserve * Number(ethPriceInUSD)) / tokenReserve;
    const marketCapInUSD = tokenPrice * tokenTotalSupply;

    const data = {
      marketCapUSD: marketCapInUSD.toString(),
      liquidityUSD: liquidity.toString(),
      tokenPriceUSD: tokenPrice.toString(),
    };

    console.log("data >>>>>>>>", data);

    return data;
  } catch (error) {
    console.log("Failed to fetch pool info: >>>>>>>>>>>>>>>>>>", error);
    throw new Error("Failed to fetch pool information");
  }
}
