const axios = require("axios");

async function fetchPoolTVL(poolAddress) {
  const chain = "ethereum";
  const url = `https://prices.curve.fi/v1/pools/${chain}/${poolAddress}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data && data.tvl_usd) {
      console.log(
        `Total value locked in pool ${poolAddress}: ${data.tvl_usd} USD`
      );
      return data.tvl_usd;
    } else {
      console.error(
        `Error fetching TVL for pool ${poolAddress}: Data is incomplete`
      );
      return null;
    }
  } catch (error) {
    console.error(`Error fetching TVL for pool ${poolAddress}:`, error);
    return null;
  }
}

module.exports = fetchPoolTVL;
