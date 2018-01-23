var Ownable = artifacts.require("Ownable");
var Killable = artifacts.require("Killable");
var Authentication = artifacts.require("Authentication");
var Aleph = artifacts.require("Aleph");
var Registry = artifacts.require("Registry");
var RatingAgency = artifacts.require("RatingAgency");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.link(Ownable, Killable);
  deployer.deploy(Killable);
  deployer.link(Killable, Authentication);
  deployer.deploy(Authentication);
  deployer.deploy(Aleph);
  deployer.link(Aleph,Registry);
  deployer.deploy(Registry);
  deployer.link(Aleph,RatingAgency);
  deployer.deploy(RatingAgency);
};

