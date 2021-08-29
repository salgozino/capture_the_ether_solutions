const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ejercicio 2", function () {

  let deployer;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    // Se conecta con el contrato
    const contract = await ethers.getContractFactory("GuessTheRandomNumberChallenge");
    this.loterry = await contract.attach("0x9b4e767811B65337c0903b3229201dbe7681A8D5");
  });

  it("Check", async function () {
    // Se completo la tarea
    expect(await this.loterry.isComplete()).to.be.true;
  });

});
