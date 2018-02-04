const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

// Contract descriptions from truffle
const RatingAgencyObj = require("../build/contracts/RatingAgency.json");
const AnalystRegistryObj = require("../build/contracts/AnalystRegistry.json");
/*
var TokenERC20 = artifacts.require("TokenERC20")
var AnalystRegistry = artifacts.require("AnalystRegistry")
var RatingAgency = artifacts.require("RatingAgency")
*/

var config = {
	ANALYST_REGISTRY:"0x889082ed72e0b7afd16b395d51b316b9b607bcc1",
	gas:4500000,
	gasPrice: '30000000000000'
}

const Cron = require('cron').CronJob;
console.log('started at ',new Date())
let web3 = new Web3('ws://localhost:8546');
//web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
console.log("Talking with a geth server", Web3);

const runInterval = 86400 	// e.g. 4 days
let runTime = 1514764800 

setTimeout(()=> {
	/*

	let input = {
	//	'hello.sol':'contract Hello{ string h = "hello from joad"; function g() constant returns(string){ return h; } }'
		'RatingAgency.sol': fs.readFileSync('../contracts/RatingAgency.sol','utf8')
	}

	const findImports = (path) => {
		let p = path.startsWith('./') ? path.substring(2):path;
		return { contents: fs.readFileSync('../contracts/'+p,'utf8')}
	}

	console.log('compiling contracts')//,input['RatingAgency.sol']);
	var output = solc.compile({ sources: input }, 1, findImports )
	for (var contractName in output.contracts)
		console.log(contractName)// + ' -->: ' + output.contracts[contractName].bytecode)
	*/

	var account;
	var deploy = false;
	
	//console.log('web3',web3.eth.personal);
	web3.eth.getCoinbase().then( coinbase => { 

		account = coinbase;
		console.log('got coinbase, unlocking ',account)
		let transactObj = { from: account, gas: config.gas, gasPrice: config.gasPrice}

		web3.eth.personal.unlockAccount(account, 'alman').then(() => { 
	  	console.log('Account unlocked.'); 
	  	//const contractName = 'RatingAgency.sol:RatingAgency';
	  	//var iface = JSON.parse(output.contracts[contractName].interface)
	  	//console.log('inteface:',iface)

			let ratingAgencyAddress = RatingAgencyObj.networks[7].address //"0x58A9f90944cd2fd2fBAa0B8ed6c27631F442B60f"
			console.log('rating agency address',ratingAgencyAddress)

			let RatingAgency = new web3.eth.Contract(RatingAgencyObj.abi,ratingAgencyAddress,transactObj);
			console.log('compiled contract:',RatingAgency);

			//let RatingAgency = RatingAgencyContract.at(ratingAgencyAddress);

			RatingAgency.events.TokenAdd({ fromBlock: 0, toBlock: 'latest' }, (error, event) => {
	  		console.log(error?error:'', event);
			})
			RatingAgency.events.CycleAdded({ fromBlock: 0, toBlock: 'latest' }, (error, event) => {
	  		console.log(error?error:'', event);
			})
			RatingAgency.events.AvailabilityAdd({ fromBlock: 0, toBlock: 'latest' }, (error, event) => {
	  		console.log(error?error:'', event);
			})
			RatingAgency.events.RoundPopulated({ fromBlock: 0, toBlock: 'latest' }, (error, event) => {
	  		console.log(error?error:'', event);
			})
			RatingAgency.events.RoundActivated({ fromBlock: 0, toBlock: 'latest' }, (error, event) => {
	  		console.log(error?error:'', event);
			})
			RatingAgency.events.RoundScheduled({ fromBlock: 0, toBlock: 'latest' }, (error, event) => {
	  		console.log(error?error:'', event);
			})
			RatingAgency.events.RoundFinished({ fromBlock: 0, toBlock: 'latest' }, (error, event) => {
	  		console.log(error?error:'', event);
			})


			const readline = require('readline');
			const rl = readline.createInterface(process.stdin, process.stdout);
			rl.setPrompt('[deploy,run,cron] > ');
			rl.prompt();
			rl.on('line', function(line) {
	  		if (line === "exit") rl.close();
	  		else if (line === "deploy") {
					console.log('deploying not enabled...')
					/*
					RatingAgencyContract.deploy({
		    		data: RatingAgencyObj.bytecode,
		    		arguments: []
					})
					.send({
		    		from: account,
		    		gas: 3500000,
		    		gasPrice: '30000000000000'
					}, function(error, transactionHash){ 
						console.log('got transaction hash'); 
					})
					.on('error', function(error){ 
						console.log('got error') 
					})
					.on('transactionHash', function(transactionHash){ 
						console.log('on transaction hash') 
					})
					.on('receipt', function(receipt){
		   			console.log('receipt')
		   			console.log(receipt.contractAddress) // contains the new contract address

					})
					.on('confirmation', function(confirmationNumber, receipt){ 
						//console.log('confirmation '+confirmationNumber,receipt)
					})
					.then(function(newContractInstance){
						contractAddress = newContractInstance.options.address // change default running address to this
		    		console.log('new instance',contractAddress) // instance with the new contract address
		   			newContractInstance.methods.cron(0).call({ 
		   				from: account, 
		    			gas: 3500000,
		    			gasPrice: '30000000000000'
		   			}).then(console.log)
					});
					*/
	  		}
	  		else if ( line.startsWith("r") ) {
					console.log('at time:',runTime)
					RatingAgency.methods.generateAllAvailabilities().send(transactObj)
					.on('transactionHash', console.log)
					.on('receipt', receipt => {
    				console.log('got receipt')
					})
					.on('confirmation', (confirmationNumber, receipt) => {
						//console.log('got confirmation',confirmationNumber, receipt)
					})
					.on('error', console.error)
					.then( result => {
						console.log('generated availabilities',result)
						RatingAgency.methods.cron(runTime).send(transactObj).then( result => {
							console.log('cron finished',result)
							runTime += runInterval
						})
	  			})
	  		}
	  		else if (line === "cron") {
					const cronjob = new Cron('*/1 * * * *', () => {
						console.log('cron running...',new Date(), ratingAgencyAddress)
	 					RatingAgency.cron(runTime).then(console.log) 				
	  			}, null, true, 'America/Los_Angeles')
	  		}
	  		rl.prompt();
			}).on('close',function(){
	  		process.exit(0);
			});

	  })
	  .catch( error => {
	  	console.log(error, 'error unlocking personal')
	  })
	})
	.catch( error => {	
			console.log(error,'error getting coinbase')
	})

},1000)
