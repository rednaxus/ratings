  import React, { PureComponent, Component } from 'react'
  import { AnimatedView } from '../../components'
  import { store } from '../../Root'
  import { appConfig } from '../../config'
  import TestTokenERC20Contract from '../../../../build/contracts/vevaTest.json'

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
  var balanceDisplay;

  web3.eth.getAccounts(

    function () {

      accounts = web3.eth.accounts;

      if (accounts) {
        //web3.eth.defaultAccount = accounts[0];
        web3.eth.defaultAccount = window.web3.eth.defaultAccount;



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
      }
    }
  );



/*
  let account
  setTimeout(() => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) return
      console.log("nope!")
      accounts = web3.eth.accounts;
      if (accounts){
      web3.eth.defaultAccount = accounts[0]
      console.log("nope!")
      }

    })
  }, 1000)
  */



      setInterval(function() {

        web3.eth.getAccounts(

          function () {

            accounts = web3.eth.accounts;

            if (accounts) {

                if (window.web3.eth.defaultAccount !== web3.eth.defaultAccount) {
                  web3.eth.defaultAccount = window.web3.eth.defaultAccount;
                  //window.location.reload();

                }
              }
            });



                      /*console.log ("default: " + web3.eth.defaultAccount)*/

                    }, 1000);



  class ViewWallet extends Component {

    constructor(props) {
    super(props);
    this.state = {balanceDisplay: vevaBalance};

    }




    onItemClick = () => {

      web3.eth.defaultAccount = window.web3.eth.defaultAccount;

      var toAddress = $("#address").val();
      var amount = $("#amount").val();

      if ((toAddress.length == 42) && (toAddress[0] == '0') && (toAddress[1] == 'x' || toAddress[1] == "X") && Number(amount)>0) {

        console.log ("valid address and amount!");

        if (amount) {

          var amountWei = web3.toWei(amount);

          if (Number(amount) <= Number(vevaBalance)) {

            contractInstance.transfer(toAddress, amountWei, {from: web3.eth.defaultAccount});

            //, {from: web3.eth.defaultAccount}

            alert ("You have successfully transferred " + amount + " VEVA to " + toAddress + " !")
            console.log (toAddress, amount);
            console.log ("hurray!  You sent " + amount + " VEVA tokens to " + toAddress);

            if (!contractInstance.balanceOf(web3.eth.defaultAccount).c[1]){

              var toStringNum = contractInstance.balanceOf(web3.eth.defaultAccount).toString();

              vevaBalance = web3.fromWei(toStringNum, 'ether');
            }

            else{
              fromWeiOne = contractInstance.balanceOf(web3.eth.defaultAccount).c[0].toString();
              fromWeiTwo = contractInstance.balanceOf(web3.eth.defaultAccount).c[1].toString();

              vevaBalance = web3.fromWei(fromWeiOne+fromWeiTwo, 'ether');
            }

            this.setState({balanceDisplay: vevaBalance})

            //window.location.reload();

            /**********/

            console.log  (web3.eth.getBalance(web3.eth.defaultAccount));
            console.log (contractInstance.balanceOf(web3.eth.defaultAccount).toString());

            if (!contractInstance.balanceOf(web3.eth.defaultAccount).c[1]){

              var toStringNum = contractInstance.balanceOf(web3.eth.defaultAccount).toString();
              vevaBalance = web3.fromWei(toStringNum, 'ether');
            }

            else{
              fromWeiOne = contractInstance.balanceOf(web3.eth.defaultAccount).c[0].toString();
              fromWeiTwo = contractInstance.balanceOf(web3.eth.defaultAccount).c[1].toString();

              vevaBalance = web3.fromWei(fromWeiOne+fromWeiTwo, 'ether');
            }

            /**********/

          }

          else {

          alert("So sorry! You don't have enough VEVA tokens to send! Please try transferring  a different amount.");
          console.log ("Insufficient Balance");
          }
        }
      }

      else {

        if ((toAddress.length == 42) && (toAddress[0] == '0') && (toAddress[1] == 'x' || toAddress[1] == "X") && (Number(amount)<=0)){

          alert("Please enter a valid amount of VEVA tokens!");
          console.log ("invalid amount")
        }

        else if (!((toAddress.length == 42) && (toAddress[0] == '0') && (toAddress[1] == 'x' || toAddress[1] == "X")) && (Number(amount)>0)){

            alert("Please enter a valid address!");
            console.log ("invalid address")
          }

        else {

          alert("Please enter a valid address AND a valid amount!");
          console.log ("invalid address && amount")
        }
      };

  };

    render() {
      return (
        <AnimatedView>
          <main>

                <h1>Wallet</h1>
                <p><strong>View Balance and Send Tokens Here</strong></p>
                <p>You have <strong> {this.state.balanceDisplay} </strong> VEVA in your wallet.</p>

            <div>

                <label >Send to address</label>
                <input id="address" type="text" maxLength="42" />

                <br/>

                <label >Amount</label>
                <input id="amount" type="text" maxLength="26" />

                <br/>

                <button id="button" onClick={this.onItemClick}>SEND</button>

            </div>

            <br />

            <div>

              <p>

                Please Note: You can only send up to the amount of VEVA in your wallet, and you may be charged a transaction fee by the Ethereum network.
                <br/>
                Additionally, please note that valid ERC-20 addresses are 40 hex characters (0-9, A-F), prefixed with "0x".

              </p>

            </div>


          </main>
        </AnimatedView>
      );
    }
  }


  export class Wallet extends PureComponent {

    render() {

      return(
        <ViewWallet />
      )
    }
  }

  export default Wallet
