const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

const Cron = require('cron').CronJob;
console.log('started at ',new Date())
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

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


var account;
var deploy = false;

web3.eth.getCoinbase().then( (coinbase)=> { 
	account = coinbase;
	console.log('got coinbase, unlocking ',account)
	web3.eth.personal.unlockAccount(account, 'alman').
    then(() => { 
    	console.log('Account unlocked.'); 
    	const contractName = 'RatingAgency.sol:RatingAgency';
			let RatingAgency = new web3.eth.Contract(JSON.parse(output.contracts[contractName].interface), null, { 
    		data: '0x' + output.contracts[contractName].bytecode
			});
			//console.log('compiled contract:',RatingAgency);

			let contractAddress = "0x58A9f90944cd2fd2fBAa0B8ed6c27631F442B60f"
			const readline = require('readline');
			const rl = readline.createInterface(process.stdin, process.stdout);
			rl.setPrompt('[deploy,run,cron] > ');
			rl.prompt();
			rl.on('line', function(line) {
    		if (line === "exit") rl.close();
    		else if (line === "deploy") {
					console.log('deploying...')
					RatingAgency.deploy({
		    		data: '0x' + output.contracts[contractName].bytecode,
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
		   			newContractInstance.methods.cron().call({ from: account }).then(console.log)
					});

    		}
    		else if (line === "run") {
					RatingAgency.options.address = contractAddress
					console.log('running...',RatingAgency.options.address)
					RatingAgency.methods.cron().call({ from: account }).then(console.log)
    		}
    		else if (line === "cron") {
					const cronjob = new Cron('*/1 * * * *', () => {
						RatingAgency.options.address = contractAddress
						console.log('cron running...',new Date(), RatingAgency.options.address)
						RatingAgency.methods.cron().call({ from: account }).then(console.log)    				
    			}, null, true, 'America/Los_Angeles')
    		}
    		rl.prompt();
			}).on('close',function(){
    		process.exit(0);
			});

    })
    .catch(console.error);
} ).catch(console.error);

