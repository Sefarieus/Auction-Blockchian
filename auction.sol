// SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity ^0.6.1;

contract auction{
  address payable public seller;
  address payable public buyer;
  uint256 public highAmount;
  address public admin;
  string autionName;
  bool isFinshed;
  uint256 outTime;
  mapping(address => uint256) pendingReturns;

  event HighestBidIncreased(address _bidder,uint256 _amount);

  event End_Auction(address _winner,uint256 _amount);

  constructor(address payable _seller,string memory _name) public{
    seller=_seller;
    autionName=_name;
    admin=msg.sender;
    outTime=now+1800;
    isFinshed=false;
    highAmount=0;
  }

  function aution(uint256 amount) public payable{
    require(amount>highAmount,"amount must>highAmount");
    require(amount==msg.value,"amount must==msg.value");
    require(now<=outTime,"must not time out");
    require(!isFinshed,"must not finshed");
    pendingReturns[buyer]+=highAmount;
  //buyer.transfer(highAmount); 
    buyer=msg.sender;//
    highAmount=amount;
    emit HighestBidIncreased(msg.sender,msg.value);
  }

  function withdraw() public returns (bool){
    uint256 amount = pendingReturns[msg.sender];
    if(amount > 0){
      pendingReturns[msg.sender]=0;
      if(!msg.sender.send(amount)){
        pendingReturns[msg.sender]= amount;
        return false;
      }
    }
    return true;
  }

  function endAuction() public payable{
    require(msg.sender==admin,"only admin can do this");
    require(now > outTime,"time is not ok");
    require(!isFinshed,"must not finshed");
    isFinshed=true;
    emit End_Auction(buyer, highAmount);
    seller.transfer(highAmount*90/100);
  }
}