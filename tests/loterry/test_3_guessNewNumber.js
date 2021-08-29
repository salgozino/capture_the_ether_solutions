const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ejercicio 2", function () {

  let deployer;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    // Se conecta con el contrato
    const Victima = await ethers.getContractFactory("GuessTheNewNumberChallenge");
    this.victima = await Victima.deploy({value: ethers.utils.parseEther('1')});
    console.log("Victima SC deployed")
  });

  it("Ataque", async function () {
    // Se completo la tarea
    const Atacante = await ethers.getContractFactory("GuessNewNumberAttacker");
    atacante = await Atacante.deploy({value: ethers.utils.parseEther('1')});
    console.log("atacante SC deployed")
    
    await atacante.attack(
        this.victima.address, {
            value: ethers.utils.parseEther('1')
        }
    );

    expect(await this.victima.isComplete()).to.be.true;
  });

});
