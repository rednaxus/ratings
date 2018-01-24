pragma solidity ^0.4.18;

// Library utility funcions 

library Aleph {
    function strConcat(string _a, string _b, string _c, string _d, string _e) pure internal returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }
    
    function strConcat(string _a, string _b) pure internal returns (string) {
      return strConcat(_a,_b,"","","");
    }    
 

    function toAsciiString(address x) pure internal returns (string) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(byte b) pure internal returns (byte c) {
        if (b < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);
    }

    /*
    function strConcat(string _a, string _b) public pure returns (string) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory ab = new bytes (_ba.length + _bb.length);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) ab[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) ab[k++] = _bb[i];
        return string(ab);
    }
    */

    /*
    function addrToString(address x) public pure returns (string) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        return string(b);
    }
    */
    function bytes32ToString(bytes32 x) public pure returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte ch = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (ch != 0) {
                bytesString[charCount] = ch;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

    function bytes32ArrayToString(bytes32[] data) public pure returns (string) {
        bytes memory bytesString = new bytes(data.length * 32);
        uint urlLength;
        for (uint i=0; i<data.length; i++) {
            for (uint j=0; j<32; j++) {
                byte ch = byte(bytes32(uint(data[i]) * 2 ** (8 * j)));
                if (ch != 0) {
                    bytesString[urlLength] = ch;
                    urlLength += 1;
                }
            }
        }
        bytes memory bytesStringTrimmed = new bytes(urlLength);
        for (i=0; i<urlLength; i++) {
            bytesStringTrimmed[i] = bytesString[i];
        }
        return string(bytesStringTrimmed);
    } 
    
    function uintToString(uint v) public pure returns (string str) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(48 + remainder);
        }
        bytes memory s = new bytes(i);
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - 1 - j];
        }
        str = string(s);
    }
    
    // random numbers
    
    /* Generates a random number from 0 to 100 based on the last block hash */
    function randomGen(uint seed) public constant returns (uint randomNumber) {
        return(uint(keccak256(block.blockhash(block.number-1), seed ))%100);
    }

    /* generates a number from 0 to 2^n based on the last n blocks */
    function multiBlockRandomGen(uint seed, uint size) public constant returns (uint randomNumber) {
        uint n = 0;
        for (uint i = 0; i < size; i++){
            if (uint(keccak256(block.blockhash(block.number-i-1), seed ))%2==0)
                n += 2**i;
        }
        return n;
    }

    // iterators
    
    /* itMapAddressAddress
         address =>  address
    */
    struct entryAddressAddress {
        // Equal to the index of the key of this item in keys, plus 1.
        uint keyIndex;
        address addr;
    }

    struct itMapAddressAddress {
        mapping(address => entryAddressAddress) data;
        address[] keys;
    }

    function insert(itMapAddressAddress storage self, address key, address addr) internal returns (bool replaced) {
        entryAddressAddress storage e = self.data[key];
        e.addr = addr;
        if (e.keyIndex > 0) {
            return true;
        } else {
            e.keyIndex = ++self.keys.length;
            self.keys[e.keyIndex - 1] = key;
            return false;
        }
    }

    function remove(itMapAddressAddress storage self, address key) internal returns (bool success) {
        entryAddressAddress storage e = self.data[key];
        if (e.keyIndex == 0)
            return false;

        if (e.keyIndex <= self.keys.length) {
            // Move an existing element into the vacated key slot.
            self.data[self.keys[self.keys.length - 1]].keyIndex = e.keyIndex;
            self.keys[e.keyIndex - 1] = self.keys[self.keys.length - 1];
            self.keys.length -= 1;
            delete self.data[key];
            return true;
        }
    }

    function destroy(itMapAddressAddress storage self) internal  {
        for (uint i; i<self.keys.length; i++) {
          delete self.data[ self.keys[i]];
        }
        delete self.keys;
        return ;
    }

    function contains(itMapAddressAddress storage self, address key) internal constant returns (bool exists) {
        return self.data[key].keyIndex > 0;
    }

    function size(itMapAddressAddress storage self) internal constant returns (uint) {
        return self.keys.length;
    }

    function get(itMapAddressAddress storage self, address key) internal constant returns (address) {
        return self.data[key].addr;
    }

    function getKeyByIndex(itMapAddressAddress storage self, uint idx) internal constant returns (address) {
        return self.keys[idx];
    }

    function getIndexByKey(itMapAddressAddress storage self, address key) internal constant returns (uint) {
        return self.data[key].keyIndex;
    }
    
    function getValueByIndex(itMapAddressAddress storage self, uint idx) internal constant returns (address) {
        return self.data[self.keys[idx]].addr;
    }

    //note, just test, doesn't really work
    function sort(itMapAddressAddress storage self,function (address) pure returns (bool) f) internal view {
        for (uint idx=0;idx<self.keys.length;idx++) {
            f(self.data[self.keys[idx]].addr);
        }
    }

    /* itMapUintAddress
         Uint =>  Address
    */
    struct entryUintAddress {
        // Equal to the index of the key of this item in keys, plus 1.
        uint keyIndex;
        address value;
    }

    struct itMapUintAddress {
        mapping(uint => entryUintAddress) data;
        uint[] keys;
    }

    function insert(itMapUintAddress storage self, uint key, address value) internal returns (bool replaced) {
        entryUintAddress storage e = self.data[key];
        e.value = value;
        if (e.keyIndex > 0) {
            return true;
        } else {
            e.keyIndex = ++self.keys.length;
            self.keys[e.keyIndex - 1] = key;
            return false;
        }
    }

    function remove(itMapUintAddress storage self, uint key) internal returns (bool success) {
        entryUintAddress storage e = self.data[key];
        if (e.keyIndex == 0)
            return false;

        if (e.keyIndex <= self.keys.length) {
            // Move an existing element into the vacated key slot.
            self.data[self.keys[self.keys.length - 1]].keyIndex = e.keyIndex;
            self.keys[e.keyIndex - 1] = self.keys[self.keys.length - 1];
            self.keys.length -= 1;
            delete self.data[key];
            return true;
        }
    }

    function destroy(itMapUintAddress storage self) internal  {
        for (uint i; i<self.keys.length; i++) {
          delete self.data[ self.keys[i]];
        }
        delete self.keys;
        return ;
    }

    function contains(itMapUintAddress storage self, uint key) internal constant returns (bool exists) {
        return self.data[key].keyIndex > 0;
    }

    function size(itMapUintAddress storage self) internal constant returns (uint) {
        return self.keys.length;
    }

    function get(itMapUintAddress storage self, uint key) internal constant returns (address) {
        return self.data[key].value;
    }

    function getKeyByIndex(itMapUintAddress storage self, uint idx) internal constant returns (uint) {
        return self.keys[idx];
    }

    function getValueByIndex(itMapUintAddress storage self, uint idx) internal constant returns (address) {
        return self.data[self.keys[idx]].value;
    }
    function getIndexByKey(itMapUintAddress storage self, uint key) internal constant returns (uint) {
        return self.data[key].keyIndex;
    }

  // some array utilities that use functional patterns
  function map(uint[] memory self, function (uint) pure returns (uint) f)
    internal
    pure
    returns (uint[] memory r)
  {
    r = new uint[](self.length);
    for (uint i = 0; i < self.length; i++) {
      r[i] = f(self[i]);
    }
  }
  function reduce(
    uint[] memory self,
    function (uint, uint) pure returns (uint) f
  )
    internal
    pure
    returns (uint r)
  {
    r = self[0];
    for (uint i = 1; i < self.length; i++) {
      r = f(r, self[i]);
    }
  }
  function range(uint length) internal pure returns (uint[] memory r) {
    r = new uint[](length);
    for (uint i = 0; i < r.length; i++) {
      r[i] = i;
    }
  }


    /* itMapUintUint mapping
        KeyIndex uint => Value uint
    */
    struct entryUintUint {
        // Equal to the index of the key of this item in keys, plus 1.
        uint keyIndex;
        uint value;
    }

    struct itMapUintUint {
        mapping(uint => entryUintUint) data;
        uint[] keys;
    }

    function insert(itMapUintUint storage self, uint key, uint value) internal returns (bool replaced) {
        entryUintUint storage e = self.data[key];
        e.value = value;
        if (e.keyIndex > 0) {
            return true;
        } else {
            e.keyIndex = ++self.keys.length;
            self.keys[e.keyIndex - 1] = key;
            return false;
        }
    }

    function remove(itMapUintUint storage self, uint key) internal returns (bool success) {
        entryUintUint storage e = self.data[key];
        if (e.keyIndex == 0)
            return false;

        if (e.keyIndex <= self.keys.length) {
            // Move an existing element into the vacated key slot.
            self.data[self.keys[self.keys.length - 1]].keyIndex = e.keyIndex;
            self.keys[e.keyIndex - 1] = self.keys[self.keys.length - 1];
            self.keys.length -= 1;
            delete self.data[key];
            return true;
        }
    }
    
    function find(itMapUintUint storage self, uint value) internal constant returns (uint) {  // return the key
        for (uint i=0;i<self.keys.length;i++){
            if (self.data[self.keys[i]].value == value) return self.keys[i];
        }
    }

    function destroy(itMapUintUint storage self) internal  {
        for (uint i; i<self.keys.length; i++) {
          delete self.data[ self.keys[i]];
        }
        delete self.keys;
        return ;
    }

    function contains(itMapUintUint storage self, uint key) internal constant returns (bool exists) {
        return self.data[key].keyIndex > 0;
    }

    function size(itMapUintUint storage self) internal constant returns (uint) {
        return self.keys.length;
    }

    function get(itMapUintUint storage self, uint key) internal constant returns (uint) {
        return self.data[key].value;
    }

    function getKey(itMapUintUint storage self, uint idx) internal constant returns (uint) {
      /* Decrepated, use getKeyByIndex. This kept for backward compatilibity */
        return self.keys[idx];
    }

    function getKeyByIndex(itMapUintUint storage self, uint idx) internal constant returns (uint) {
      /* Same as decrepated getKey. getKeyByIndex was introduced to be less ambiguous  */
        return self.keys[idx];
    }

    function getValueByIndex(itMapUintUint storage self, uint idx) internal constant returns (uint) {
        return self.data[self.keys[idx]].value;
    }


    /* Generates a random number from 0 to n-1 (based on the last block hash) */
    function randomIdx(uint seed, uint n) public constant returns (uint randomNumber) {
        return(uint(keccak256(block.blockhash(block.number-1), seed ))%(n-1));
    }
}


    

