pragma solidity ^0.4.18;

import "./Aleph.sol";

contract Analyst {
  //string firstname;
  bytes32 public name;
  bytes32 public password;
  uint32 public auth_status;  // user authentication status
  address public invited_round;
  address public active_round;
    // Round.status public round_status;
  address public past_rounds;
  uint32 public reputation;
  uint32 public token_balance;
  function Analyst(bytes32 _name) public { 
    name = _name;
  }
  function set_name(bytes32 _name) public { 
      name = _name; 
  }
  function add_reputation(uint32 _repadd) public { 
      reputation += _repadd; 
  }
  function set_auth_status(uint32 _status) public { 
      auth_status = _status; 
  }    
}

contract AnalystRegistry {
  using Aleph for *;
  uint32 constant REPUTATION_LEAD = 12;

  Aleph.itMapAddressAddress analysts; // analysts, keyed on user addresses
  
  function register(address _user, bytes32 _name) public returns (address) {
    address new_analyst = address(new Analyst(_name));
    address user = user == 0 ? new_analyst : _user;
    analysts.insert(user,new_analyst);    // for test purposes, use my address as key instead of user address
    return new_analyst;
  }
  /*
  function login(bytes32 _name, bytes32 _password) public view returns (address) {
    
  }
  */
  function getByAddress( address _user ) public constant returns (address) {
      return analysts.get(_user);
  }
  function getById( uint32 _analystid ) public constant returns (address) { // sequential ids
      return analysts.getValueByIndex(_analystid);
  }
  function getAnalyst( address _user ) public constant returns (Analyst) {
    return Analyst(analysts.get(_user));
  }
  function getId( address _user ) public constant returns ( uint32 ){
      return uint32(analysts.getIndexByKey( _user ));
  }
  /*
  function getNthJurist( uint32 n ) public constant returns (address){
     uint32 num_found = 0;
     for(uint32 i=0;i<analysts.size(); i++) {
        address addr = analysts.getValueByIndex(i);
        Analyst analyst = Analyst(addr);
        if (analyst.reputation() < REPUTATION_LEAD) {
            if (num_found == n) return(addr); 
            num_found++;
        }
     }
     return 0; // not found
  }
  function getNthLead(uint32 n) public constant returns (address) {
     uint32 num_found = 0;
     for(uint32 i=0;i<analysts.size(); i++) {
        address addr = analysts.getValueByIndex(i);
        Analyst analyst = Analyst(addr);
        if (analyst.reputation() >= REPUTATION_LEAD) {
            if (num_found == n) return(addr); 
            num_found++;
        }
     }
     return 0; // not found      
  }
  */
  function num_leads() public constant returns (uint32 num_found){
     for( uint32 i=0; i<analysts.size(); i++ ) {
        address addr = analysts.getValueByIndex(i);
        Analyst analyst = Analyst( addr );
        if (analyst.reputation() >= REPUTATION_LEAD) {
            num_found++;
        }
     }
  }
  
  
  function num_analysts() public constant returns (uint32) {
      return uint32(analysts.size());
  }
  function apiAnalystsInfo() public view returns (uint32,uint32){
      return (num_analysts(),num_leads());
  }
  function apiAnalyst(uint32 idx) public view 
    returns (
        bytes32 name,
        uint32 auth_status,
        uint32 reputation, 
        uint32 token_balance,
        address invited_round,
        address active_round
    ) {
    Analyst analyst = Analyst(getById(idx));
    name = analyst.name();
    auth_status = analyst.auth_status();
    reputation = analyst.reputation();
    token_balance = analyst.token_balance();
    invited_round = analyst.invited_round();
    active_round = analyst.active_round();
  }

  // create some analysts
  function bootstrap(uint32 _numanalysts,uint32 _numleads) public {
    uint32 new_analysts = _numanalysts == 0 ? 12 : _numanalysts;
    uint32 new_leads = _numleads == 0 ? 2 : _numleads;
    uint32 new_start = uint32(num_analysts());
    for (uint32 i=new_start;i<new_start+new_analysts;i++) {
        address addr = register(0,bytes32(i));
        Analyst analyst = Analyst(addr);
        if (new_leads > 0) {
          analyst.add_reputation(REPUTATION_LEAD);
          new_leads--;
        }
    }
  }    
}