// //const EthereumTx = require('ethereumjs-tx').Transaction; 
// //const Tx = require('ethereumjs-tx');
// const privateKeys = require('./truffle-keys').private;
// const publicKeys = require('./truffle-keys').public;
// //const Token = artifacts.require('./Token.sol');
// const Token = artifacts.require("Token");

// contract('Token', function(accounts) {

//     let BN = web3.utils.BN;

//     it("should give accounts[1] authority to spend account[0]'s token", function() {
//         var token;
//         return Token.deployed()
        
//         .then(function(instance){
//         token = instance;
//         return token.approve(accounts[1], 200000);
//         })
        
//         .then(function(){
//         return BN(token.allowance.call(accounts[0], accounts[1])).toString();
//         })
        
//         .then(function(result){
//         assert.equal(result, 200000, 'allowance is wrong');
//         return token.transferFrom(accounts[0], accounts[2], 200000, {from: accounts[1]});
//         })
        
//         .then(function(){
//         return BN(token.balanceOf.call(accounts[0])).toString();
//         })
        
//         .then(function(result){
//         assert.equal(result.toNumber(), 300000, 'accounts[0] balance is wrong');
//         return token.balanceOf.call(accounts[1]);
//         })
        
//         .then(function(result){
//         assert.equal(result.toNumber(), 500000, 'accounts[1] balance is wrong');
//         return token.balanceOf.call(accounts[2]);
//         })
        
//         .then(function(result){
//         assert.equal(result.toNumber(), 200000, 'accounts[2] balance is wrong');
//         })
//     });

// })