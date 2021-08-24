require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");

const { infura_key, mnemonic, etherscanApiKey } = require('./secrets.json');

task("accounts", "Imprime la lista de cuentas disponibles", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: {
    compilers: [
      { version: "0.4.21" },
      { version: "0.6.12" },
      { version: "0.7.6" },
      { version: "0.8.7" },
    ]
  },
  networks: {
    kovan: {
      url: "https://kovan.infura.io/v3/"+infura_key,
      accounts: { mnemonic },
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/"+infura_key,
      accounts: { mnemonic },
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/"+infura_key,
      accounts: { mnemonic },
    },
  },
  etherscan: {
    apiKey: etherscanApiKey
  },
};