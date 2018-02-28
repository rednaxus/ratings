var TokenERC20 = artifacts.require("TokenERC20")
var AnalystRegistry = artifacts.require("AnalystRegistry")
var RatingAgency = artifacts.require("RatingAgency")

module.exports = function(deployer) {
	deployer.deploy(AnalystRegistry)
	.then( () => AnalystRegistry.deployed() )
	.then( registry => deployer.deploy(RatingAgency,registry.address)  )
	
  deployer.then( () => {
		let tpromises = [1,2,3,4].map( id => TokenERC20.new(10000,"MOOLAH"+id,"MOO"+id))
		Promise.all(tpromises).then( tokens => {
  		tokens.map( token => console.log('erc address',token.address)  )			
		})
	})

			/*	
		  deployer.deploy(AnalystRegistry).then( () => {
	  		deployer.then( () => {
		  		RatingAgency.new(AnalystRegistry.address).then( instance => {
		  			console.log('rating agency instance',instance.address)
						tokens.map( token => {
							console.log('erc address',token.address)  		
							//instance.coverToken(token.address,0) do this when understand how to make it work
						})
		  		})	  			
	  		}
		  })
		  */
}

