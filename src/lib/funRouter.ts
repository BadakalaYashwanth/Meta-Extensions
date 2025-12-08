/* eslint-disable */

import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x87cD4daa433527E3c4Cdb14d94bd3513cb768fa3"; // Replace with your actual contract address

const CONTRACT_ABI = [
  "function swapETHForToken(address pairAddress, address tokenAddress) external payable",
  "function swapTokenForETH(address pairAddress, address tokenAddress, uint256 tokenAmount) external"
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

export async function buyToken(
  userAddress: string,
  tokenAddress: string,
  walletProvider: ethers.Eip1193Provider,
  value: string,
  isUniswapRouter: boolean,
  pairAddress: string,
): Promise<string> {
  try {
    const provider = new ethers.BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Ensure the contract has the swapETHForToken function
    if (typeof contract.swapETHForToken !== 'function') {
        throw new Error('swapETHForToken method not found on contract');
    }
    // Perform the swap using the smart contract
    const tx = await contract.swapETHForToken(pairAddress, tokenAddress, {
      value: ethers.parseEther(value)
    });
    const receipt = await tx.wait();

    console.log("Purchase complete!", receipt);
    return receipt?.hash || "";
  } catch (e) {
    console.error(e);
    return "";
  }
}

export async function sellToken(
  userAddress: string,
  tokenAddress: string,
  walletProvider: ethers.Eip1193Provider,
  value: string,
  isUniswapRouter: boolean,
  pairAddress: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const provider = new ethers.BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

    const tokenAmount = ethers.parseUnits(value, 18); // Assume 18 decimals, adjust if different

    onProgress?.(30);

    let currentAllowance;
    try {
      if (typeof tokenContract.allowance === 'function') {
        currentAllowance = await tokenContract.allowance(userAddress, CONTRACT_ADDRESS);
      } else {
        throw new Error('allowance method not found');
      }
    } catch (error) {
      console.warn("Allowance check failed, proceeding with approval anyway:", error);
      currentAllowance = ethers.parseUnits("0", 18);
    }

    if (currentAllowance < tokenAmount) {
      console.log("Approving tokens...");
      try {
        let approveTx;
        if (typeof tokenContract.approve === 'function') {
          approveTx = await tokenContract.approve(CONTRACT_ADDRESS, tokenAmount);
        } else {
          throw new Error('approve method not found');
        }
        await approveTx.wait();
        console.log("Approval successful!");
      } catch (approvalError) {
        console.error("Approval failed:", approvalError);
        throw new Error("Failed to approve token transfer. Please try again.");
      }
    } else {
      console.log("Sufficient allowance already exists.");
    }

    onProgress?.(60);

    // Ensure the contract has the swapTokenForETH function
    if (typeof contract.swapTokenForETH !== 'function') {
        throw new Error('swapTokenForETH method not found on contract');
    }
    const tx = await contract.swapTokenForETH(pairAddress, tokenAddress, tokenAmount);
    const receipt = await tx.wait();

    onProgress?.(90);

    console.log("Sale complete!", receipt);
    return receipt?.hash || "";
  } catch (e) {
    console.error("Error in sellToken:", e);
    throw e;
  }
}