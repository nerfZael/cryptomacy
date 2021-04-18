const Cryptomacy = artifacts.require("Cryptomacy");

module.exports = function(deployer) {
  deployer.deploy(Cryptomacy);
};
