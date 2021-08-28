const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ejercicio 0", function () {

  let deployer;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    // Se conecta con el contrato
    const contract = await ethers.getContractFactory("GuessTheNumberChallenge");
    this.loterry = await contract.attach("0x34e292B26423A69aB082187094493859F45387FB");
  });

  it("Check", async function () {
    // Se completo la tarea
    expect(await this.loterry.isComplete()).to.be.true;
  });

});
