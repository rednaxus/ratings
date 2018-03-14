pragma solidity ^0.4.19;

contract AnalystRegistry {
    uint32 constant REPUTATION_LEAD = 12;
  
    struct Analyst {
        //string firstname;
        bytes32 name;
        bytes32 password;
        bytes32 email;
        uint32 auth_status;  // user authentication status
        address user_addr;
        bool is_lead;
        uint32 reputation;
        uint32 token_balance;
        uint16 num_rounds_scheduled;
        uint16 num_rounds_active;
        uint16 num_rounds_finished;
        mapping ( uint16 => uint16 ) rounds_scheduled;
        mapping ( uint16 => uint16 ) rounds_active;
        mapping ( uint16 => uint16 ) rounds_finished;
    }
    mapping (uint32 => Analyst) analysts;
    mapping (address => uint32) address_lookup;
    mapping (bytes32 => uint32) name_lookup;
    uint32 public num_analysts; 
    
    mapping (uint32 => uint32) leads;
    uint32 public num_leads;
  
    function AnalystRegistry() public {
        bootstrap(12,4);
    }
    
    event Register(uint32 id, bytes32 name, bytes32 email);
    function register(bytes32 _name, bytes32 _pw, bytes32 _email ) public {
        analysts[ num_analysts ] = Analyst( _name, _pw, _email, 0, msg.sender, false, 0, 0, 0, 0, 0 );
        address_lookup[ msg.sender ] = num_analysts;
        name_lookup[ _name ] = num_analysts;
        Register( num_analysts++, _name, _email );
    }
  
    function login(bytes32 _name, bytes32 _pw) public view returns (uint32, bytes32, uint32, uint32) {
        uint32 id = name_lookup[ _name ];
        Analyst storage analyst = analysts[id];
        require(analyst.password == _pw);
        return (id,analyst.email,analyst.reputation,analyst.token_balance);
    }
    
    function loginByAddress(bytes32 _password, address force) public view returns ( uint32 id ) { // force is for testing, so can login with another address
        id = address_lookup[ force == 0 ? msg.sender : force ];
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
  
    function isLead( uint32 _analystId ) public view returns (bool){
        return( analysts[ _analystId ].reputation >= REPUTATION_LEAD );
    }

    function analystInfo( uint32 _analystId ) public view returns (uint32, bytes32, bytes32, uint32, uint32, bool, uint32, uint16, uint16, uint16 ) {
        Analyst storage a = analysts[_analystId];
        return (_analystId, a.name, a.password, a.auth_status, a.reputation, a.is_lead, a.token_balance, a.num_rounds_scheduled, a.num_rounds_active, a.num_rounds_finished );
    }
    function scheduleRound( uint32 _analyst, uint16 _round )  public {
        Analyst storage a = analysts[ _analyst ];
        a.rounds_scheduled[ a.num_rounds_scheduled++ ] = _round;
    }
    function scheduledRound( uint32 _analyst, uint8 _roundRef ) public view returns (uint16) {
        Analyst storage a = analysts[ _analyst ];
        require( _roundRef <= a.num_rounds_scheduled );
        return a.rounds_scheduled[ _roundRef ];
    }
    function activeRound( uint32 _analyst, uint8 _roundRef ) public view returns (uint16) {
        Analyst storage a = analysts[ _analyst ];
        require( _roundRef <= a.num_rounds_active );        
        return a.rounds_active[ _roundRef ];
    }
    function finishedRound( uint32 _analyst, uint8 _roundRef ) public view returns (uint16) {
        Analyst storage a = analysts[ _analyst ];
        require( _roundRef <= a.num_rounds_finished );         
        return a.rounds_finished[ _roundRef ];
    }
    
    function activateRound( uint32 _analyst, uint16 _round ) public {
        Analyst storage a = analysts[ _analyst ];
        for( uint16 i = 0; i < a.num_rounds_scheduled; i++ ) {
            if (a.rounds_scheduled[ i ] == _round ){
                a.rounds_active[ a.num_rounds_active++ ] = _round;
                while (i < a.num_rounds_scheduled ){
                    a.rounds_scheduled[ i ] = a.rounds_scheduled[ i + 1 ];                    
                    i++;
                }
                a.num_rounds_scheduled--;
                return;                
            }
        }
        require(false); // error, called with round not scheduled
    }
    
    function finishRound( uint32 _analystId, uint16 _roundId ) public {  
        Analyst storage a = analysts[ _analystId ];
        for( uint16 i = 0; i < a.num_rounds_active; i++ ) {
            if (a.rounds_active[ i ] == _roundId ){
                a.rounds_finished[ a.num_rounds_finished++ ] = _roundId;
                while (i++ < a.num_rounds_active ){
                    a.rounds_active[ i - 1 ] = a.rounds_active[ i ];                    
                }
                a.num_rounds_active--;
                return;                
            }
        }
        require(false); // error, called without active round
    }

    // create some analysts
    function bootstrap(uint32 _numanalysts,uint32 _numleads) public {
        uint32 new_analysts = _numanalysts == 0 ? 12 : _numanalysts;
        uint32 new_leads = _numleads == 0 ? 2 : _numleads;
        uint32 start = num_analysts;
        uint32 finish = num_analysts+new_analysts;
        bytes32 basename = 'alan'; // alan1
        bytes32 emailbase = 'alan_@veva.one';
        uint32 startat = 0x30;  // '0'
        for ( uint32 i = start; i < finish; i++ ) {
            bytes32 appendname = bytes32(i+startat);
            bytes32 name = (appendname << 216) | basename;
            bytes32 email = emailbase;
            register(name,'veva',email); // make up phony name based on id
            if (new_leads > 0) {
                increaseReputation( i, REPUTATION_LEAD);
                new_leads--;
            }
        }
    }
}
