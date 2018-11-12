var GasStation = artifacts.require("./GasStation.sol");

module.exports = (deployer) => {
  deployer.deploy(GasStation);
}