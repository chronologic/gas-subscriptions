import { ContractAbi } from 'web3x-es/contract';
export default [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "nonce",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_token",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "sig",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "signer",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "destination",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "data",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "remaining",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_hash",
        "type": "bytes32"
      }
    ],
    "name": "Relayed",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "signer",
        "type": "address"
      },
      {
        "name": "plan",
        "type": "uint8"
      }
    ],
    "name": "subscribe",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "signer",
        "type": "address"
      }
    ],
    "name": "plan",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "sig",
        "type": "bytes"
      },
      {
        "name": "signer",
        "type": "address"
      },
      {
        "name": "destination",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      },
      {
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "relay",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "signer",
        "type": "address"
      },
      {
        "name": "destination",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      },
      {
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "getHash",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
] as ContractAbi;