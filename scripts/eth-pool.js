const { ethers } = require("ethers");
require("dotenv").config();
const fetchPoolTVL = require("./fetchPoolTVL");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL);

  const registryAddress = "0xF98B45FA17DE75FB1aD0e7aFD971b0ca00e379fC";
  const registryABI = require("../json/registry.json");
  const poolABI = require("../json/pool.json");

  const registryContract = new ethers.Contract(
    registryAddress,
    registryABI,
    provider
  );

  const poolCount = await registryContract.pool_count();
  console.log(`Curve on Ethereum Total pools: ${poolCount}`);

  const poolAddress = await registryContract.pool_list(0);
  console.log(`Pool address: ${poolAddress}`);

  const poolContract = new ethers.Contract(poolAddress, poolABI, provider);
  const A = await poolContract.A();
  console.log(`A value: ${A}`);

  const poolTVL = await fetchPoolTVL(poolAddress);
  console.log(`Pool TVL: ${poolTVL}`);

  // Uncomment the code below to create and write to a CSV file
  // const csvWriter = createCsvWriter({
  //   path: "curve_pools.csv",
  //   header: [
  //     { id: "index", title: "Index" },
  //     { id: "address", title: "Pool Address" },
  //     { id: "a_value", title: "A" },
  //   ],
  // });

  // const records = [];
  // for (let i = 0; i < poolCount; i++) {
  //   const poolAddress = await registryContract.pool_list(i);
  //   const poolContract = new ethers.Contract(poolAddress, poolABI, provider);
  //   try {
  //     const aValue = await poolContract.A();
  //     records.push({
  //       index: i,
  //       address: poolAddress,
  //       a_value: aValue.toString(),
  //     });
  //     console.log(`Pool ${i + 1}: ${poolAddress}, A: ${aValue}`);
  //   } catch (error) {
  //     console.error(`Error fetching A value for pool ${poolAddress}:`, error);
  //     records.push({
  //       index: i,
  //       address: poolAddress,
  //       a_value: "Error",
  //     });
  //   }
  // }

  // await csvWriter.writeRecords(records);
  // console.log("CSV file written successfully");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
