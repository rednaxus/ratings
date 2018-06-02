const { getWeb3 } = require('../utils')

module.exports = {
	getBalance: ( account ) => new Promise( (resolve, reject ) => {
		let web3 = getWeb3()
		web3.eth.getBalance( account, ( err,balance ) => {
			if ( err ) return reject( err ) 
			resolve( balance )
		})
	}),
	getAccounts: () => new Promise( ( resolve, reject ) => {
		let web3 = getWeb3()
		web3.eth.getAccounts( ( err, accounts ) => {
			if ( err ) return reject( err )
			resolve( accounts )
		})
	})
}

