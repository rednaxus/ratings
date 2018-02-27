var TokenERC20 = artifacts.require("TokenERC20")
var AnalystRegistry = artifacts.require("AnalystRegistry")
var RatingAgency = artifacts.require("RatingAgency")

module.exports = function(deployer) {
  deployer.deploy(TokenERC20,10000,"dummy_name","dummy_token")
  deployer.deploy(AnalystRegistry).then( () => {
  	deployer.deploy(RatingAgency,AnalystRegistry.address)
  })

}

