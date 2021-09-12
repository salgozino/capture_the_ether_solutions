const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ejercicio 5 - Predict the BlockHash", function () {

  let deployer;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    // Se deploya el contrato victima
    const Victima = await ethers.getContractFactory("PredictTheBlockHashChallenge");
    this.victimaSC = await Victima.deploy({value: ethers.utils.parseEther('1')});
    
    console.log("Victima SC deployed")
  });

  it("Ataque", async function () {
    // Se completo la tarea
    const Atacante = await ethers.getContractFactory("PredictTheBlockHashAttacker");
    const atacanteSC = await Atacante.deploy(this.victimaSC.address);

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
                          " < 256. Desired block its: ", desiredBlock,
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
    expect(await this.victimaSC.isComplete()).to.be.true;
  });

});
