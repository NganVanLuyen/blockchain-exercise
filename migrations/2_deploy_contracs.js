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
        // e20 = await E20TK.deployed();
        // e721 = await E721TK.deployed();
        // trade = await TradeToken.deployed();
        // console.log('E20TK address: ' + e20.address);
        // console.log('E721 address: ' + e721.address);
        // console.log('Trade address: ' + trade.address);
    }
}

