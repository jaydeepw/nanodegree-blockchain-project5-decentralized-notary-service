pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

    struct Star {
        string name;
        string symbol;
    }

    // Add a name and a symbol for your starNotary tokens
    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, uint256 _tokenId) public {
        // give a symbol to star
        Star memory newStar = Star(_name, "JSTAR");
        // Star memory newStar = Star(_name);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }

    /**
     * Add a function lookUptokenIdToStarInfo,
     * that looks up the stars using the Token ID, 
     * and then returns the name of the star.
     */
    function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns(string)  {
        // No require as anyone can lookup the star of
        // their interest
        Star memory star = tokenIdToStarInfo[_tokenId];
        return star.name;
    }

    /**
    * Add a function called exchangeStars, so 2 users can exchange their star tokens.
    * Do not worry about the price, just write code to exchange stars between users.
    * Return true if exchange was successful. false otherwise.
    */
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public payable {

        address user1 = ownerOf(_tokenId1);
        address user2 = ownerOf(_tokenId2);
        // remove entries of star ownership from
        // the record completely
        _removeTokenFrom(user1, _tokenId1);
        _removeTokenFrom(user2, _tokenId2);

        // add the entries for the tokens to swapped
        // addresses 1->2 and 2->1
        _addTokenTo(user1, _tokenId2);
        _addTokenTo(user2, _tokenId1);
    }

    function transferStar(address toAddress, uint256 _tokenId) public payable {
        address starOwner = ownerOf(_tokenId);
        require(msg.sender == starOwner);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(toAddress, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0;
    }

// Write a function to Transfer a Star. The function should transfer a star from the address of the caller.
// The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.
//

}
