var TokenERC20 = artifacts.require("TokenERC20")
var AnalystRegistry = artifacts.require("AnalystRegistry")
var RatingAgency = artifacts.require("RatingAgency")

module.exports = function(deployer) {
	[1,2,3,4].map( id => {
		deployer.deploy(TokenERC20,10000,"MOOLAH"+id,"MOO"+id)
	})
	deployer.deploy(AnalystRegistry)
	.then( () => AnalystRegistry.deployed() )
	.then( registry => deployer.deploy(RatingAgency,registry.address)  )
	/*
  deployer.then( () => {
  	Promise.all([
  		TokenERC20.new(10000,"MOOLAH1","MOO1"),
  		TokenERC20.new(10000,"MOOLAH2","MOO2"),
  	  TokenERC20.new(10000,"MOOLAH3","MOO3"),
  	  TokenERC20.new(10000,"MOOLAH4","MOO4")
  	]).then( tokens => {
		  deployer.deploy(AnalystRegistry).then( () => {
	  		deployer.then( () => {
		  		RatingAgency.new(AnalystRegistry.address).then( instance => {
		  			console.log('rating agency instance',instance.address)
						tokens.map( token => {
							console.log('erc address',token.address)  		
							//instance.coverToken(token.address,0) do this when understand how to make it work
						})
		  		})	  			
	  		})
		  })
		})
  })
  */
}

