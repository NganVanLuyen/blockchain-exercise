const Web3 = require('web3');
// require('dotenv').config();
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
var addresses = ["0xa534A79d4aF09acc9964F38d481B52e76d54B901", "0x6d9D9f469F72AfE71fE06383aaD9015a33D320E4"];

var e20Contract, e721Contract, tradeContract;
const provider = new Web3.providers.WebsocketProvider(process.env.WS_ROPSTEN);
var web3 = new Web3(provider);

e20Contract = new web3.eth.Contract(e20Abi.abi, e20Address);
e721Contract = new web3.eth.Contract(e721Abi.abi, e721Address);
tradeContract = new web3.eth.Contract(TradeAbi.abi, tradeAddress);

signer = web3.eth.accounts.wallet.add("450c15d7b29c51d0b29e4aee0fa89b5d9c843d25ba6011685983292755517eb4");

const getBalances = async () => {
    // await web3.eth.getBalance("0xa534A79d4aF09acc9964F38d481B52e76d54B901").then(data => console.log("ETH0: " + web3.utils.fromWei(data, 'ether')));
    await web3.eth.getBalance(addresses[1]).then(data => console.log("ETH1: " + web3.utils.fromWei(data, 'ether')));

    // await e721Contract.methods.balanceOf(addresses[0]).call().then(data => console.log("NFT0: " + data));
    // await e721Contract.methods.balanceOf(addresses[1]).call().then(data => console.log("NFT1: " + data));

    // await e20Contract.methods.balanceOf("0xa534A79d4aF09acc9964F38d481B52e76d54B901").call().then(data => console.log("E200: " + web3.utils.fromWei(data, 'ether')));
    await e20Contract.methods.balanceOf(addresses[1]).call().then(data => console.log("E201: " + web3.utils.fromWei(data, 'ether')));

    // await tradeContract.methods.asks(0).call().then(data => {
    //     console.log(data);
    // })
    console.log("Start: " + tradeContract.options.address);
}
getBalances();

const mintToken = async () => {
    // await e20Contract.methods.mint("0xa534A79d4aF09acc9964F38d481B52e76d54B901", 10);
    // await e20Contract.methods.balanceOf("0xa534A79d4aF09acc9964F38d481B52e76d54B901").call().then(data => console.log("E200: " + web3.utils.fromWei(data, 'ether')));

    // .send({ from: "0xa534A79d4aF09acc9964F38d481B52e76d54B901", gas: 1500000 });
    // await e20Contract.methods.mint(addresses[1], 10).send({ from: addresses[1], gas: 1500000 });

    // await e721Contract.methods.mintNFT(addresses[1], 'hello').send({ from: addresses[0], gas: 1500000 });
    // await e721Contract.methods.mintNFT(addresses[0], 'VN').send({ from: addresses[0], gas: 1500000 });

    console.log("done mint")
}

// mintToken();

const getAskEvent = async (tokenA, tokenB) => {
    await tradeContract.getPastEvents("NewAsk", {
        filter: { tokenA: tokenA, tokenB: tokenB },
        fromBlock: 0,
        toBlock: 'latest'
    })
        .then(events => {
            events.forEach(element => {
                // console.log(element.returnValues);
                console.log("Id: " + element.returnValues.askId +
                    "\t amount: " + web3.utils.fromWei(element.returnValues.amount, 'ether') +
                    "\t priceOfPair: " + element.returnValues.priceOfPair);
            });
        })
}
// getAskEvent(e20Address, "0x0000000000000000000000000000000000000000");
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
                console.log("Id: " + i + "\tTrade: " + tokenA + " - " + tokenB +
                    "\tCurrent amount: " + web3.utils.fromWei(data[i].amount, 'ether') +
                    "\tprice: " + web3.utils.fromWei(data[i].amount, 'ether') +
                    "\t NFTId: " + data[i].NFTId);

            }
        }
    });
}
getAks();

// ========================================== //

const askTradeERC20ForETH = async (ERC20Address, amount, priceOfPair) => {
    await e20Contract.methods.approve(tradeContract.options.address, amount).send({
        from: signer.address,
        gas: 1500000,
    })
    await tradeContract.methods.askTradeERC20ForETH(ERC20Address, amount, priceOfPair).send({
        from: signer.address,
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    })
        .on("receipt", receipt => {
            console.log("receipt: " + receipt);
        })
        .on("error", console.error);

    // let e20x = await e20.balanceOf(tradeContract.options.address);
    // e20x = web3.utils.fromWei(e20x, 'ether');
    // console.log('askTradeERC20ForETH = ' + e20x);
}

