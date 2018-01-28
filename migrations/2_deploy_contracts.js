//var Ownable = artifacts.require("Ownable")
//var Killable = artifacts.require("Killable")
//var Authentication = artifacts.require("Authentication")
var TokenERC20 = artifacts.require("TokenERC20")
var Aleph = artifacts.require("Aleph")
var AnalystRegistry = artifacts.require("AnalystRegistry")
var RatingAgency = artifacts.require("RatingAgency")

module.exports = function(deployer) {
  deployer.deploy(TokenERC20)
  //deployer.deploy(Ownable)
  //deployer.link(Ownable, Killable)
  //deployer.deploy(Killable)
  //deployer.link(Killable, Authentication)
  //deployer.deploy(Authentication)
  deployer.deploy(Aleph)
  deployer.link(Aleph,AnalystRegistry)
  deployer.deploy(AnalystRegistry)
  deployer.link(Aleph,RatingAgency)
  deployer.deploy(RatingAgency)
}

