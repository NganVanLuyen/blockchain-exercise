const Web3 = require('web3');
require('dotenv').config({ path: '../.env' })

// const e20Abi = require("../build/contracts/E20TK.json");
// const e721Abi = require("../build/contracts/E721TK.json")
// const TradeAbi = require("../build/contracts/TradeToken.json");

const e20Abi = require("./contracts/E20TK.json");
const e721Abi = require("./contracts/E721TK.json")
const TradeAbi = require("./contracts/TradeToken.json");

const e20Address = process.env.E20_ADDRESS;
const e721Address = process.env.E721_ADDRESS;
const tradeAddress = process.env.TRADE_ADDRESS;

const provider = new Web3.providers.WebsocketProvider(process.env.WS_ROPSTEN);
var web3 = new Web3(provider);

const e20Contract = new web3.eth.Contract(e20Abi.abi, e20Address);
const e721Contract = new web3.eth.Contract(e721Abi.abi, e721Address);
const tradeContract = new web3.eth.Contract(TradeAbi.abi, tradeAddress);

const account = web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);

const askTradeERC20ForETH = async (ERC20Address, amount, priceOfPair) => {
    await e20Contract.methods.approve(tradeContract.options.address, amount).send({
        from: account.address,
        gas: 1500000,
    })
    await tradeContract.methods.askTradeERC20ForETH(ERC20Address, amount, priceOfPair).send({
        from: account.address,
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    })
        .on("receipt", receipt => {
            console.log("receipt: " + receipt);
        })
        .on("error", console.error);
}

