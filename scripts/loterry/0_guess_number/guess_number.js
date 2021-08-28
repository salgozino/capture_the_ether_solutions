require("@nomiclabs/hardhat-ethers");
const hre = require("hardhat");

async function main() {
    accounts = await ethers.getSigners();
    eoa = accounts[0];
    const factory =  await ethers.getContractFactory("GuessTheNumberChallenge")
    // contract address after pushing the deploy button in the challenge.
    contract = factory.attach("0x34e292B26423A69aB082187094493859F45387FB")

    console.log("Sending number guessed 42, because it's hardcoded")
    const tx = await contract.guess(42, {value: ethers.utils.parseEther('1')});
    await tx.wait()
    console.log("number guess tx minted")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
