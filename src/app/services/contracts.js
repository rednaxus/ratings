import { store } from '../Root'
import TokenERC20Contract from '../../../build/contracts/TokenERC20.json'
import RatingAgencyContract from '../../../build/contracts/RatingAgency.json'
import AnalystRegistryContract from '../../../build/contracts/AnalystRegistry.json'
//import AuthenticationContract from '../../../build/contracts/Authentication.json' // to deprecate in favor of registry

const contract = require('truffle-contract')

export const getContractInstance = (contractDesc, addr = null) => 
	new Promise((resolve, reject) => {
		let web3 = store.getState().web3.web3Instance
  	if (typeof web3 === 'undefined' ) { // Double-check web3's status.
    	console.error('Web3 is not initialized.'); 
    	reject('error');
  	}
    const instanceContract = contract(contractDesc)
    instanceContract.setProvider(web3.currentProvider)

    web3.eth.getCoinbase((error, coinbase) => { // Get current ethereum wallet.
      if (error) reject(console.error(error));

      if (addr)
        instanceContract.at(addr).then(instance => resolve(instance))
      else 
        instanceContract.deployed().then(instance => resolve(instance))
    })
  })

export const getTokenERC20 = (addr) => getContractInstance( TokenERC20Contract, addr )
export const getRatingAgency = () => getContractInstance( RatingAgencyContract )
export const getAnalystRegistry = () => getContractInstance( AnalystRegistryContract )
//export const getAuthentication = () => getContractInstance( AuthenticationContract )

export const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
  )

export default getContractInstance  // probably change this