const askTradeERC20ForERC721 = async (ERC20Address, ERC721Address, amount, NFTId) => {
    await e20Contract.methods.approve(tradeContract.options.address, amount).send({
        from: account.address,
        gas: 1500000,
    })
    await tradeContract.methods.askTradeERC20ForERC721(ERC20Address, ERC721Address, amount, NFTId).send({
        from: account.address,
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const askTradeETHForERC20 = async (tokenBAddress, amountETH, priceOfPair) => {
    await tradeContract.methods.askTradeETHForERC20(tokenBAddress, priceOfPair).send({
        from: account.address,
        gas: 1500000,
        value: web3.utils.toWei(amountETH.toString(), "ether")
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    })
        .on("receipt", receipt => {
            console.log("receipt: " + receipt);
        })
        .on("error", console.error);
}

const askTradeETHForERC721 = async (tokenBAddress, amountETH, NFTId) => {
    await tradeContract.methods.askTradeETHForERC721(tokenBAddress, NFTId).send({
        from: account.address,
        gas: 1500000,
        value: web3.utils.toWei(amountETH.toString(), "ether")
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    })
        .on("receipt", receipt => {
            console.log("receipt: " + receipt);
        })
        .on("error", console.error);
}

const askTradeE721ForERC20 = async (ERC721Address, ERC20Address, NFTId, PriceOfPair) => {
    await e721Contract.methods.approve(tradeContract.options.address, NFTId).send({
        from: account.address,
        gas: 1500000
    })
    await tradeContract.methods.askTradeE721ForERC20(ERC721Address, ERC20Address, NFTId, PriceOfPair).send({
        from: account.address,
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const askTradeE721ForETH = async (ERC721Address, NFTId, PriceOfPair) => {
    await e721Contract.methods.approve(tradeContract.options.address, NFTId).send({
        from: account.address,
        gas: 1500000
    })
    await tradeContract.methods.askTradeE721ForETH(ERC721Address, NFTId, PriceOfPair).send({
        from: account.address,
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

// ========================================== //

const bidTradeERC20ForETH = async (askId, amount) => {
    await tradeContract.methods.bidTradeERC20ForETH(askId).send({
        from: accounts[0].address,
        gas: 1500000,
        value: web3.utils.toWei(amount.toString(), "ether")
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const bidTradeERC20ForERC721 = async (askId, NFTId) => {
    await e721Contract.methods.approve(tradeContract.options.address, NFTId).send({
        from: account.address,
        gas: 1500000,
    })
    await tradeContract.methods.bidTradeERC20ForERC721(askId, NFTId).send({
        from: account.address,
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const bidTradeETHForERC20 = async (askId, amountERC20) => {
    await e20Contract.methods.approve(tradeContract.options.address, amountERC20).send({
        from: account.address,
        gas: 1500000,
    })
    await tradeContract.methods.bidTradeETHForERC20(askId, amountERC20).send({
        from: account.address,
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const bidTradeETHForERC721 = async (askId, NFTId) => {
    await e721Contract.methods.approve(tradeContract.options.address, NFTId).send({
        from: account.address,
        gas: 1500000,
    })
    await tradeContract.methods.bidTradeETHForERC721(askId, NFTId).send({
        from: account.address,
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const bidTradeE721ForERC20 = async (askId, amountERC20) => {
    await e20Contract.methods.approve(tradeContract.options.address, amountERC20).send({
        from: account.address,
        gas: 1500000,
    })
    await tradeContract.methods.bidTradeE721ForERC20(askId, amountERC20).send({
        from: account.address,
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const bidTradeE721ForETH = async (askId, amount) => {
    await tradeContract.methods.bidTradeE721ForETH(askId).send({
        from: account.address,
        gas: 1500000,
        value: web3.utils.toWei(amount.toString(), "ether")
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

// ========================================== //

const getBestPrice = async (tokenAAddress, tokenBAddress) => {
    return await tradeContract.methods.getBestPrice(tokenAAddress, tokenBAddress).call()
        .then(res => { return console.log("Best Price Of Pair: " + res) });
}

const createPrivateKey = async () => {
    return await web3.eth.accounts.create();
};

const createMultiplePrivateKey = async (amountAccount) => {
    return await web3.eth.accounts.wallet.create(amountAccount);
}

const createAccountWallet = async (privateKey) => {
    return await web3.eth.accounts.wallet.add(privateKey);
}

// ========================================== //

const getBalances = async () => {
    await web3.eth.getBalance(account.address).then(data => console.log("ETH1: " + web3.utils.fromWei(data, 'ether')));
    await e721Contract.methods.balanceOf(account.address).call().then(data => console.log("NFT: " + data));
    await e20Contract.methods.balanceOf(account.address).call().then(data => console.log("E20: " + web3.utils.fromWei(data, 'ether')));
    // await e721Contract.methods.ownerOf(4).call().then(data => console.log("NFT owner: " + data));
}

const getAskEvent = async (tokenA, tokenB) => {
    await tradeContract.getPastEvents("NewAsk", {
        filter: { tokenA: tokenA, tokenB: tokenB },
        fromBlock: 0,
        toBlock: 'latest'
    })
        .then(events => {
            events.forEach(element => {
                let amount;
                if (element.returnValues.tokenA == e721Address) {
                    amount = 1
                } else {
                    amount = web3.utils.fromWei(element.returnValues.amount, 'ether');
                }
                console.log("Id: " + element.returnValues.askId +
                    "\t amount: " + amount +
                    "\t priceOfPair: " + web3.utils.fromWei(element.returnValues.priceOfPair, 'ether'));
            });
        })
}
const getAks = async () => {
    await tradeContract.methods.getAsk().call().then(data => {
        let tokenA, tokenB;
        for (let i = 0; i < data.length; i++) {
            if (data[i].amount > 0) {
                if (data[i].tokenA == e20Address) {
                    tokenA = "E20";
                } else if (data[i].tokenA == e721Address) {
                    tokenA = "E721";
                } else {
                    tokenA = "ETH";
                }
                if (data[i].tokenB == e20Address) {
                    tokenB = "E20";
                } else if (data[i].tokenB == e721Address) {
                    tokenB = "E721";
                } else {
                    tokenB = "ETH";
                }

                if (data[i].tokenA == e721Address) {
                    amount = 1
                } else {
                    amount = web3.utils.fromWei(data[i].amount, 'ether');
                }
                console.log("ID: " + i + "\tTrade: " + tokenA + " - " + tokenB +
                    "\tCurrent amount: " + amount +
                    "\tprice: " + web3.utils.fromWei(data[i].priceOfPair, 'ether') +
                    "\t NFTId: " + data[i].NFTId);

            }
        }
    });
}

module.exports = {
    getBalances: getBalances,
    getAks: getAks,
    getAskEvent: getAskEvent,

    askTradeERC20ForETH: askTradeERC20ForETH,
    askTradeERC20ForERC721: askTradeERC20ForERC721,
    askTradeETHForERC20: askTradeETHForERC20,
    askTradeETHForERC721: askTradeETHForERC721,
    askTradeE721ForERC20: askTradeE721ForERC20,
    askTradeE721ForETH: askTradeE721ForETH,

    bidTradeERC20ForETH: bidTradeERC20ForETH,
    bidTradeERC20ForERC721: bidTradeERC20ForERC721,
    bidTradeETHForERC20: bidTradeETHForERC20,
    bidTradeETHForERC721: bidTradeETHForERC721,
    bidTradeE721ForERC20: bidTradeE721ForERC20,
    bidTradeE721ForETH: bidTradeE721ForETH,

    getBestPrice: getBestPrice,
    createPrivateKey: createPrivateKey,
    createMultiplePrivateKey: createMultiplePrivateKey,
    createAccountWallet: createAccountWallet,
};