/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  CyberDestinationUtilityFactoryFacet,
  CyberDestinationUtilityFactoryFacetInterface,
} from "../CyberDestinationUtilityFactoryFacet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Minted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uri",
        type: "string",
      },
      {
        internalType: "address",
        name: "_manager",
        type: "address",
      },
      {
        internalType: "address",
        name: "_trustedForwarder",
        type: "address",
      },
      {
        internalType: "address",
        name: "_opensea",
        type: "address",
      },
      {
        internalType: "address",
        name: "_oncyber",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "manager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uri",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount_oncyber",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_minter",
        type: "address",
      },
    ],
    name: "minterNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oncyber",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50612306806100206000396000f3fe608060405234801561001057600080fd5b50600436106100f45760003560e01c8063481c6a7511610097578063a22cb46511610066578063a22cb4651461024b578063bc01188e1461025e578063e985e9c51461028e578063f242432a146102a157600080fd5b8063481c6a75146101a55780634e1273f4146101d7578063572b6c05146101f75780637a15c41c1461023857600080fd5b80630e89341c116100d35780630e89341c1461015757806318160ddd146101775780631b0239471461017f5780632eb2c2d61461019257600080fd5b8062fdd58e146100f957806301ffc9a71461011f5780630b885ac314610142575b600080fd5b61010c610107366004611ae9565b6102b4565b6040519081526020015b60405180910390f35b61013261012d366004611be4565b61035a565b6040519015158152602001610116565b610155610150366004611c1e565b61039d565b005b61016a610165366004611d15565b610526565b6040516101169190611f71565b61010c61067f565b61010c61018d366004611949565b6106a0565b6101556101a036600461199e565b6106dd565b600080516020612291833981519152546001600160a01b03165b6040516001600160a01b039091168152602001610116565b6101ea6101e5366004611b13565b61072a565b6040516101169190611f39565b610132610205366004611949565b7fa5e014e253d3b66bd348c3cdd05f38b9805fff0b6471d004b58c6ada26cae993546001600160a01b0390811691161490565b61010c610246366004611c9e565b61092a565b610155610259366004611aad565b610bfa565b7f47dc25f21c7793543edaeb1ef19d41726ddbada967ae9a7980b9bd8a45228a62546001600160a01b03166101bf565b61013261029c36600461196b565b610cf0565b6101556102af366004611a48565b610d3d565b60006001600160a01b0383166103255760405162461bcd60e51b815260206004820152602b60248201527f455243313135353a2062616c616e636520717565727920666f7220746865207a60448201526a65726f206164647265737360a81b60648201526084015b60405180910390fd5b6000805160206122b18339815191526000928352602090815260408084206001600160a01b0395909516845293905250205490565b6001600160e01b0319811660009081527f326d0c59a7612f6a9919e2a8ee333c80ba689d8ba2634de89c85cbb04832e705602052604081205460ff165b92915050565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c1320546001600160a01b031633146103fb5760405162461bcd60e51b81526020600482015260026024820152614e4f60f01b604482015260640161031c565b7fa5e014e253d3b66bd348c3cdd05f38b9805fff0b6471d004b58c6ada26cae99380546001600160a01b0319166001600160a01b038516179055636cdb3d1360e11b6000527fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131f6020527f845f7f8d885943dffdc1524acbd9538b2923f93aad26d306df3b8982c7f0632d805460ff1916600117905561049985610d83565b60008051602061229183398151915280546001600160a01b039586166001600160a01b0319918216179091557f47dc25f21c7793543edaeb1ef19d41726ddbada967ae9a7980b9bd8a45228a5f8054938616938216939093179092557f47dc25f21c7793543edaeb1ef19d41726ddbada967ae9a7980b9bd8a45228a628054919094169116179091555050565b60008181527fb3408a5d8f30170919d3996b6cc182726500ad24733d17ace2f621485f6e7c8360205260408120805460609291906105639061210d565b80601f016020809104026020016040519081016040528092919081815260200182805461058f9061210d565b80156105dc5780601f106105b1576101008083540402835291602001916105dc565b820191906000526020600020905b8154815290600101906020018083116105bf57829003601f168201915b505050505090508051600014156106355760405162461bcd60e51b815260206004820152601d60248201527f455243313135355552493a20746f6b656e4964206e6f74206578697374000000604482015260640161031c565b604051610668907fb3408a5d8f30170919d3996b6cc182726500ad24733d17ace2f621485f6e7c84908390602001611df8565b604051602081830303815290604052915050919050565b600061069b6000805160206122918339815191525b6002015490565b905090565b6001600160a01b03811660009081527f47dc25f21c7793543edaeb1ef19d41726ddbada967ae9a7980b9bd8a45228a616020526040812054610397565b6001600160a01b0385163314806106f957506106f98533610cf0565b6107155760405162461bcd60e51b815260040161031c90612017565b610723338686868686610db9565b5050505050565b6060815183511461078f5760405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b606482015260840161031c565b82516000805160206122b18339815191529060009067ffffffffffffffff8111156107bc576107bc6121bc565b6040519080825280602002602001820160405280156107e5578160200160208202803683370190505b50905060005b85518110156109215760006001600160a01b0316868281518110610811576108116121a6565b60200260200101516001600160a01b0316141561088a5760405162461bcd60e51b815260206004820152603160248201527f455243313135353a2062617463682062616c616e636520717565727920666f7260448201527020746865207a65726f206164647265737360781b606482015260840161031c565b82600086838151811061089f5761089f6121a6565b6020026020010151815260200190815260200160002060008783815181106108c9576108c96121a6565b60200260200101516001600160a01b03166001600160a01b0316815260200190815260200160002054828281518110610904576109046121a6565b60209081029190910101528061091981612175565b9150506107eb565b50949350505050565b600080610935610ddd565b90506000610942826106a0565b90506000878787848660405160200161095f959493929190611db1565b604051602081830303815290604052905060006109da866109d484805190602001206040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000006020820152603c8101829052600090605c01604051602081830303815290604052805190602001209050919050565b90610e33565b9050600080516020612291833981519152546001600160a01b03828116911614610a2b5760405162461bcd60e51b81526020600482015260026024820152614e4d60f01b604482015260640161031c565b86881015610a615760405162461bcd60e51b815260206004820152600360248201526249414f60e81b604482015260640161031c565b610a78600080516020612291833981519152610694565b9450610a84858a610ee9565b7f47dc25f21c7793543edaeb1ef19d41726ddbada967ae9a7980b9bd8a45228a60805460010190556001600160a01b03841660009081527f47dc25f21c7793543edaeb1ef19d41726ddbada967ae9a7980b9bd8a45228a616020526040902080546001019055610b0584868a60405180602001604052806000815250610f2c565b8615610b57577f47dc25f21c7793543edaeb1ef19d41726ddbada967ae9a7980b9bd8a45228a6254604080516020810190915260008152610b5791869182916001600160a01b03169089908c90610f4d565b8785856001600160a01b03167f25b428dfde728ccfaddad7e29e4ac23c24ed7fd1a6e3e3f91894a9a073f5dfff60405160405180910390a4610bb484600080516020612291833981519152600101546001600160a01b0316610cf0565b610bee577f47dc25f21c7793543edaeb1ef19d41726ddbada967ae9a7980b9bd8a45228a5f54610bee906001600160a01b03166001610bfa565b50505050949350505050565b336001600160a01b0383161415610c655760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b606482015260840161031c565b3360008181527f1799cf914cb0cb442ca7c7ac709ee40d0cb89e87351dc08d517fbda27d50c68c602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6001600160a01b0391821660009081527f1799cf914cb0cb442ca7c7ac709ee40d0cb89e87351dc08d517fbda27d50c68c6020908152604080832093909416825291909152205460ff1690565b6001600160a01b038516331480610d595750610d598533610cf0565b610d755760405162461bcd60e51b815260040161031c90612017565b610723338686868686610f4d565b8051610db5907fb3408a5d8f30170919d3996b6cc182726500ad24733d17ace2f621485f6e7c849060208401906117a9565b5050565b610dc7868686868686610f69565b610dd58686868686866110dd565b505050505050565b600060183610801590610e1957507fa5e014e253d3b66bd348c3cdd05f38b9805fff0b6471d004b58c6ada26cae993546001600160a01b031633145b15610e2b575060131936013560601c90565b503390565b90565b600080600080845160411415610e5d5750505060208201516040830151606084015160001a610ed3565b845160401415610e8b5750505060408201516020830151906001600160ff1b0381169060ff1c601b01610ed3565b60405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161031c565b610edf868285856112bd565b9695505050505050565b60008281527fb3408a5d8f30170919d3996b6cc182726500ad24733d17ace2f621485f6e7c83602090815260409091208251610f27928401906117a9565b505050565b610f3b33600086868686611466565b610f4784848484611530565b50505050565b610f5b868686868686611466565b610dd586868686868661163f565b6001600160a01b0384163b15610dd55760405163bc197c8160e01b81526001600160a01b0385169063bc197c8190610fad9089908990889088908890600401611e96565b602060405180830381600087803b158015610fc757600080fd5b505af1925050508015610ff7575060408051601f3d908101601f19168201909252610ff491810190611c01565b60015b6110a4576110036121d2565b806308c379a0141561103d57506110186121ed565b80611023575061103f565b8060405162461bcd60e51b815260040161031c9190611f71565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e20455243313135356044820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b606482015260840161031c565b6001600160e01b0319811663bc197c8160e01b146110d45760405162461bcd60e51b815260040161031c90611f84565b50505050505050565b6001600160a01b0384166111035760405162461bcd60e51b815260040161031c90612060565b81518351146111655760405162461bcd60e51b815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b606482015260840161031c565b6000805160206122b183398151915260005b845181101561125c576000858281518110611194576111946121a6565b6020026020010151905060008583815181106111b2576111b26121a6565b602090810291909101810151600084815286835260408082206001600160a01b038e1683529093529190912054909150818110156112025760405162461bcd60e51b815260040161031c90611fcc565b6000838152602086815260408083206001600160a01b038e8116855292528083208585039055908b1682528120805484929061123f9084906120c9565b92505081905550505050808061125490612175565b915050611177565b50846001600160a01b0316866001600160a01b0316886001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516112ac929190611f4c565b60405180910390a450505050505050565b60007f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a082111561133a5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b606482015260840161031c565b8360ff16601b148061134f57508360ff16601c145b6113a65760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b606482015260840161031c565b6040805160008082526020820180845288905260ff871692820192909252606081018590526080810184905260019060a0016020604051602081039080840390855afa1580156113fa573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661145d5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161031c565b95945050505050565b6001600160a01b0384163b15610dd55760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e61906114aa9089908990889088908890600401611ef4565b602060405180830381600087803b1580156114c457600080fd5b505af19250505080156114f4575060408051601f3d908101601f191682019092526114f191810190611c01565b60015b611500576110036121d2565b6001600160e01b0319811663f23a6e6160e01b146110d45760405162461bcd60e51b815260040161031c90611f84565b6001600160a01b0384166115905760405162461bcd60e51b815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b606482015260840161031c565b6115a9336000866115a08761175e565b6107238761175e565b60008381526000805160206122b1833981519152602090815260408083206001600160a01b03881684529182905282208054919285926115ea9084906120c9565b909155505060408051858152602081018590526001600160a01b0387169160009133917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a45050505050565b6001600160a01b0384166116655760405162461bcd60e51b815260040161031c90612060565b6116748686866115a08761175e565b60008381526000805160206122b1833981519152602081815260408084206001600160a01b038a16855290915290912054838110156116c55760405162461bcd60e51b815260040161031c90611fcc565b6000858152602083815260408083206001600160a01b038b81168552925280832087850390559088168252812080548692906117029084906120c9565b909155505060408051868152602081018690526001600160a01b03808916928a821692918c16917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a45050505050505050565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110611798576117986121a6565b602090810291909101015292915050565b8280546117b59061210d565b90600052602060002090601f0160209004810192826117d7576000855561181d565b82601f106117f057805160ff191683800117855561181d565b8280016001018555821561181d579182015b8281111561181d578251825591602001919060010190611802565b5061182992915061182d565b5090565b5b80821115611829576000815560010161182e565b80356001600160a01b038116811461185957600080fd5b919050565b600082601f83011261186f57600080fd5b8135602061187c826120a5565b6040516118898282612148565b8381528281019150858301600585901b870184018810156118a957600080fd5b60005b858110156118c8578135845292840192908401906001016118ac565b5090979650505050505050565b600082601f8301126118e657600080fd5b813567ffffffffffffffff811115611900576119006121bc565b604051611917601f8301601f191660200182612148565b81815284602083860101111561192c57600080fd5b816020850160208301376000918101602001919091529392505050565b60006020828403121561195b57600080fd5b61196482611842565b9392505050565b6000806040838503121561197e57600080fd5b61198783611842565b915061199560208401611842565b90509250929050565b600080600080600060a086880312156119b657600080fd5b6119bf86611842565b94506119cd60208701611842565b9350604086013567ffffffffffffffff808211156119ea57600080fd5b6119f689838a0161185e565b94506060880135915080821115611a0c57600080fd5b611a1889838a0161185e565b93506080880135915080821115611a2e57600080fd5b50611a3b888289016118d5565b9150509295509295909350565b600080600080600060a08688031215611a6057600080fd5b611a6986611842565b9450611a7760208701611842565b93506040860135925060608601359150608086013567ffffffffffffffff811115611aa157600080fd5b611a3b888289016118d5565b60008060408385031215611ac057600080fd5b611ac983611842565b915060208301358015158114611ade57600080fd5b809150509250929050565b60008060408385031215611afc57600080fd5b611b0583611842565b946020939093013593505050565b60008060408385031215611b2657600080fd5b823567ffffffffffffffff80821115611b3e57600080fd5b818501915085601f830112611b5257600080fd5b81356020611b5f826120a5565b604051611b6c8282612148565b8381528281019150858301600585901b870184018b1015611b8c57600080fd5b600096505b84871015611bb657611ba281611842565b835260019690960195918301918301611b91565b5096505086013592505080821115611bcd57600080fd5b50611bda8582860161185e565b9150509250929050565b600060208284031215611bf657600080fd5b813561196481612277565b600060208284031215611c1357600080fd5b815161196481612277565b600080600080600060a08688031215611c3657600080fd5b853567ffffffffffffffff811115611c4d57600080fd5b611c59888289016118d5565b955050611c6860208701611842565b9350611c7660408701611842565b9250611c8460608701611842565b9150611c9260808701611842565b90509295509295909350565b60008060008060808587031215611cb457600080fd5b843567ffffffffffffffff80821115611ccc57600080fd5b611cd8888389016118d5565b955060208701359450604087013593506060870135915080821115611cfc57600080fd5b50611d09878288016118d5565b91505092959194509250565b600060208284031215611d2757600080fd5b5035919050565b600081518084526020808501945080840160005b83811015611d5e57815187529582019590820190600101611d42565b509495945050505050565b60008151808452611d818160208601602086016120e1565b601f01601f19169290920160200192915050565b60008151611da78185602086016120e1565b9290920192915050565b60008651611dc3818460208b016120e1565b919091019485525060208401929092526040830152606090811b6bffffffffffffffffffffffff191690820152607401919050565b600080845481600182811c915080831680611e1457607f831692505b6020808410821415611e3457634e487b7160e01b86526022600452602486fd5b818015611e485760018114611e5957611e86565b60ff19861689528489019650611e86565b60008b81526020902060005b86811015611e7e5781548b820152908501908301611e65565b505084890196505b50505050505061145d8185611d95565b6001600160a01b0386811682528516602082015260a060408201819052600090611ec290830186611d2e565b8281036060840152611ed48186611d2e565b90508281036080840152611ee88185611d69565b98975050505050505050565b6001600160a01b03868116825285166020820152604081018490526060810183905260a060808201819052600090611f2e90830184611d69565b979650505050505050565b6020815260006119646020830184611d2e565b604081526000611f5f6040830185611d2e565b828103602084015261145d8185611d2e565b6020815260006119646020830184611d69565b60208082526028908201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b606082015260800190565b6020808252602b908201527f455243313135353a20696e73756666696369656e742062616c616e636573206660408201526a37b9103a3930b739b332b960a91b606082015260800190565b60208082526029908201527f455243313135353a2063616c6c6572206973206e6f74206f776e6572206e6f7260408201526808185c1c1c9bdd995960ba1b606082015260800190565b60208082526025908201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604082015264647265737360d81b606082015260800190565b600067ffffffffffffffff8211156120bf576120bf6121bc565b5060051b60200190565b600082198211156120dc576120dc612190565b500190565b60005b838110156120fc5781810151838201526020016120e4565b83811115610f475750506000910152565b600181811c9082168061212157607f821691505b6020821081141561214257634e487b7160e01b600052602260045260246000fd5b50919050565b601f8201601f1916810167ffffffffffffffff8111828210171561216e5761216e6121bc565b6040525050565b600060001982141561218957612189612190565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b600060033d1115610e305760046000803e5060005160e01c90565b600060443d10156121fb5790565b6040516003193d81016004833e81513d67ffffffffffffffff816024840111818411171561222b57505050505090565b82850191508151818111156122435750505050505090565b843d870101602082850101111561225d5750505050505090565b61226c60208286010187612148565b509095945050505050565b6001600160e01b03198116811461228d57600080fd5b5056fe47dc25f21c7793543edaeb1ef19d41726ddbada967ae9a7980b9bd8a45228a5e1799cf914cb0cb442ca7c7ac709ee40d0cb89e87351dc08d517fbda27d50c68ba2646970667358221220d1bb57b683236ee2e30815bfb4b33c890aeac75d055f922f780fd35f034c13fd64736f6c63430008050033";

export class CyberDestinationUtilityFactoryFacet__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CyberDestinationUtilityFactoryFacet> {
    return super.deploy(
      overrides || {}
    ) as Promise<CyberDestinationUtilityFactoryFacet>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): CyberDestinationUtilityFactoryFacet {
    return super.attach(address) as CyberDestinationUtilityFactoryFacet;
  }
  connect(signer: Signer): CyberDestinationUtilityFactoryFacet__factory {
    return super.connect(
      signer
    ) as CyberDestinationUtilityFactoryFacet__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CyberDestinationUtilityFactoryFacetInterface {
    return new utils.Interface(
      _abi
    ) as CyberDestinationUtilityFactoryFacetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CyberDestinationUtilityFactoryFacet {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as CyberDestinationUtilityFactoryFacet;
  }
}
