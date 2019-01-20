// import 'babel-polyfill';
// const express = require("express");


const StarNotary = artifacts.require('./starNotary.sol')

let instance;
let accounts;
var owner;

contract('StarNotary', async (accs) => {
accounts = accs;
owner = accounts[0];
instance = await StarNotary.deployed();
})

it('has correct name', async () => {
    assert.equal(await instance.starName.call(), 'Awesome Udacity Star');
})

it('can be claimed', async () => {
  await instance.claimStar({from: owner});
  assert.equal(await instance.starOwner.call(), owner)
})

it('can change owners', async () => {
    var secondUser = accounts[1];
    await instance.claimStar({from: owner})
    assert.equal(await instance.starOwner.call(), owner)
    await instance.claimStar({from: secondUser})
    assert.equal(await instance.starOwner.call(), secondUser)
})