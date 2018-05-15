import React, { PureComponent } from 'react'
import { AnimatedView } from '../../components'
import { store } from '../../Root'
import { appConfig } from '../../config'
import TestTokenERC20Contract from '../../../../build/contracts/vevaTest.json'


/*
console.log("Using web3 version: " + Web3.version);
web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

web3js.eth.getAccounts().then(function (accounts) {
   web3js.eth.defaultAccount = accounts[0];
   console.log("Default account: " + web3js.eth.defaultAccount);
})
.then(function () {
   return contract.methods.balances(web3js.eth.defaultAccount).call();
})
.then(function (result) {
   $('#display').text(result + " CDT");
   console.log(result);
});

var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
var address = "0xa4073a89691540735e50f1b8e1559266435f6dc4"; // Replace the contract address: 0x2213f785f3913d1d7a02680349bd5c9171d0eed1

var contract = new web3js.eth.Contract(abi, address);
console.log(contract);

$("#button").click(function() {
   var toAddress = $("#address").val();
   var amount = $("#amount").val();
   contract.methods.transfer(toAddress, amount).send({from: web3js.eth.defaultAccount});
});

*/

		/*let web3 = store.getState().web3.web3Instance
  	if (typeof web3 === 'undefined' ) { // Double-check web3's status.
    	console.error('Web3 is not initialized.');
    	reject('error');
  	}
    */






    var address = TestTokenERC20Contract.networks["7"].address;

    var abi = TestTokenERC20Contract.abi;

    var abix = [

      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "_totalSupply",
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
        "constant": false,
        "inputs": [],
        "name": "acceptOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "a",
            "type": "uint256"
          },
          {
            "name": "b",
            "type": "uint256"
          }
        ],
        "name": "safeSub",
        "outputs": [
          {
            "name": "c",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "a",
            "type": "uint256"
          },
          {
            "name": "b",
            "type": "uint256"
          }
        ],
        "name": "safeDiv",
        "outputs": [
          {
            "name": "c",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "a",
            "type": "uint256"
          },
          {
            "name": "b",
            "type": "uint256"
          }
        ],
        "name": "safeMul",
        "outputs": [
          {
            "name": "c",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "newOwner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "a",
            "type": "uint256"
          },
          {
            "name": "b",
            "type": "uint256"
          }
        ],
        "name": "safeAdd",
        "outputs": [
          {
            "name": "c",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "_from",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "tokens",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "tokenOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "tokens",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
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
        "constant": true,
        "inputs": [
          {
            "name": "tokenOwner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "balance",
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
            "name": "to",
            "type": "address"
          },
          {
            "name": "tokens",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "spender",
            "type": "address"
          },
          {
            "name": "tokens",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "from",
            "type": "address"
          },
          {
            "name": "to",
            "type": "address"
          },
          {
            "name": "tokens",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "name": "success",
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
            "name": "tokenOwner",
            "type": "address"
          },
          {
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "name": "remaining",
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
            "name": "spender",
            "type": "address"
          },
          {
            "name": "tokens",
            "type": "uint256"
          },
          {
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "approveAndCall",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "name": "tokens",
            "type": "uint256"
          }
        ],
        "name": "transferAnyERC20Token",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }

    ];


    /*
    var abi = [
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "name",
      		"outputs": [
      			{
      				"name": "",
      				"type": "string"
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
      				"name": "spender",
      				"type": "address"
      			},
      			{
      				"name": "tokens",
      				"type": "uint256"
      			}
      		],
      		"name": "approve",
      		"outputs": [
      			{
      				"name": "success",
      				"type": "bool"
      			}
      		],
      		"payable": false,
      		"stateMutability": "nonpayable",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "totalSupply",
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
      		"constant": false,
      		"inputs": [
      			{
      				"name": "from",
      				"type": "address"
      			},
      			{
      				"name": "to",
      				"type": "address"
      			},
      			{
      				"name": "tokens",
      				"type": "uint256"
      			}
      		],
      		"name": "transferFrom",
      		"outputs": [
      			{
      				"name": "success",
      				"type": "bool"
      			}
      		],
      		"payable": false,
      		"stateMutability": "nonpayable",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "decimals",
      		"outputs": [
      			{
      				"name": "",
      				"type": "uint8"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "_totalSupply",
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
      		"constant": true,
      		"inputs": [
      			{
      				"name": "tokenOwner",
      				"type": "address"
      			}
      		],
      		"name": "balanceOf",
      		"outputs": [
      			{
      				"name": "balance",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": false,
      		"inputs": [],
      		"name": "acceptOwnership",
      		"outputs": [],
      		"payable": false,
      		"stateMutability": "nonpayable",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "owner",
      		"outputs": [
      			{
      				"name": "",
      				"type": "address"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "symbol",
      		"outputs": [
      			{
      				"name": "",
      				"type": "string"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [
      			{
      				"name": "a",
      				"type": "uint256"
      			},
      			{
      				"name": "b",
      				"type": "uint256"
      			}
      		],
      		"name": "safeSub",
      		"outputs": [
      			{
      				"name": "c",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "pure",
      		"type": "function"
      	},
      	{
      		"constant": false,
      		"inputs": [
      			{
      				"name": "to",
      				"type": "address"
      			},
      			{
      				"name": "tokens",
      				"type": "uint256"
      			}
      		],
      		"name": "transfer",
      		"outputs": [
      			{
      				"name": "success",
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
      				"name": "a",
      				"type": "uint256"
      			},
      			{
      				"name": "b",
      				"type": "uint256"
      			}
      		],
      		"name": "safeDiv",
      		"outputs": [
      			{
      				"name": "c",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "pure",
      		"type": "function"
      	},
      	{
      		"constant": false,
      		"inputs": [
      			{
      				"name": "spender",
      				"type": "address"
      			},
      			{
      				"name": "tokens",
      				"type": "uint256"
      			},
      			{
      				"name": "data",
      				"type": "bytes"
      			}
      		],
      		"name": "approveAndCall",
      		"outputs": [
      			{
      				"name": "success",
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
      				"name": "a",
      				"type": "uint256"
      			},
      			{
      				"name": "b",
      				"type": "uint256"
      			}
      		],
      		"name": "safeMul",
      		"outputs": [
      			{
      				"name": "c",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "pure",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [],
      		"name": "newOwner",
      		"outputs": [
      			{
      				"name": "",
      				"type": "address"
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
      				"name": "tokenAddress",
      				"type": "address"
      			},
      			{
      				"name": "tokens",
      				"type": "uint256"
      			}
      		],
      		"name": "transferAnyERC20Token",
      		"outputs": [
      			{
      				"name": "success",
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
      				"name": "tokenOwner",
      				"type": "address"
      			},
      			{
      				"name": "spender",
      				"type": "address"
      			}
      		],
      		"name": "allowance",
      		"outputs": [
      			{
      				"name": "remaining",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "view",
      		"type": "function"
      	},
      	{
      		"constant": true,
      		"inputs": [
      			{
      				"name": "a",
      				"type": "uint256"
      			},
      			{
      				"name": "b",
      				"type": "uint256"
      			}
      		],
      		"name": "safeAdd",
      		"outputs": [
      			{
      				"name": "c",
      				"type": "uint256"
      			}
      		],
      		"payable": false,
      		"stateMutability": "pure",
      		"type": "function"
      	},
      	{
      		"constant": false,
      		"inputs": [
      			{
      				"name": "_newOwner",
      				"type": "address"
      			}
      		],
      		"name": "transferOwnership",
      		"outputs": [],
      		"payable": false,
      		"stateMutability": "nonpayable",
      		"type": "function"
      	},
      	{
      		"inputs": [],
      		"payable": false,
      		"stateMutability": "nonpayable",
      		"type": "constructor"
      	},
      	{
      		"payable": true,
      		"stateMutability": "payable",
      		"type": "fallback"
      	},
      	{
      		"anonymous": false,
      		"inputs": [
      			{
      				"indexed": true,
      				"name": "_from",
      				"type": "address"
      			},
      			{
      				"indexed": true,
      				"name": "_to",
      				"type": "address"
      			}
      		],
      		"name": "OwnershipTransferred",
      		"type": "event"
      	},
      	{
      		"anonymous": false,
      		"inputs": [
      			{
      				"indexed": true,
      				"name": "from",
      				"type": "address"
      			},
      			{
      				"indexed": true,
      				"name": "to",
      				"type": "address"
      			},
      			{
      				"indexed": false,
      				"name": "tokens",
      				"type": "uint256"
      			}
      		],
      		"name": "Transfer",
      		"type": "event"
      	},
      	{
      		"anonymous": false,
      		"inputs": [
      			{
      				"indexed": true,
      				"name": "tokenOwner",
      				"type": "address"
      			},
      			{
      				"indexed": true,
      				"name": "spender",
      				"type": "address"
      			},
      			{
      				"indexed": false,
      				"name": "tokens",
      				"type": "uint256"
      			}
      		],
      		"name": "Approval",
      		"type": "event"
      	}
      ]
*/

    const Web3 = require('web3');

    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    console.log("Using web3 version: " + web3.version.api);



    var contract = web3.eth.contract(abi);
    var contractInstance = contract.at(address);
    console.log(contract);


  var accounts;
  var vevaBalance;
  var fromWeiOne;
  var fromWeiTwo;

  web3.eth.getAccounts(


    function () {

    accounts = web3.eth.accounts;

    if (accounts) {
    web3.eth.defaultAccount = accounts[0];
    console.log("Default account: " + web3.eth.defaultAccount);
    console.log  (web3.eth.getBalance(web3.eth.defaultAccount));
    console.log (contractInstance.balanceOf(web3.eth.defaultAccount));
    //console.log (contractInstance.getBalance(web3.eth.defaultAccount));
    //vevaBalance = new BigNumber (contractInstance.balanceOf(web3.eth.defaultAccount).c[0]);
    //vevaBalance.plus(21).toString(10);

    fromWeiOne = contractInstance.balanceOf(web3.eth.defaultAccount).c[0].toString();
    fromWeiTwo = contractInstance.balanceOf(web3.eth.defaultAccount).c[1].toString();

    vevaBalance = web3.fromWei(fromWeiOne+fromWeiTwo, 'ether');

    //vevaBalance = web3.fromWei(contractInstance.balanceOf(web3.eth.defaultAccount), 'ether');

    console.log ("xxxxxxxxxxxxxxxxxcxcxcxcxcxcxcxcxc");
    console.log (vevaBalance);
    console.log ("xxxxxxxxxxxxxxxxxcxcxcxcxcxcxcxcxc");


  }




}




  );



    /*.then(function (accounts) {
       web3.eth.defaultAccount = accounts[0];
       console.log("Default account: " + web3.eth.defaultAccount);
    });*/

