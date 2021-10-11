require("@nomiclabs/hardhat-ethers");
const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
    const accounts = await hre.ethers.getSigners();
    eoa = accounts[0];

    const factory =  await hre.ethers.getContractFactory("TokenSaleChallenge")
    // contract address after pushing the deploy button in the challenge.
    contract = await factory.deploy(eoa.address, {value: hre.ethers.utils.parseEther('1')});

    await contract.isDeployed;
    

    console.log("Contract TokenSaleChallenge deployed with address: ", contract.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
