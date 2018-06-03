const config = require('../../config/appConfig')
const { getTestTokenERC20:TokenERC20 } = require('../contracts')

const s = '***'

const { getWeb3 } = require( '../utils')

module.exports = {
  balanceOf: ( account ) => new Promise( ( resolve, reject ) => TokenERC20().then( wallet => {
  	let web3 = getWeb3()
  	wallet.balanceOf( account ).then( balance => {
  		resolve( web3.fromWei(balance, 'ether') )
  	}).catch( reject )
  })),
  transfer: ( toAddress, amountWei ) => new Promise( ( resolve, reject ) => TokenERC20().then( wallet => {
  	let web3 = getWeb3()
  	wallet.transfer( toAddress, amountWei ).then( result => {
  		resolve( result ) // transaction obj
  	}).catch( reject )
  }))
}
