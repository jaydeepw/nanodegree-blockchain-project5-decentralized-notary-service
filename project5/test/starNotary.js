//import 'babel-polyfill';
const StarNotary = artifacts.require('./starNotary.sol')

let instance;
let accounts;

contract('StarNotary', async (accs) => {
    accounts = accs;
    instance = await StarNotary.deployed();
  });

/*   it('Can transferStar to another address', async() => {
    let tokenId = 9;
    let givenName = 'Jays star'
    let fromAddress = accounts[0]
    let toAddress = accounts[1]
    await instance.createStar(givenName, tokenId, {from: fromAddress})
    console.log("Star: " + givenName + " Owner: " + fromAddress)
    await instance.transferStar(toAddress, tokenId)
    let possiblyNewOwner = await instance.ownerOf.call(starId)
    assert.equal(possiblyNewOwner, toAddress);
  }); */
  
  it('Can exchange stars between 2 users', async() => {
    let tokenId1 = 6
    let tokenId2 = 7
    let givenName1 = "Star1"
    let givenName2 = "Star2"
    let account1 = accounts[1]
    let account2 = accounts[2]

    await instance.createStar(givenName1, tokenId1, {from: account1})
    await instance.createStar(givenName2, tokenId2, {from: account2})

    // Before exchange
    /* let star1 = await instance.tokenIdToStarInfo.call(tokenId1);
    let star2 = await instance.tokenIdToStarInfo.call(tokenId2); */
    let address1 = await instance.ownerOf.call(tokenId1)
    let address2 = await instance.ownerOf.call(tokenId2)

    // console.log(tokenId1 + " ==> " + address1)
    // console.log(tokenId2 + " ==> " + address2)

    await instance.exchangeStars(tokenId1, tokenId2)
    
    // Before exchange
    let expectedAddress1 = await instance.ownerOf.call(tokenId2)
    let expectedAddress2 = await instance.ownerOf.call(tokenId1)

    // console.log(tokenId1 + " ==> " + address1)
    // console.log(tokenId2 + " ==> " + address2)
    assert.equal(expectedAddress1, address1)
    assert.equal(expectedAddress2, address2)
  });

  it('Can lookUptokenIdToStarInfo and return the name', async() => {
    let tokenId = 8;
    let givenName = 'Jays star'
    await instance.createStar(givenName, tokenId, {from: accounts[0]})
    let expectedName = await instance.lookUptokenIdToStarInfo(tokenId)
    // console.log("expectedName: " + expectedName)
    assert.equal(expectedName, givenName)
  });

  it('can Create a Star', async() => {
    let tokenId = 1;
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    let star = await instance.tokenIdToStarInfo.call(tokenId);
    assert.equal(star[0], 'Awesome Star!')
    assert.equal(star[1], 'JSTAR')
  });

  it('lets user1 put up their star for sale', async() => {
    let user1 = accounts[1]
    let starId = 2;
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    assert.equal(await instance.starsForSale.call(starId), starPrice)
  });

  it('lets user1 get the funds after the sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 3
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
    await instance.buyStar(starId, {from: user2, value: starPrice})
    let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)
    assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), balanceOfUser1AfterTransaction.toNumber());
  });

  it('lets user2 buy a star, if it is put up for sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 4
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice});
    assert.equal(await instance.ownerOf.call(starId), user2);
  });

  it('lets user2 buy a star and decreases its balance in ether', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 5
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice, gasPrice:0})
    const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)
    assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice);
  });

  // Write Tests for:

// 1) The token name and token symbol are added properly.
// 2) 2 users can exchange their stars.
// 3) Stars Tokens can be transferred from one address to another.