export class Wallet extends PureComponent {

  render() {
    return(
      <AnimatedView>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>VEVA Wallet</h1>
              <p><strong>Hello!</strong> Welcome to your <span className="dog">Veva Token</span> wallet.</p>
              <p>You have {vevaBalance} in your wallet.</p>
            </div>
          </div>
          <div className="panel panel-default">



              <label >Send to address</label>
              <input id="address" type="text" />

              <br/>

              <label >Amount</label>
              <input id="amount" type="text"/>

              <br/>

              <button id="button" onClick={onItemClick}>SEND</button>

          </div>
        </main>
      </AnimatedView>
    )
  }
}

function onItemClick() {


  var toAddress = $("#address").val();
  var amount = $("#amount").val();

  var amountWei = web3.toWei(amount);


  if (amount <= vevaBalance) {

  contractInstance.transfer(toAddress, amountWei, {from: web3.eth.defaultAccount});


    alert ("You have successfully transferred " + amount + " VEVA to " + toAddress + " !")

    console.log (toAddress, amount);

    console.log ("hurray!  You sent" + amount + " VEVA tokens to " + toAddress);

  }

  else {

  alert("So sorry! You don't have enough VEVA tokens to send! Please try transferring  a different amount.");

  console.log ("Insufficient Balance");

  }




/*
  if (stringSearch == -1) {

    alert("No Decimal, whew");

  }

  else {

    var amountLong = (amountString + '000000000000000000')



    var amountBigNumber = web3.toBigNumber (amountLong);

    var transferWeiOne = amountBigNumber.c[0];
    var transferWeiTwo = amountBigNumber.c[1];

    amount = web3.fromWei(transferWeiOne+transferWeiTwo, 'ether');

    console.log ('sdfhsdgisfhdghsfdgoshfdgposdfngsdfg');
    console.log (amountLong);
    console.log ('sdfhsdgisfhdghsfdgoshfdgposdfngsdfg')

    if (amount <= vevaBalance) {

    contractInstance.transfer(toAddress, amount, {from: web3.eth.defaultAccount});


      alert ("You have successfully transferred " + amount + " VEVA to " + toAddress + " !")

      console.log (toAddress, amount);

      console.log ("hurray!  You sent VEVA tokens to " + toAddress);

    }

    else {

    alert("So sorry! You don't have enough VEVA tokens to send! Please try transferring  a different amount.");

    console.log ("Insufficient Balance");

    }

  }

*/





};


/*
  $("#button").click(function() {
     var toAddress = $("#address").val();
     var amount = $("#amount").val();
     contract.methods.transfer(toAddress, amount).send({from: web3js.eth.defaultAccount});
  });
  */


export default Wallet
