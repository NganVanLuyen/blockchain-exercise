require('dotenv').config({ path: '../.env' });
var readlineSync = require('readline-sync');

var trade = require('./app.js');

const e20Address = process.env.E20_ADDRESS;
const e721Address = process.env.E721_ADDRESS;
const ethAddress = process.env.ETH_ADDRESS;

function showCmd() {
    console.log('Options:\n\t1. getBalances\t 2. getAskEvent\t 3. getAks\t 4. getBestPrice\n');
    console.log('Accounts:\n\t5. createPrivateKey\t 6. createMultiplePrivateKey\t 7. createAccountWallet\n');
    console.log('Ask Trade:\n\t8. askTradeERC20ForETH\t 9. askTradeERC20ForERC721\t 10. askTradeETHForERC20\n\t11. askTradeETHForERC721\t 12. askTradeE721ForERC20\t 13. askTradeE721ForETH\n');
    console.log('Bid Token:\n\t14. bidTradeERC20ForETH\t 15. bidTradeERC20ForERC721\t 16. bidTradeETHForERC20\n\t17. bidTradeETHForERC721\t 18. bidTradeE721ForERC20\t 19. bidTradeE721ForETH');
    console.log('\n\t0. Exit\t00.Help');
}

async function selectCase(option) {
    switch (option) {
        case '0':
            break;
        case '00':
            showCmd();
            showMenu();
            break;
        case '1':
            await trade.getBalances();
            showMenu();
            break;
        case '2':
            console.log("E20: " + e20Address + " E721: " + e721Address + " ETH: " + ethAddress);
            var TokenA = (readlineSync.question('TokenA: '));
            var TokenB = (readlineSync.question('TokenB: '));
            await trade.getAskEvent(TokenA, TokenB);
            showMenu();
            break;
        case '3':
            await trade.getAks();
            showMenu();
            break;
        case '4':
            console.log("E20: " + e20Address + " E721: " + e721Address + " ETH: " + ethAddress);
            var TokenA = (readlineSync.question('TokenA: '));
            var TokenB = (readlineSync.question('TokenB: '));
            await trade.getBestPrice(TokenA, TokenB);
            showMenu();
            break;
        case '5':
            await trade.createPrivateKey();
            showMenu();
            break;
        case '6':
            var amount = (readlineSync.question('amount: '));
            console.log(amount);
            await trade.createMultiplePrivateKey(amount);
            showMenu();
            break;
        case '7':
            var privateKey = (readlineSync.question('privateKey: '));
            console.log(privateKey);
            await trade.createAccountWallet(privateKey);
            showMenu();
            break;

        case '8':
            var amount = (readlineSync.question('amount: ') * (10 ** 18)).toString();
            var priceOfPair = (readlineSync.question('price: '));
            console.log(amount + " " + priceOfPair);
            trade.askTradeERC20ForETH(e20Address, amount, priceOfPair);
            showMenu();
            break;
        case '9':
            var amount = (readlineSync.question('amount: ') * (10 ** 18)).toString();
            var NFTId = (readlineSync.question('NFTId: '));
            console.log(amount + " " + NFTId);
            trade.askTradeERC20ForERC721(e20Address, e721Address, amount, NFTId);
            showMenu();
            break;
        case '10':
            var amount = (readlineSync.question('amount: ') * (10 ** 18)).toString();
            var priceOfPair = (readlineSync.question('price: '));
            console.log(amount + " " + priceOfPair);
            trade.askTradeETHForERC20(e20Address, amount, priceOfPair);
            showMenu();
            break;
        case '11':
            var amount = (readlineSync.question('amount: ') * (10 ** 18)).toString();
            var NFTId = (readlineSync.question('NFTId: '));
            console.log(amount + " " + NFTId);
            trade.askTradeETHForERC721(e721Address, amount, NFTId);
            showMenu();
            break;
        case '12':
            var NFTId = (readlineSync.question('NFTId: ') * (10 ** 18)).toString();
            var priceOfPair = (readlineSync.question('price: '));
            console.log(NFTId + " " + priceOfPair);
            trade.askTradeE721ForERC20(e721Address, e20Address, NFTId, priceOfPair);
            showMenu();
            break;
        case '13':
            var NFTId = (readlineSync.question('NFTId: ') * (10 ** 18)).toString();
            var priceOfPair = (readlineSync.question('price: '));
            console.log(NFTId + " " + priceOfPair);
            trade.askTradeE721ForETH(e721Address, NFTId, priceOfPair);
            showMenu();
            break;

        case '14':
            var askId = (readlineSync.question('askId: '));
            var amount = (readlineSync.question('amount: '));
            console.log(askId + " " + amount);
            trade.bidTradeERC20ForETH(askId, amount);
            showMenu();
            break;
        case '15':
            var askId = (readlineSync.question('askId: '));
            var NFTId = (readlineSync.question('NFTId: '));
            console.log(askId + " " + NFTId);
            trade.bidTradeERC20ForERC721(askId, NFTId);
            showMenu();
            break;
        case '16':
            var askId = (readlineSync.question('askId: '));
            var amount = (readlineSync.question('amount: ') * (10 ** 18)).toString();
            console.log(askId + " " + amount);
            trade.bidTradeETHForERC20(askId, amount);
            showMenu();
            break;
        case '17':
            var askId = (readlineSync.question('askId: '));
            var NFTId = (readlineSync.question('NFTId: '));
            console.log(askId + " " + NFTId);
            trade.bidTradeETHForERC721(askId, NFTId);
            showMenu();
            break;
        case '18':
            var askId = (readlineSync.question('askId: '));
            var amount = (readlineSync.question('amount: ') * (10 ** 18)).toString();
            console.log(askId + " " + amount);
            trade.bidTradeE721ForERC20(askId, amount);
            showMenu();
            break;
        case '19':
            var askId = (readlineSync.question('askId: '));
            var amount = (readlineSync.question('amount: ') * (10 ** 18)).toString();
            console.log(askId + " " + amount);
            trade.bidTradeE721ForETH(askId, amount);
            showMenu();
            break;

        default:
            console.log('Invalid option');
            showMenu();
    }
}

function showMenu() {
    var option = readlineSync.question('> ');
    selectCase(option);
}

function main() {
    showCmd();
    showMenu();
}

main()
