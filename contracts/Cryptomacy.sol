// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Cryptomacy is Ownable {
  using SafeMath for uint256;

  event NewCryptomat(uint cryptomatId, string name, uint positionX, uint positionY);
  event CryptomatMovesToPosition(uint cryptomatId, uint positionX, uint positionY);

  uint public worldSize = 10;

  struct Cryptomat {
    string name;
    uint positionX;
    uint positionY;
  }

  //Cryptomat id's start from 1 so we can get the index with: id - 1
  Cryptomat[] public cryptomats;

  mapping (uint => address) public cryptomatToOwner;
  mapping (address => uint) ownerCryptomatCount;
  //The key is the hash of positionX and positionY
  mapping (uint => uint) positionToCryptomat;

  function createCryptomatAtPosition(string memory _name, uint _positionX, uint _positionY) public 
    positionInsideBounds(_positionX, _positionY) 
    returns(uint, string memory, uint, uint) {
    
    require(positionToCryptomat[getPositionHash(_positionX, _positionY)] == 0, "The position is taken.");
    
    uint id = cryptomats.push(Cryptomat(_name, _positionX, _positionY));
   
    cryptomatToOwner[id - 1] = msg.sender;
    ownerCryptomatCount[msg.sender] = ownerCryptomatCount[msg.sender].add(1);
    positionToCryptomat[getPositionHash(_positionX, _positionY)] = id;

    emit NewCryptomat(id, _name, _positionX, _positionY);

    return (id, _name, _positionX, _positionY);
  }

  function moveCryptomat(uint _cryptomatId, uint _positionX, uint _positionY) public 
    ownCryptomat(_cryptomatId) positionInsideBounds(_positionX, _positionY) 
    returns(uint, uint, uint) {
    
    require(positionToCryptomat[getPositionHash(_positionX, _positionY)] == 0, "The position is taken.");

    Cryptomat storage cryptomat = cryptomats[_cryptomatId - 1];

    require(arePositionsOneBlockApart(cryptomat.positionX, cryptomat.positionY, _positionX, _positionY), "The position is too far away.");

    delete positionToCryptomat[getPositionHash(cryptomat.positionX, cryptomat.positionY)];

    cryptomat.positionX = _positionX;
    cryptomat.positionY = _positionY;

    positionToCryptomat[getPositionHash(_positionX, _positionY)] = _cryptomatId;
     
    emit CryptomatMovesToPosition(_cryptomatId, _positionX, _positionY);
    
    return (_cryptomatId, _positionX, _positionY);
  }

  function arePositionsOneBlockApart(uint _positionX1, uint _positionY1, uint _positionX2, uint _positionY2) internal pure returns(bool) {
    return (int(_positionX2) - int(_positionX1) == 1 && _positionY2 == _positionY1) ||
      (int(_positionX2) - int(_positionX1) == -1 && _positionY2 == _positionY1) ||
      (int(_positionY2) - int(_positionY1) == 1 && _positionX2 == _positionX1) ||
      (int(_positionY2) - int(_positionY1) == -1 && _positionX2 == _positionX1);
  }

  function getPositionHash(uint _positionX, uint _positionY) internal pure returns(uint) {
    return uint(keccak256(abi.encodePacked(_positionX, _positionY)));
  }

  modifier positionInsideBounds(uint _positionX, uint _positionY) {
    require(isPositionOutsideBounds(_positionX, _positionY), "The position is out of bounds.");
    _;
  }

  function isPositionOutsideBounds(uint _positionX, uint _positionY) internal view returns(bool) {
    return 0 <= _positionX && _positionX < worldSize &&
           0 <= _positionY && _positionY < worldSize;
  }

  modifier ownCryptomat(uint _cryptomatId) {
    require(cryptomatToOwner[_cryptomatId - 1] == msg.sender, "Can't move another player's cryptomat.");
    _;
  }
}