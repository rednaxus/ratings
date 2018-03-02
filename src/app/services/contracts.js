import { store } from '../Root'
import { appConfig } from '../config'
import TokenERC20Contract from '../../../build/contracts/TokenERC20.json'
import RatingAgencyContract from '../../../build/contracts/RatingAgency.json'
import AnalystRegistryContract from '../../../build/contracts/AnalystRegistry.json'


console.log( 'using analyst registry at: ' + appConfig.ANALYST_REGISTRY )

const contract = require('truffle-contract')

export const getContractInstance = (contractDesc, addr = null) => 
	new Promise((resolve, reject) => {
		/*let web3 = store.getState().web3.web3Instance
  	if (typeof web3 === 'undefined' ) { // Double-check web3's status.
    	console.error('Web3 is not initialized.'); 
    	reject('error');
  	}
    */
    let web3 = window.web3
    console.log('web3 version',web3.version.api)
    const instanceContract = contract(contractDesc)
    instanceContract.setProvider(web3.currentProvider)
    instanceContract.setNetwork(7)
    console.log('getting coinbase','contract addr',instanceContract.address)
    web3.eth.getCoinbase((error, coinbase) => { // Get current ethereum wallet.
      instanceContract.defaults({from:coinbase}) 

      console.log('got ',coinbase)
      if (error) reject(console.error(error));

      if (addr)
        instanceContract.at(addr).then(instance => resolve(instance))
      else 
        instanceContract.deployed().then(instance => resolve(instance))
    })
  })

export const getTokenERC20 = (addr) => getContractInstance( TokenERC20Contract, addr )
export const getRatingAgency = () => getContractInstance( RatingAgencyContract, appConfig.RATING_AGENCY )
export const getAnalystRegistry = () => getContractInstance( AnalystRegistryContract, appConfig.ANALYST_REGISTRY )

export const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
  )

export default getContractInstance  // probably change this