const askTradeERC20ForERC721 = async (ERC20Address, ERC721Address, amount, NFTId) => {
    await e20Contract.methods.approve(tradeContract.options.address, amount).send({
        from: addresses[0],
        gas: 1500000,
    })
    await tradeContract.methods.askTradeERC20ForERC721(ERC20Address, ERC721Address, amount, NFTId).send({
        from: addresses[0],
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const askTradeETHForERC20 = async (tokenBAddress, amountETH, priceOfPair) => {
    await tradeContract.methods.askTradeETHForERC20(tokenBAddress, priceOfPair).send({
        from: addresses[0],
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
        from: addresses[0],
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
        from: addresses[1],
        gas: 1500000
    })
    await tradeContract.methods.askTradeE721ForERC20(ERC721Address, ERC20Address, NFTId, PriceOfPair).send({
        from: addresses[1],
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const askTradeE721ForETH = async (ERC721Address, NFTId, PriceOfPair) => {
    await e721Contract.methods.approve(tradeContract.options.address, NFTId).send({
        from: addresses[1],
        gas: 1500000
    })
    await tradeContract.methods.askTradeE721ForETH(ERC721Address, NFTId, PriceOfPair).send({
        from: addresses[1],
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
        from: addresses[1],
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
        from: addresses[1],
        gas: 1500000,
    })
    await tradeContract.methods.bidTradeERC20ForERC721(askId, NFTId).send({
        from: addresses[1],
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const bidTradeETHForERC20 = async (askId, amountERC20) => {
    await e20Contract.methods.approve(tradeContract.options.address, amountERC20).send({
        from: addresses[1],
        gas: 1500000,
    })
    await tradeContract.methods.bidTradeETHForERC20(askId, amountERC20).send({
        from: addresses[1],
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const bidTradeETHForERC721 = async (askId, NFTId) => {
    await e721Contract.methods.approve(tradeContract.options.address, NFTId).send({
        from: addresses[1],
        gas: 1500000,
    })
    await tradeContract.methods.bidTradeETHForERC721(askId, NFTId).send({
        from: addresses[1],
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const bidTradeE721ForERC20 = async (askId, amountERC20) => {
    await e20Contract.methods.approve(tradeContract.options.address, amountERC20).send({
        from: addresses[0],
        gas: 1500000,
    })
    await tradeContract.methods.bidTradeE721ForERC20(askId, amountERC20).send({
        from: addresses[0],
        gas: 1500000,
    }).on("transactionHash", hash => {
        console.log("Transaction hash: " + hash);
    }).on("receipt", receipt => {
        console.log("receipt: " + receipt);
    }).on("error", console.error);
}

const bidTradeE721ForETH = async (askId, amount) => {
    // await e721Contract.methods.approve(tradeContract.options.address, amountERC20).send({
    //     from: addresses[0],
    //     gas: 1500000,
    // })
    await tradeContract.methods.bidTradeE721ForETH(askId).send({
        from: addresses[0],
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
    return await tradeContract.methods.getBestPrice(tokenAAddress, tokenBAddress).call().then(res => { return console.log(res) });
}
// getBestPrice(e20Address, "0x0000000000000000000000000000000000000000");

const runContract = async () => {
    let amountERC20 = (2 * (10 ** 18)).toString();
    // const a = amount.toString();
    // console.log(amountERC20);

    await askTradeERC20ForETH(e20Address, amountERC20, 2);
    // await askTradeERC20ForETH(e20Address, amountERC20, 2);
    // await askTradeERC20ForETH(e20Address, amountERC20, 3);
    // await askTradeERC20ForETH(e20Address, amountERC20, 4);
    // await bidTradeERC20ForETH(1, 16);
    // await askTradeETHForERC20(e20Address, 10, 2);
    // await bidTradeETHForERC20(0, amountERC20);
    // await askTradeERC20ForERC721(e20Address, e721Address, amountERC20, 1);
    // await bidTradeERC20ForERC721(0, 1);
    // await askTradeETHForERC721(e721Address, 10, 1);
    // await bidTradeETHForERC721(0, 1);
    // await askTradeE721ForERC20(e721Address, e20Address, 1, amountERC20);
    // await bidTradeE721ForERC20(0, amountERC20);
    // await askTradeE721ForETH(e721Address, 1, 10);
    // await bidTradeE721ForETH(0, 10);
}

// runContract();

const createPrivateKey = async () => {
    return await web3.eth.accounts.create();
};

// createPrivateKey().then(res => {
//     console.log(res);
// });

// web3.eth.getBalance(addresses[1]).then(data => console.log("ETH1: " + web3.utils.fromWei(data, 'ether')));






