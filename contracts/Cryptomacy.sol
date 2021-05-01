// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Cryptomacy {

  event NewCryptomat(uint cryptomatId, string name, int positionX, int positionY);
  event CryptomatMovesToPosition(uint cryptomatId, int positionX, int positionY);

  uint public worldSize = 10;

  struct Cryptomat {
    string name;
    int positionX;
    int positionY;
  }

  //Cryptomat id's start from 1 so we can get the index with: id - 1
  Cryptomat[] public cryptomats;

  mapping (uint => address) public cryptomatToOwner;
  mapping (address => uint) ownerCryptomatCount;
  //The key is the hash of positionX and positionY
  mapping (uint => uint) positionToCryptomat;

  function createCryptomatAtPosition(string memory _name, int _positionX, int _positionY) public 
    positionInsideBounds(_positionX, _positionY) 
    returns(uint cryptomatId, string memory name, int positionX, int positionY) {
    
    require(positionToCryptomat[getPositionHash(_positionX, _positionY)] == 0, "The position is taken.");
  
    cryptomats.push(Cryptomat(_name, _positionX, _positionY));
   
    uint id = cryptomats.length;
  
    cryptomatToOwner[id - 1] = msg.sender;
    
    ownerCryptomatCount[msg.sender] = ownerCryptomatCount[msg.sender] + 1;

    positionToCryptomat[getPositionHash(_positionX, _positionY)] = id;

    emit NewCryptomat(id, _name, _positionX, _positionY);
    emit CryptomatMovesToPosition(id, _positionX, _positionY);

    return (id, _name, _positionX, _positionY);
  }

  function moveCryptomat(uint _cryptomatId, int _positionX, int _positionY) public 
    ownCryptomat(_cryptomatId) positionInsideBounds(_positionX, _positionY) 
    returns(uint cryptomatId, int positionX, int positionY) {
    
    require(positionToCryptomat[getPositionHash(_positionX, _positionY)] == 0, "The position is taken.");

    Cryptomat storage cryptomat = cryptomats[_cryptomatId - 1];

    require(arePositionsNeighbors(cryptomat.positionX, cryptomat.positionY, _positionX, _positionY), "The position is too far away.");

    delete positionToCryptomat[getPositionHash(cryptomat.positionX, cryptomat.positionY)];

    cryptomat.positionX = _positionX;
    cryptomat.positionY = _positionY;

    positionToCryptomat[getPositionHash(_positionX, _positionY)] = _cryptomatId;
     
    emit CryptomatMovesToPosition(_cryptomatId, _positionX, _positionY);
    
    return (_cryptomatId, _positionX, _positionY);
  }

  //even-r layout
  function arePositionsNeighbors(int _positionX1, int _positionY1, int _positionX2, int _positionY2) internal pure returns(bool) {
    if(_positionY1 % 2 == 0) {
      return _positionX1 + 1 == _positionX2 && _positionY1 - 1 == _positionY2 || //up right
        _positionX1 + 1 == _positionX2 && _positionY1 == _positionY2 || //right
        _positionX1 + 1 == _positionX2 && _positionY1 + 1 == _positionY2 || //down right
        _positionX1 == _positionX2 && _positionY1 + 1 == _positionY2 || //down left
        _positionX1 - 1 == _positionX2 && _positionY1 == _positionY2 || //left
        _positionX1 == _positionX2 && _positionY1 - 1 == _positionY2; //up left
    } else {
      return _positionX1 == _positionX2 && _positionY1 - 1 == _positionY2 || //up right
        _positionX1 + 1 == _positionX2 && _positionY1 == _positionY2 || //right
        _positionX1 == _positionX2 && _positionY1 + 1 == _positionY2 || //down right
        _positionX1 - 1 == _positionX2 && _positionY1 + 1 == _positionY2 ||  //down left
        _positionX1 - 1 == _positionX2 && _positionY1 == _positionY2 || //left
        _positionX1 - 1 == _positionX2 && _positionY1 - 1 == _positionY2; //up left
    }
  }

  function getPositionHash(int _positionX, int _positionY) internal pure returns(uint) {
    return uint(keccak256(abi.encodePacked(_positionX, _positionY)));
  }

  modifier positionInsideBounds(int _positionX, int _positionY) {
    require(isPositionOutsideBounds(worldSize, _positionX, _positionY), "The position is out of bounds.");
    _;
  }

  function isPositionOutsideBounds(uint _worldSize, int _positionX, int _positionY) internal pure returns(bool) {
    return 0 <= _positionX && _positionX < int(_worldSize) &&
           0 <= _positionY && _positionY < int(_worldSize);
  }

  modifier ownCryptomat(uint _cryptomatId) {
    require(cryptomatToOwner[_cryptomatId - 1] == msg.sender, "Can't move another player's cryptomat.");
    _;
  }
}