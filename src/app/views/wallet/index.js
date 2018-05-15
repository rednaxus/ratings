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




    const Web3 = require('web3');

    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));




    var contract = web3.eth.contract(abi);
    var contractInstance = contract.at(address);
    console.log(address);


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

    console.log("Using web3 version: " + web3.version.api);
    console.log  (web3.eth.getBalance(web3.eth.defaultAccount));
    console.log (contractInstance.balanceOf(web3.eth.defaultAccount).toString());



if (!contractInstance.balanceOf(web3.eth.defaultAccount).c[1]){

  var toStringNum = contractInstance.balanceOf(web3.eth.defaultAccount).toString();

  console.log ('dkhslghs;dfghsdf;lkghsdl;fkghsd;lfkghsd;fgsdfg');
  console.log (toStringNum);
  console.log (web3.fromWei(toStringNum, 'ether'));
  console.log ('dkssagjsjfdsgdsfkjghskdlfjghsfdkljghskldfgjhslfdg');

  vevaBalance = web3.fromWei(toStringNum, 'ether');

}

else{
    fromWeiOne = contractInstance.balanceOf(web3.eth.defaultAccount).c[0].toString();
    fromWeiTwo = contractInstance.balanceOf(web3.eth.defaultAccount).c[1].toString();

    vevaBalance = web3.fromWei(fromWeiOne+fromWeiTwo, 'ether');
}
    //vevaBalance = web3.fromWei(contractInstance.balanceOf(web3.eth.defaultAccount), 'ether');


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

  //var amount = Number(amountX);


  if (amount) {



  var amountWei = web3.toWei(amount);



  if (Number(amount) <= Number(vevaBalance)) {


    console.log ("xxxxxxxxxxxxxxxxxcxcxcxcxcxcxcxcxc");
    console.log (amountWei);
    console.log (typeof amount);
    console.log (typeof vevaBalance);
    console.log ("xxxxxxxxxxxxxxxxxcxcxcxcxcxcxcxcxc");


  contractInstance.transfer(toAddress, amountWei, {from: web3.eth.defaultAccount});


    alert ("You have successfully transferred " + amount + " VEVA to " + toAddress + " !")

    console.log (toAddress, amount);

    console.log ("hurray!  You sent" + amount + " VEVA tokens to " + toAddress);

  }

  else {

  alert("So sorry! You don't have enough VEVA tokens to send! Please try transferring  a different amount.");

  console.log ("Insufficient Balance");

  }
}



};


/*
  $("#button").click(function() {
     var toAddress = $("#address").val();
     var amount = $("#amount").val();
     contract.methods.transfer(toAddress, amount).send({from: web3js.eth.defaultAccount});
  });
  */


export default Wallet
