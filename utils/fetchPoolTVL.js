const axios = require("axios");

async function fetchPoolTVL(blockchainId) {
  const poolsUrl = `https://api.curve.fi/v1/getPools/big/${blockchainId}`;

  try {
    const poolsResponse = await axios.get(poolsUrl);
    const poolsData = poolsResponse.data.data.poolData;

    return poolsData.map((pool) => ({
      address: pool.address,
      name: pool.name,
      tvl: pool.usdTotal,
    }));
  } catch (error) {
    console.error(
      `Error fetching pool data for blockchain ${blockchainId}:`,
      error
    );
    return [];
  }
}

module.exports = fetchPoolTVL;
