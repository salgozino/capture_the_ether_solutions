require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    accounts = await ethers.getSigners();
    eoa = accounts[0];
    const factory =  await ethers.getContractFactory("GuessTheSecretNumberChallenge")
    // contract address after pushing the deploy button in the challenge.
    contract = factory.attach("0x1704264eFa38E90048aB6C58b0A062287b97A1DA")

    console.log("Sending number guessed number from the hash")

    const secretnum = guessnum()
    console.log("Sending guess with number", secretnum)
    // if gasPrice is not set gives: ProviderError: transaction underpriced
    const tx = await contract.guess(
      secretnum,
      {value: ethers.utils.parseEther('1'),
       gasPrice: ethers.utils.parseUnits('15','gwei'),
      });
    await tx.wait()
    console.log("number guess sent with tx minted")

}

function guessnum() {
    const secrethash = "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365"
    // the num is an uint8 so, it's between 0 and 2^8-1=255
    // it will be quicker with a binary search?
    // loop number by number unitl the keccak256 hash it's equal to the 
    // secret hash hardcoded in the constract.
    const arr = Array.from(Array(255).keys())

    for (let i = 0; i < arr.length; i++) {
      if (ethers.utils.keccak256(i) == secrethash ){
        return i
      }
    }
    console.log("Number not found")
    return -1
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
