const EthereumTx = require('ethereumjs-tx').Transaction; 
const privateKeys = require('./truffle-keys').private;
const publicKeys = require('./truffle-keys').public;
const Token = artifacts.require("Token");

contract('Token (integration)', function(accounts) {
  let contract;
  let owner;
  let other;
  let web3Contract;
  let BN = web3.utils.BN;


  before(async () => {
    contract = await Token.deployed();
    web3Contract = new web3.eth.Contract(contract.abi, contract.address);

    owner = accounts[0];
    other = accounts[1];
    

    if (owner != owner || other != other) {
      throw new Error('Use `truffle develop` and /test/truffle-keys.js');
    }

  });

  it('should pass if contract is deployed', async function() {
    let name = await contract.name.call();
    let symbol = await contract.symbol.call();

    console.log('\nThe name of this Token is: %s and \nThe Symbol is: %s', name, symbol)


    assert.strictEqual(name, 'Topcoder Coin');
  });

  it('should return Initial Token Balance of 1*10^27 Wei', async function() {

    let ownerBalance = await contract.balanceOf(owner);
    
    ownerBalance = await web3.utils.fromWei(ownerBalance, 'ether');
    console.log("\nTotal supply balance in Ether:" + ownerBalance);
    ownerBalance = await web3.utils.toWei(ownerBalance, 'ether');
    console.log("Total supply balance in Wei: %s Wei (i.e = 1*10^27)", ownerBalance);

    assert.equal(ownerBalance, 1 * 10**27);
  });

  it('should properly [transfer] token', async function() {
   
    let tokenWei = 1000000;

    await contract.transfer(other, tokenWei);

    console.log('\nAccount 0 just transferred %s Wei to Account 1', tokenWei)
    
    let ownerBalance = await contract.balanceOf(owner);
    let otherBalance = await contract.balanceOf(other);

    ownerBalance = await web3.utils.fromWei(ownerBalance, 'ether');
    ownerBalance = await web3.utils.toWei(ownerBalance, 'ether');

    otherBalance = await web3.utils.fromWei(otherBalance, 'ether');
    otherBalance = await web3.utils.toWei(otherBalance, 'ether');

    otherBalance = await web3.utils.toNumber(otherBalance);

    console.log('Account 0 now has a balance of %s Wei.', ownerBalance.toString())
    console.log('Account 1 now has a balance of %s Wei', otherBalance)
    

    assert.strictEqual(ownerBalance.toString(), '999999999999999999999000000');
    assert.strictEqual(otherBalance, tokenWei);
  });

  it('should properly return the [totalSupply] of tokens', async function() {
    let totalSupply = await contract.totalSupply.call();

    totalSupply = await web3.utils.fromWei(totalSupply, 'ether')
    totalSupply = await web3.utils.toWei(totalSupply, 'ether')


    totalSupply = totalSupply.toString();
    assert.equal(totalSupply, 1e+27);
  });

  it('should [approve] token for [transferFrom]', async function() {
    let approver = owner;
    let spender = accounts[2];
    let tokenWei = 5000000;

    let originalAllowance = await contract.allowance(approver, spender);

    originalAllowance = await web3.utils.fromWei(originalAllowance, 'ether')
    originalAllowance = await web3.utils.toWei(originalAllowance, 'ether')

    
    await contract.approve(spender, tokenWei);

    console.log('\nAccount 0 just approved Account 1 to spend %s Wei on his behalf', tokenWei)

    let resultAllowance = await contract.allowance.call(approver, spender);

    resultAllowance = await web3.utils.fromWei(resultAllowance, 'ether')
    resultAllowance = await web3.utils.toWei(resultAllowance, 'ether')
    
    originalAllowance = new BN(originalAllowance).toNumber();
    resultAllowance = new BN(resultAllowance).toNumber();

    assert.strictEqual(originalAllowance, 0);
    assert.strictEqual(resultAllowance, tokenWei);
  });


  it('should [transferFrom] approved tokens', async function() {
    let approver = owner;
    let approverPrivateKey = privateKeys[0];
    let spender = other;
    let to = publicKeys[2];
    let tokenWei = 5000000;
     
    
    
    await contract.approve(spender, tokenWei);
    let resultAllowance = await contract.allowance.call(approver, spender);

    resultAllowance = await web3.utils.fromWei(resultAllowance, 'ether')
    resultAllowance = await web3.utils.toWei(resultAllowance, 'ether')
    resultAllowance = new BN(resultAllowance).toNumber();

    let ownerBalance = await contract.balanceOf.call(approver);

    await contract.transferFrom(accounts[0], accounts[2], resultAllowance, {from: accounts[1]});
    await contract.approve(spender, 0);

    resultAllowance = await contract.allowance.call(approver, spender);

    resultAllowance = await web3.utils.fromWei(resultAllowance, 'ether')
    resultAllowance = await web3.utils.toWei(resultAllowance, 'ether')
    resultAllowance = new BN(resultAllowance).toNumber();


    let ownerBalanceAfter = BN(await contract.balanceOf.call(approver)).toString();
    let receiverBalanceAfter = await contract.balanceOf.call(accounts[2]);

    
    console.log("\nAfter calling transferFrom, the resulting allowance is now: " + resultAllowance)
    console.log("After calling transferFrom, the [Account 0]'s balance is now: " + ownerBalanceAfter);
    console.log("After calling transferFrom, the [Account 2]'s balance is now: " + BN(receiverBalanceAfter).toNumber());
    console.log("We're all done here. Thanks")

    



    assert.strictEqual(
      BN(receiverBalanceAfter).toNumber(),
      5000000
    );

  });

});

