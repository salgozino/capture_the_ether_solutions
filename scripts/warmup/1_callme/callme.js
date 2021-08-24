const hre = require("hardhat");

async function main() {
    accounts = await ethers.getSigners();
    eoa = accounts[0];
    const factory =  await ethers.getContractFactory("CallMeChallenge")
    // contract address after pushing the deploy button in the challenge.
    contract = factory.attach(`0xc47F7A4F69B3f366B5eABc0E5646b76E47BFEce9`)

    console.log("Sending callme tx")
    const tx = await contract.callme();
    await tx.wait()
    console.log("callme tx minted")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
