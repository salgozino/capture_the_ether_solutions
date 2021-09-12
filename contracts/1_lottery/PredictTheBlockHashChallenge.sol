pragma solidity ^0.4.21;

contract PredictTheBlockHashChallenge {
    address guesser;
    bytes32 guess;
    uint256 settlementBlockNumber;
    address _owner;

    function PredictTheBlockHashChallenge() public payable {
        require(msg.value == 1 ether);
        _owner = msg.sender;
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(bytes32 hash) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = hash;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        bytes32 answer = block.blockhash(settlementBlockNumber);

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }

    function withdraw() public {
        // added to test in ropsten.
        _owner.transfer(address(this).balance);
    }
}