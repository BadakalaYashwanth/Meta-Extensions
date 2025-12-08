/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type ContractTransactionResponse,
  type Eip1193Provider,
  ethers,
} from "ethers";
import {
  UNISWAP_ROUTER_ABI,
  WETH,
  routerAddress,
  launchItRouter,
} from "~/constant/contractDetails";

export async function buyUniswapToken(
  userAddress: string,
  tokenAddress: string,
  walletProvider: Eip1193Provider,
  value: string,
  isUniswapRouter: boolean,
) {
  const signer = await new ethers.BrowserProvider(walletProvider).getSigner();
  const _routerAddress = isUniswapRouter ? routerAddress : launchItRouter;
  const router = new ethers.Contract(
    _routerAddress,
    UNISWAP_ROUTER_ABI,
    signer,
  );
  if (!router.swapExactETHForTokens) return;
  try {
    const amounts: ContractTransactionResponse =
      await router.swapExactETHForTokens(
        1,
        [WETH, tokenAddress],
        userAddress,
        Math.floor(Date.now() / 1000) + 60 * 20,
        { value: ethers.parseEther(value) },
      );
    console.log(amounts);
    await amounts.wait();

    return amounts.hash;
  } catch (e) {
    console.log(e);
    return "";
  }
}

export async function sellUniswapToken(
  userAddress: string,
  tokenAddress: string,
  walletProvider: Eip1193Provider,
  value: string,
  isUniswapRouter: boolean,
) {
  const signer = await new ethers.BrowserProvider(walletProvider).getSigner();
  const _routerAddress = isUniswapRouter ? routerAddress : launchItRouter;
  const router = new ethers.Contract(
    _routerAddress,
    UNISWAP_ROUTER_ABI,
    signer,
  );
  if (!router.swapExactTokensForETH) return;
  try {
    const amounts: ContractTransactionResponse =
      await router.swapExactTokensForETH(
        ethers.parseEther(value),
        1,
        [tokenAddress, WETH],
        userAddress,
        Math.floor(Date.now() / 1000) + 60 * 20,
      );
    console.log(amounts);
    await amounts.wait();

    return amounts.hash;
  } catch (e) {
    console.log(e);
    return "";
  }
}
