require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    accounts = await ethers.getSigners();
    eoa = accounts[0];
    const factory =  await ethers.getContractFactory("GuessTheRandomNumberChallenge")
    // contract address after pushing the deploy button in the challenge.
    contract = factory.attach("0x9b4e767811B65337c0903b3229201dbe7681A8D5")
    // the number is stored as a public variable in the contract, so we can read it.
    const randomnum = ethers.BigNumber.from(
        await contract.provider.getStorageAt(contract.address, 0)
      ).toNumber()
   
    console.log("Sending guess with number", randomnum)

    // method 2
    // uint8(keccak256(block.blockhash(block.number - 1), now));
    // not working, ouch
    const blocknumber = 10923850
    const blockTimestamp = (await ethers.provider.getBlock(blocknumber)).timestamp
    const prevBlockHash = (await ethers.provider.getBlock(blocknumber-1)).hash
    const randomnumhash = ethers.utils.keccak256(prevBlockHash, blockTimestamp)
    const number = ethers.BigNumber.from(randomnumhash.slice(-2)).toNumber()
    console.log("Number from hashing", number)
    return

    
    const tx = await contract.guess(
      randomnum,
      {value: ethers.utils.parseEther('1'),
       gasPrice: ethers.utils.parseUnits('15','gwei'),
      });
    await tx.wait()
    console.log("number guess sent with tx minted")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
