# blockchain-exercise

1. Smart contract
   - Description: A smart contract to handle trading between different types of assets ETH, ERC20, ERC721
   - Must be deploy on Ropsten and verified.
   - Have the source code push to github for testing
   - Core function: + Ask: A user (asker) create a request to trade one asset to another, sending the amount of asset they one to trade into the contract. Input: types of asset one to trade, amount of the asset one to trade, price of the asset pair + BestPrice: Get the best price of an asset pair + Bid: A user (bidder) create a request to accept the ask request of other user and execute the trade. Input: Ask request id, amount of asset the bidder want to trade.

2. DApp
- A node.js console app that using Web3 to interact with Ethereum blockchain and it’s smart contract.
- Can select any network to run (Kovan, Ropsten, PoA Private network).
- Can hold and create multiple addresses and private keys from the app.
- Can sign transaction offline.
- When online and connect to the Ethereum network, can use all of the functions from the smart contract above
