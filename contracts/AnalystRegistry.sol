pragma solidity ^0.4.18;

contract AnalystRegistry {
    uint32 constant REPUTATION_LEAD = 12;
  
    struct Analyst {
        //string firstname;
        bytes32 name;
        bytes32 password;
        uint32 auth_status;  // user authentication status
        address user_addr;
        address invited_round;
        address active_round;
        bool is_lead;
        // Round.status public round_status;
        //address public past_rounds;
        uint32 reputation;
        uint32 token_balance;
    }
    mapping (uint32 => Analyst) analysts;
    mapping (address => uint32) address_lookup;
    uint32 public num_analysts; 
    
    mapping (uint32 => uint32) leads;
    uint32 public num_leads;
  
    function register(bytes32 _name, bytes32 _pw) public returns (uint32) {
        analysts[num_analysts++] = Analyst(_name,_pw,0,msg.sender,0,0,false,0,0);
        address_lookup[msg.sender] = num_analysts;
        return num_analysts;
    }
  
    function login(bytes32 _password) public view returns (uint32 id) {
        id = address_lookup[msg.sender];
        require(analysts[id].password == _password);
    }

    function getAnalyst( address _user ) public constant returns (uint32 id) {
        id = address_lookup[_user];
    }
    
    function getAddress( uint32 _analystid ) public constant returns (address) { // sequential ids
        return analysts[_analystid].user_addr;
    }
  
    function increaseReputation( uint32 _analystId, uint32 _reputationPoints) public {
        analysts[_analystId].reputation += _reputationPoints;
        if (!analysts[_analystId].is_lead && analysts[_analystId].reputation >= REPUTATION_LEAD){
            analysts[_analystId].is_lead = true; // promotion
            leads[num_leads++] = _analystId;
        }
    }
  
    function apiAnalyst( uint32 _analystId ) public view returns (bytes32, uint32, uint32, bool, uint32, address, address) {
        Analyst storage a = analysts[_analystId];
        return (a.name, a.auth_status, a.reputation, a.is_lead, a.token_balance, a.invited_round, a.active_round );
    }
    
    // create some analysts
    function bootstrap(uint32 _numanalysts,uint32 _numleads) public {
        uint32 new_analysts = _numanalysts == 0 ? 12 : _numanalysts;
        uint32 new_leads = _numleads == 0 ? 2 : _numleads;
        uint32 start = num_analysts;
        uint32 finish = num_analysts+new_analysts;
        for ( uint32 i = start; i < finish; i++ ) {
            register(bytes32(i),'veva123'); // make up phony name based on id
            if (new_leads > 0) {
                increaseReputation( i, REPUTATION_LEAD);
                new_leads--;
            }
        }
    }
}
