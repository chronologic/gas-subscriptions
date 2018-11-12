pragma solidity ^0.4.23;

import './ERC20.sol';

contract GasStation {
    struct Plan {
        uint gas;
        uint price;
        uint period;
    }
    
    struct Subscription {
        uint remaining;
        uint validUntil;
    }
    
    address token;
    address owner;
    Plan[] plans;
    mapping (address => Subscription) subscriptions;
    mapping(address => uint) public nonce;
    uint constant MIN_GAS = 21000;
    
    event Relayed(bytes sig, address signer, address destination, bytes data, uint remaining, bytes32 _hash);
    
    constructor(address _token) public {
        token = _token;
        owner = msg.sender;
        
        plans.push(Plan(
            100*10**6, //100M gas 
            2*10**18, //2DAI
            30 days)); //30days
    }
    
    
    function subscribe(address signer, uint8 plan) public returns (bool) {
        Plan memory p = plans[plan];
        
        require(p.gas > 0); //dumb check if plan exists
        require(ERC20Interface(token).transferFrom(msg.sender, this, p.price)); //move tokens from sender to relayer
        
        subscriptions[signer] = Subscription(p.gas, now + p.period);
        
        return true;
    }
    
    function plan(address signer) public view returns (uint, uint) {
        return (subscriptions[signer].remaining, subscriptions[signer].validUntil);
    }
    
    function relay(bytes sig, address signer, address destination, uint value, bytes data) public returns (bool) {
        require(msg.sender == owner);
        
        bytes32 _hash = getHash(signer, destination, value, data);
        
        nonce[signer]++;
        
        address _signer = verifySigner(_hash,sig);
        
        require(signer == _signer);
        require(subscriptions[signer].validUntil > now); //valid subscription
        require(subscriptions[signer].remaining > MIN_GAS); //whatever minimum gas
        
        //gas accounting
        uint startGas = gasleft();
        
        executeCall(destination, value, data);
        
        subscriptions[signer].remaining -= startGas - gasleft();
        
        emit Relayed(sig, signer, destination, data, subscriptions[signer].remaining, _hash);
    }
    
    // copied from https://github.com/uport-project/uport-identity/blob/develop/contracts/Proxy.sol
  // which was copied from GnosisSafe
  // https://github.com/gnosis/gnosis-safe-contracts/blob/master/contracts/GnosisSafe.sol
  function executeCall(address to, uint256 value, bytes data) internal returns (bool success) {
    assembly {
       success := call(gas, to, value, add(data, 0x20), mload(data), 0, 0)
    }
  }
    
    function getHash(address signer, address destination, uint value, bytes data) public view returns(bytes32){
        return keccak256(abi.encodePacked(address(this), signer, destination, value, data, nonce[signer]));
    }
    
    //borrowed from OpenZeppelin's ESDA stuff:
  //https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/cryptography/ECDSA.sol
    function verifySigner(bytes32 _hash, bytes _signature) internal pure returns (address){
        bytes32 r;
        bytes32 s;
        uint8 v;
        // Check the signature length
        if (_signature.length != 65) {
          return 0x0;
        }
        // Divide the signature in r, s and v variables
        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        // solium-disable-next-line security/no-inline-assembly
        assembly {
          r := mload(add(_signature, 32))
          s := mload(add(_signature, 64))
          v := byte(0, mload(add(_signature, 96)))
        }
        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
          v += 27;
        }
        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
          return 0x0;
        } else {
          // solium-disable-next-line arg-overflow
          return ecrecover(keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash)
          ), v, r, s);
        }
    }
}