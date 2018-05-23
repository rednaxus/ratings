const Web3 = require('web3')
//const solc = require('solc');
const fs = require('fs')
const util = require('util')
const debug = require('debug')
//const cronlog = debug('cron')
const eventlog = debug('event')

// Contract descriptions from truffle
const RatingAgencyObj = require("../build/contracts/RatingAgency.json");
const AnalystRegistryObj = require("../build/contracts/AnalystRegistry.json");


const config = {
	gas:4700000,
	gasPrice: '100',
	ws: 'ws://localhost:8545',
	provider: 'http://localhost:8545',
	network: 7
}

let web3 = new Web3(config.ws)
//web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
console.log("Talking with a geth server", web3)

//setTimeout( () => { // needed because of a bug in web3 1.0

	
//console.log('web3',web3.eth.personal);
web3.eth.getCoinbase().then( coinbase => { 

	let account = coinbase
	console.log('got coinbase, unlocking ',account)
	let tr = { from: account, gas: config.gas, gasPrice: config.gasPrice }

	//web3.eth.personal.unlockAccount(account, 'alman').then(() => { 
  //	console.log('Account unlocked.'); 
  	//const contractName = 'RatingAgency.sol:RatingAgency';
  	//var iface = JSON.parse(output.contracts[contractName].interface)
  	//console.log('inteface:',iface)

	let ratingAgencyAddress = RatingAgencyObj.networks[config.network].address //"0x58A9f90944cd2fd2fBAa0B8ed6c27631F442B60f"
	let analystRegistryAddress = AnalystRegistryObj.networks[config.network].address

	console.log('rating agency address',ratingAgencyAddress)
	console.log('analyst registry address',analystRegistryAddress)

	let RatingAgency = new web3.eth.Contract( RatingAgencyObj.abi, ratingAgencyAddress, tr )
	let AnalystRegistry = new web3.eth.Contract( AnalystRegistryObj.abi, analystRegistryAddress, tr )
	let ra = RatingAgency.methods
	let ar = AnalystRegistry.methods

	const sendError = ( err ) => {
		console.log( 'send error', err )
	}
	const callError = ( err ) => {
		console.log( 'call error', err )
	}

	ra.lasttime().call( tr ).then( result => {
		console.log( result )
	}).catch( callError )

	ra.cycleGenerateAvailabilities(0).send( tr ).then( result => {
		console.log( util.inspect( result, { depth:6 } ) )
	}).catch( sendError )
})
.catch( error => {	
		console.log(error,'error getting coinbase')
})

//},0) 	
/*
Running migration: 2_deploy_contracts.js
  Deploying AnalystRegistry...
  ... 0xb5f25cb1603fadc0ea7d62082b14f3f423c3e79a4be1848985a7364cfd2cd065
  AnalystRegistry: 0x5fcc303fc970394afadff52a1c5224ad0a677c4d
  Deploying RatingAgency...
  ... 0x26d0b7cb9710e789311eb8418b7a84edff0d031e436a6f668d1828a292988d62
  RatingAgency: 0x594274b7619fd1b9ce9b83b771bcf6ec4a4efa95
  Deploying test2...
  ... 0x3a4b1f06e517b4f74c03a9a41b56b0e037e4d2c4dc0eed0381538a22b32167c6
  test2: 0x3ae851d5780725853de7118c73d0bd2a303c7fff
  Deploying vevaTest...
  ... 0x0c8301e0865d5b1d0f545678f65a75c4d408880f0fe5b208523a96a73529093e
  vevaTest: 0xaa9bceb2d84ded2147e971de3c579ffee2a677ce
Saving successful migration to network...
  ... 0x9402eec7e1e809e1c36aee75272ac018c098cb9c90bddb3b4615783592a89c6f
Saving artifacts...
*/

