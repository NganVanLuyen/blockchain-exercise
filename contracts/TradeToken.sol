// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./E20TK.sol";
import "./E721TK.sol";

contract TradeToken is E20TK, E721TK{
    event NewAsk(
        uint256 indexed askId,
        address indexed tokenA,
        address indexed tokenB,
        uint256 amount,
        uint256 priceOfPair,
        uint256 NFTId
    );
    event NewBid(uint256 indexed bidId, uint256 askId, uint256 amountTrade);

    struct Ask {
        address tokenA;
        address tokenB;
        uint256 amount; //Amount of tokenA used for trading
        uint256 priceOfPair;
        uint256 NFTId;
    }
    struct Bid {
        uint256 askId;
        uint256 amount; //Amount of tokenB
        uint256 amountTrade;
    }
    Ask[] public asks;
    Bid[] public bids;

    mapping(uint256 => address) public askToOwner;
    mapping(address => uint256) public ownerAskCount;
    mapping(uint256 => address) public bidToOwner;
    mapping(address => uint256) public ownerBidCount;

    function getAsk() external view returns (Ask[] memory) {
        return asks;
    }

    // Ask:  A user (asker) create a request to trade one asset to another,
    // sending the amount of asset they one to trade into the contract.
    // Input: types of asset one to trade, amount of the asset one to trade, price of the asset pair: TokenA = xTokenB
    function askTradeERC20ForETH(
        address _tokenA,
        uint256 _amount,
        uint256 _priceOfPair
    ) external returns (uint256) {
        require(
            _amount <= E20TK(_tokenA).allowance(msg.sender, address(this)),
            "remaining number of tokens allowed to spend less than amount"
        );
        E20TK(_tokenA).transferFrom(msg.sender, address(this), _amount);
        uint256 id = asks.length;
        asks.push(Ask(_tokenA, address(0), _amount, _priceOfPair, 0));

        askToOwner[id] = msg.sender;
        ownerAskCount[msg.sender]++;

        emit NewAsk(id, _tokenA, address(0), _amount, _priceOfPair, 0);
        return id;
    }

    function askTradeERC20ForERC721(
        address _tokenA,
        address _tokenB,
        uint256 _amount,
        uint256 _NFTId
    ) external returns (uint256) {
        require(
            _amount <= E20TK(_tokenA).allowance(msg.sender, address(this)),
            "remaining number of tokens allowed to spend less than amount"
        );
        E20TK(_tokenA).transferFrom(msg.sender, address(this), _amount);
        uint256 id = asks.length;
        asks.push(Ask(_tokenA, _tokenB, _amount, _amount, _NFTId));

        askToOwner[id] = msg.sender;
        ownerAskCount[msg.sender]++;

        emit NewAsk(id, _tokenA, _tokenB, _amount, _amount, _NFTId);
        return id;
    }

    function askTradeETHForERC20(address _tokenB, uint256 _priceOfPair)
        external
        payable
        returns (uint256 id)
    {
        require(msg.value >= 0, "ETH to trade must be greater than 0");
        id = asks.length;
        asks.push(Ask(address(0), _tokenB, msg.value, _priceOfPair, 0));

        askToOwner[id] = msg.sender;
        ownerAskCount[msg.sender]++;

        emit NewAsk(id, address(0), _tokenB, msg.value, _priceOfPair, 0);
        return id;
    }

    function askTradeETHForERC721(address _tokenB, uint256 _NFTId)
        external
        payable
        returns (uint256 id)
    {
        require(msg.value >= 0, "ETH to trade must be greater than 0");
        id = asks.length;
        asks.push(Ask(address(0), _tokenB, msg.value, msg.value, _NFTId));

        askToOwner[id] = msg.sender;
        ownerAskCount[msg.sender]++;

        emit NewAsk(id, address(0), _tokenB, msg.value, msg.value, _NFTId);
        return id;
    }

    function askTradeE721ForERC20(
        address _tokenA,
        address _tokenB,
        uint256 _NFTId,
        uint256 _priceOfPair
    ) external returns (uint256 id) {
        E721TK(_tokenA).transferFrom(msg.sender, address(this), _NFTId);
        id = asks.length;
        asks.push(Ask(_tokenA, _tokenB, 1, _priceOfPair, _NFTId));

        askToOwner[id] = msg.sender;
        ownerAskCount[msg.sender]++;

        emit NewAsk(id, _tokenA, _tokenB, 1, _priceOfPair, _NFTId);
        return id;
    }

    function askTradeE721ForETH(
        address _tokenA,
        uint256 _NFTId,
        uint256 _priceOfPair
    ) external returns (uint256 id) {
        E721TK(_tokenA).transferFrom(msg.sender, address(this), _NFTId);
        id = asks.length;
        asks.push(Ask(_tokenA, address(0), 1, _priceOfPair, _NFTId));

        askToOwner[id] = msg.sender;
        ownerAskCount[msg.sender]++;

        emit NewAsk(id, _tokenA, address(0), 1, _priceOfPair, _NFTId);
        return id;
    }

    // A user (bidder) create a request to accept the ask request of other user and execute the trade.
    // Input: Ask request id, amount of asset the bidder want to trade.
    function bidTradeERC20ForETH(uint256 _askId)
        external
        payable
        returns (uint256 id)
    {
        require(
            _askId < asks.length && asks[_askId].amount > 0 && msg.value > 0
        );

        uint256 amountETH = asks[_askId].amount * asks[_askId].priceOfPair;
        uint256 amountERC20 = msg.value / asks[_askId].priceOfPair;
        address payable _toAsk = payable(askToOwner[_askId]);

        require(
            msg.value <= amountETH,
            "amount bid must be less than or equal to the ask amount"
        );

        _toAsk.transfer(msg.value); //Transfer ETH to asker
        E20TK(asks[_askId].tokenA).transfer(msg.sender, amountERC20); //Transfer ERC20 to bidder

        asks[_askId].amount -= amountERC20; //Update ask amount

        id = bids.length;
        bids.push(Bid(_askId, msg.value, amountERC20));
        bidToOwner[_askId] = msg.sender;
        ownerBidCount[msg.sender]++;

        emit NewBid(id, _askId, msg.value);
        return id;
    }

    function bidTradeERC20ForERC721(uint256 _askId, uint256 _NFTId)
        external
        payable
        returns (uint256 id)
    {
        address payable _toAsk = payable(askToOwner[_askId]);
        require(_askId < asks.length && asks[_askId].amount > 0);

        E721TK(asks[_askId].tokenB).transferFrom(msg.sender, _toAsk, _NFTId);
        E20TK(asks[_askId].tokenA).transfer(
            msg.sender,
            asks[_askId].priceOfPair
        );

        asks[_askId].amount = 0;

        id = bids.length;
        bids.push(Bid(_askId, 1, asks[_askId].priceOfPair));
        bidToOwner[_askId] = msg.sender;
        ownerBidCount[msg.sender]++;

        emit NewBid(id, _askId, 1);

        return id;
    }

    function bidTradeETHForERC20(uint256 _askId, uint256 _amount)
        external
        payable
        returns (uint256 id)
    {
        require(_askId < asks.length && asks[_askId].amount > 0 && _amount > 0);
        require(
            _amount <=
                E20TK(asks[_askId].tokenB).allowance(msg.sender, address(this)),
            "remaining number of tokens allowed to spend less than amount"
        );

        uint256 amountERC20Ask = asks[_askId].amount * asks[_askId].priceOfPair;
        uint256 amountETHBid = _amount / asks[_askId].priceOfPair;
        address payable _toAsk = payable(askToOwner[_askId]);

        require(
            _amount <= amountERC20Ask,
            "amount bid must be less than or equal to the ask amount"
        );

        payable(msg.sender).transfer(amountETHBid);
        E20TK(asks[_askId].tokenB).transferFrom(msg.sender, _toAsk, _amount);

        asks[_askId].amount -= amountETHBid;

        id = bids.length;
        bids.push(Bid(_askId, _amount, amountETHBid));
        bidToOwner[_askId] = msg.sender;
        ownerBidCount[msg.sender]++;

        emit NewBid(id, _askId, _amount);
        return id;
    }

    function bidTradeETHForERC721(uint256 _askId, uint256 _NFTId)
        public
        payable
        returns (uint256 id)
    {
        address payable _toAsk = payable(askToOwner[_askId]);
        require(_askId <= asks.length && asks[_askId].amount > 0);

        E721TK(asks[_askId].tokenB).transferFrom(msg.sender, _toAsk, _NFTId);
        payable(msg.sender).transfer(asks[_askId].amount);

        asks[_askId].amount = 0;

        id = bids.length;
        bids.push(Bid(_askId, 1, asks[_askId].priceOfPair));
        bidToOwner[_askId] = msg.sender;
        ownerBidCount[msg.sender]++;

        emit NewBid(id, _askId, 1);
        return id;
    }

    function bidTradeE721ForERC20(uint256 _askId, uint256 _amount)
        public
        payable
        returns (uint256 id)
    {
        address payable _toAsk = payable(askToOwner[_askId]);
        require(_askId < asks.length && asks[_askId].amount > 0 && _amount > 0);

        E20TK(asks[_askId].tokenB).transferFrom(msg.sender, _toAsk, _amount);
        E721TK(asks[_askId].tokenA).transferFrom(
            address(this),
            msg.sender,
            asks[_askId].NFTId
        );

        asks[_askId].amount = 0;

        id = bids.length;
        bids.push(Bid(_askId, _amount, asks[_askId].NFTId));
        bidToOwner[_askId] = msg.sender;
        ownerBidCount[msg.sender]++;

        emit NewBid(id, _askId, _amount);
        return id;
    }

    function bidTradeE721ForETH(uint256 _askId)
        public
        payable
        returns (uint256 id)
    {
        address payable _toAsk = payable(askToOwner[_askId]);
        require(
            _askId < asks.length && asks[_askId].amount > 0 && msg.value > 0
        );

        _toAsk.transfer(msg.value);
        E721TK(asks[_askId].tokenA).transferFrom(
            address(this),
            msg.sender,
            asks[_askId].NFTId
        );

        asks[_askId].amount = 0;

        id = bids.length;
        bids.push(Bid(_askId, asks[_askId].priceOfPair, 1));
        bidToOwner[_askId] = msg.sender;
        ownerBidCount[msg.sender]++;

        emit NewBid(id, _askId, msg.value);
        return id;
    }

    // BestPrice: Get the best price of an asset pair
    function getBestPrice(address _tokenA, address _tokenB)
        external
        view
        returns (uint256 bestPrice)
    {
        bestPrice = 2**256 - 1;
        for (uint256 i = 0; i < asks.length; i++) {
            if (asks[i].tokenA == _tokenA && asks[i].tokenB == _tokenB) {
                if (asks[i].priceOfPair < bestPrice)
                    bestPrice = asks[i].priceOfPair;
            }
        }
        return bestPrice;
    }
}
