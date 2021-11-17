const E20TK = artifacts.require("E20TK.sol");
const E721TK = artifacts.require("E721TK.sol");
const TradeToken = artifacts.require("TradeToken.sol");

module.exports = async function (deployer, network, addresses) {
    if (network === 'ropsten') {
        await deployer.deploy(E20TK);
        await deployer.deploy(E721TK);
        await deployer.deploy(TradeToken);
    } else {
        await deployer.deploy(E20TK);
        await deployer.deploy(E721TK);
        await deployer.deploy(TradeToken);
    }
}

