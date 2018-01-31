var TokenERC20 = artifacts.require("TokenERC20")
var AnalystRegistry = artifacts.require("AnalystRegistry")
var RatingAgency = artifacts.require("RatingAgency")

module.exports = function(deployer) {
  deployer.deploy(TokenERC20)
  deployer.deploy(AnalystRegistry)
  deployer.deploy(RatingAgency)
}

