require("@nomiclabs/hardhat-ethers");
const hre = require("hardhat");

async function main() {
    accounts = await ethers.getSigners();
    eoa = accounts[0];
    const factory =  await ethers.getContractFactory("CaptureTheEther")
    // contract address after pushing the deploy button in the challenge.
    contract = factory.attach(`0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee`)

    console.log("Sending setNickname with my nickname")
    const tx = await contract.setNickname(ethers.utils.formatBytes32String("koki"));
    await tx.wait()
    console.log("setNickname tx minted")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
