import { TransactionResponse, ethers } from "ethers";
import { UNISWAP_FACTORY_ABI, WETH, pairABI } from "~/constant/contractDetails";

interface req {
  tokenAddress: string;
  pairAddress: string;
  id: number;
}

export async function POST(req: Request) {
  const request = (await req.json()) as req;
  const { tokenAddress, pairAddress, id } = request;

  // console.log("tokenAddress", tokenAddress);
  // console.log("pairAddress", pairAddress);

  // console.log("req", req);
  // console.log("request", request);

  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org/");

  const wallet = new ethers.Wallet(
    process.env.SECURE_PRIVATE_KEY ?? "",
    provider,
  );

  const contract = new ethers.Contract(pairAddress, pairABI, wallet);

  const poolContract = new ethers.Contract(
    "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
    UNISWAP_FACTORY_ABI,
    wallet,
  );

  if (!contract.checkAndPromotePool) {
    return new Response("Method not found");
  }

  // Create and send the transaction
  const tx = (await contract.checkAndPromotePool({})) as TransactionResponse;

  console.log("tx", tx);

  // Wait for the transaction to be mined
  const receipt = await tx.wait();

  // console.log("receipt>>>>>>>", receipt);

  if (!poolContract.getPair) {
    return new Response("Transaction failed");
  }

  const pair = (await poolContract.getPair(WETH, tokenAddress)) as string;

  if (pair == "0x0000000000000000000000000000000000000000") {
    return new Response("Pair not found");
  }

  // console.log("pair", pair);

  return new Response(JSON.stringify(pair));
}
