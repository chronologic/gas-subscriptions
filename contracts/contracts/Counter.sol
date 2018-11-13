pragma solidity ^0.4.23;

contract Counter {
  uint256 counter;

  function increment() public returns (bool) {
    counter++;
  }

  function getCounter() public view returns(uint256) {
    return counter;
  }
}