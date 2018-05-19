  pragma solidity ^0.4.17;

  import './StandardToken.sol';
  import './TokenVesting.sol';

  contract vevaTest is StandardToken {


    string public name = 'VEVA';
    string public symbol = 'VVVVVV';
    uint8 public decimals = 18;
    uint public INITIAL_SUPPLY = 500000000000000000000;

    function vevaTest() public {
      totalSupply_ = INITIAL_SUPPLY;
      balances[msg.sender] = INITIAL_SUPPLY;
    }

  //TokenVesting (0x9f943ed85fb1b63b2a68af79290e5023d32f5e96, 15, 30, 40, false);

  }
