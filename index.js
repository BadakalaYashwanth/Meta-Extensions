// const express = require("express");
// const ethers = require("ethers");
// const fetch = require("node-fetch");
// const app = express();
// const port = 3000;

// // Uniswap V2 Pool ABI
// const POOL_ABI = [
//   "function token0() external view returns (address)",
//   "function token1() external view returns (address)",
//   "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
// ];

// // ERC20 Token ABI
// const ERC20_ABI = [
//   "function totalSupply() external view returns (uint256)",
//   "function decimals() external view returns (uint8)",
// ];

// const RPC_URL = "https://mainnet.base.org";
// const provider = new ethers.JsonRpcProvider(RPC_URL);

// async function getEthPriceInUSD() {
//   const response = await fetch(
//     "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
//   );
//   const data = await response.json();
//   return data.ethereum.usd;
// }

// app.get("/pool-info/:poolAddress", async (req, res) => {
//   try {
//     const poolAddress = req.params.poolAddress;
//     const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);

//     const wethAddress = await poolContract.token0();
//     const cxzAddress = await poolContract.token1();

//     const wethContract = new ethers.Contract(wethAddress, ERC20_ABI, provider);
//     const cxzContract = new ethers.Contract(cxzAddress, ERC20_ABI, provider);

//     const [wethReserve, cxzReserve] = await poolContract.getReserves();

//     const wethDecimals = await wethContract.decimals();
//     const cxzDecimals = await cxzContract.decimals();

//     const cxzTotalSupply = await cxzContract.totalSupply();

//     const ethPriceInUSD = await getEthPriceInUSD();

//     // Calculate CXZ price in ETH
//     const cxzPriceInEth =
//       Number(ethers.formatUnits(wethReserve, wethDecimals)) /
//       Number(ethers.formatUnits(cxzReserve, cxzDecimals));

//     // Calculate CXZ price in USD
//     const cxzPriceInUSD = cxzPriceInEth * ethPriceInUSD;

//     // Calculate market cap in USD
//     const marketCapInUSD =
//       Number(ethers.formatUnits(cxzTotalSupply, cxzDecimals)) * cxzPriceInUSD;

//     // Calculate liquidity in USD
//     const liquidityInUSD =
//       Number(ethers.formatUnits(wethReserve, wethDecimals)) * ethPriceInUSD * 2;

//     res.json({
//       marketCapUSD: marketCapInUSD.toFixed(2),
//       liquidityUSD: liquidityInUSD.toFixed(2),
//       tokenPriceUSD: cxzPriceInUSD.toFixed(18),
//       wethReserve: ethers.formatUnits(wethReserve, wethDecimals),
//       cxzReserve: ethers.formatUnits(cxzReserve, cxzDecimals),
//       cxzTotalSupply: ethers.formatUnits(cxzTotalSupply, cxzDecimals),
//       ethPriceUSD: ethPriceInUSD,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`API listening at http://localhost:${port}`);
// });
