const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ejercicio 1", function () {

  let deployer;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    // Se conecta con el contrato
    const contract = await ethers.getContractFactory("GuessTheSecretNumberChallenge");
    this.loterry = await contract.attach("0x1704264eFa38E90048aB6C58b0A062287b97A1DA");
  });

  it("Check", async function () {
    // Se completo la tarea
    expect(await this.loterry.isComplete()).to.be.true;
  });

});
