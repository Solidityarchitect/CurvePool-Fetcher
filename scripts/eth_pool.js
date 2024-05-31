const { ethers } = require("ethers");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
require("dotenv").config();
const fetchPoolTVL = require("../utils/fetchPoolTVL");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL);

  const poolABI = require("../json/pool.json");

  // Fetch pool data
  const poolsData = await fetchPoolTVL("ethereum");
  const poolAddressToData = Object.fromEntries(
    poolsData.map((pool) => [pool.address.toLowerCase(), pool])
  );

  const records = [];
  for (const pool of poolsData) {
    const poolAddress = pool.address.toLowerCase();
    const poolContract = new ethers.Contract(poolAddress, poolABI, provider);

    try {
      const initialA = await poolContract.initial_A().catch((e) => {
        return null;
      });
      const futureA = await poolContract.future_A().catch((e) => {
        return null;
      });
      const A = await poolContract.A().catch((e) => {
        return null;
      });

      if (initialA === null || futureA === null || A === null) {
        continue;
      }

      const poolData = poolAddressToData[poolAddress];

      if (poolData) {
        records.push({
          name: poolData.name,
          tvl: poolData.tvl,
          a_value: A.toString(),
          initial_a: initialA.toString(),
          future_a: futureA.toString(),
        });
        console.log(
          `Pool: ${poolData.name}, TVL: ${poolData.tvl}, A: ${A}, initial A: ${initialA}, future A: ${futureA}`
        );
      } else {
        console.error(`Pool data for address ${poolAddress} not found`);
      }
    } catch (error) {
      console.error(`Error fetching data for pool ${poolAddress}:`, error);
    }
  }

  records.sort((a, b) => b.tvl - a.tvl);

  const csvWriter = createCsvWriter({
    path: "curve_pools.csv",
    header: [
      { id: "name", title: "Pool Name" },
      { id: "tvl", title: "TVL (USD)" },
      { id: "a_value", title: "A Value" },
      { id: "initial_a", title: "Initial A" },
      { id: "future_a", title: "Future A" },
    ],
  });

  await csvWriter.writeRecords(records);
  console.log("CSV file written successfully");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
