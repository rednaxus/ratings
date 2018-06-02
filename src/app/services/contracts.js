const config = require('../config/appConfig')
const contract = require('truffle-contract')
const utils = require('./utils')

const TokenERC20Contract = require('../../../build/contracts/TokenERC20.json')
const TestTokenERC20Contract = require('../../../build/contracts/vevaTest.json')
const RatingAgencyContract = require('../../../build/contracts/RatingAgency.json')
const AnalystRegistryContract = require('../../../build/contracts/AnalystRegistry.json')


const getContractInstance = (contractDesc, addr = null) => new Promise((resolve, reject) => {
  let web3 = utils.getWeb3() 
  //console.log('web3 version',web3.version)

  const instanceContract = contract(contractDesc)
  instanceContract.setProvider(web3.currentProvider)
  instanceContract.setNetwork(7)
  //console.log('getting coinbase','contract addr',instanceContract.address)
  web3.eth.getCoinbase((error, coinbase) => { // Get current ethereum wallet.
    instanceContract.defaults(typeof window == 'undefined' ? { from: coinbase, gas: config.ETHEREUM.gas, gasPrice: config.ETHEREUM.gasPrice }: {from:coinbase})

    //console.log('got ',coinbase)
    if (error) reject(console.error(error));

    if (addr)
      instanceContract.at(addr).then(instance => resolve(instance))
    else
      instanceContract.deployed().then(instance => resolve(instance))
  })
})

const getTokenERC20 = addr => getContractInstance( TokenERC20Contract, addr )
const getTestTokenERC20 = addr => getContractInstance( TestTokenERC20Contract, addr )
const getRatingAgency = () => getContractInstance( RatingAgencyContract ) //, appConfig.RATING_AGENCY )
const getAnalystRegistry = () => getContractInstance( AnalystRegistryContract ) //, appConfig.ANALYST_REGISTRY )

module.exports = {
  getContractInstance,
  getTokenERC20,
  getTestTokenERC20,
  getRatingAgency,
  getAnalystRegistry
}
//export default getContractInstance  // probably change this
