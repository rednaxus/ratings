pragma solidity ^0.4.19;

contract AnalystRegistry {
    uint32 constant REPUTATION_LEAD = 12;

    // reward types
    uint8 constant REWARD_REFERRAL = 1;
    
    uint8 constant REWARD_ROUND_TOKENS_WINNER = 2;
    uint8 constant REWARD_ROUND_TOKENS_LOSER = 3;
    uint8 constant REWARD_ROUND_TOKENS_JURY_TOP = 4;
    uint8 constant REWARD_ROUND_TOKENS_JURY_MIDDLE = 5;
    uint8 constant REWARD_ROUND_TOKENS_JURY_BOTTOM = 6;
    
    uint8 constant REWARD_PROMOTION_TO_LEAD = 7;

    // reward payoffs
    uint8 constant REFERRAL_POINTS = 8;
    uint8 constant WINNER_PCT = 40;
    uint8 constant LOSER_PCT = 10;
    uint8 constant TOP_JURISTS_X10 = 34;   // percentages * 10   ... level:0
    uint8 constant MIDDLE_JURISTS_X10 = 17;   // level:1
    uint8 constant BOTTOM_JURISTS_X10 = 0;    // level:2

    struct RewardEvent {
        uint8 reward_type;
        uint256 timestamp;
        uint32 value;
        uint32 ref; // may be round, cycle, analyst, depends on event
    }
    
    struct Analyst {
        //string firstname;
        bytes32 name;
        bytes32 password;
        bytes32 email;
        uint32 auth_status;  // user authentication status
        uint32 referred_by; // analyst that referred me
        address user_addr;
        bool is_lead;
        uint32 reputation;
        uint32 points;
        uint32 token_balance;
        
        uint16 num_rounds_scheduled;
        uint16 num_rounds_active;
        uint16 num_rounds_finished;
        uint16 num_reward_events;
        uint16 num_referrals;
        
        mapping ( uint16 => uint16 ) rounds_scheduled;
        mapping ( uint16 => uint16 ) rounds_active;
        mapping ( uint16 => uint16 ) rounds_finished;
        mapping ( uint16 => RewardEvent ) reward_events;
        mapping ( uint16 => uint32 ) referrals;
    }
    mapping (uint32 => Analyst) analysts;
    mapping (address => uint32) address_lookup;
    mapping (bytes32 => uint32) name_lookup;
    uint32 public num_analysts; 
    
    mapping (uint32 => uint32) leads;
    uint32 public num_leads;
  
    uint256 timenow;
    function update(uint256 _timenow) public { timenow = _timenow; }
    
    function AnalystRegistry() public {
        bootstrap(12,4);
    }
    
    event Register(uint32 id, bytes32 name, bytes32 email);
    function register(bytes32 _name, bytes32 _pw, bytes32 _email, uint32 _referral ) public {
        analysts[ num_analysts ] = Analyst( 
            _name, _pw, _email, 0, _referral, msg.sender, false, 
            0, 0, 0,
            0, 0, 0, 0, 0
        );
        if (_referral > 0){
            Analyst storage referredBy = analysts[_referral];
            referredBy.referrals[referredBy.num_referrals++] = num_analysts;
            referredBy.points += REFERRAL_POINTS;
            referredBy.reward_events[referredBy.num_reward_events++] = 
                RewardEvent(REWARD_REFERRAL,timenow,REFERRAL_POINTS,num_analysts);
        }
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

    function increaseReputation( uint32 _analyst, uint32 _reputationPoints) public {
        Analyst storage a = analysts[_analyst];
        a.reputation += _reputationPoints;
        if (!a.is_lead && a.reputation >= REPUTATION_LEAD){
            a.is_lead = true; // promotion
            a.reward_events[a.num_reward_events++] = 
                RewardEvent( REWARD_PROMOTION_TO_LEAD, timenow, _reputationPoints, 0);
            leads[num_leads++] = _analyst;
        }
    }

    function getAnalystEvent( uint32 _analyst, uint16 _event ) public view returns ( uint8, uint256, uint32, uint32 ) {
        RewardEvent storage e = analysts[ _analyst ].reward_events[ _event ];
        return ( e.reward_type, e.timestamp, e.value, e.ref );
    }
    function getReferral( uint32 _analyst, uint16 _referral ) public view returns ( uint32 ) {
        return analysts[ _analyst ].referrals[ _referral ];
    }
    function isLead( uint32 _analyst ) public view returns (bool){
        return( analysts[ _analyst ].reputation >= REPUTATION_LEAD );
    }

    function analystInfo( uint32 _analystId ) public view returns (
        uint32, bytes32, bytes32, uint32, uint32, bool, uint32, 
        uint16, uint16, uint16, uint16, uint16 
    ) {
        Analyst storage a = analysts[_analystId];
        return (
            _analystId, a.name, a.password, a.auth_status, 
            a.reputation, a.is_lead, a.token_balance, 
            a.num_rounds_scheduled, a.num_rounds_active, a.num_rounds_finished,
            a.num_reward_events,a.num_referrals
        );
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

    function payToken( uint32 _analyst, uint8 _rewardType, uint32 _value, uint32 _ref ) public {
        Analyst storage a = analysts[ _analyst ];
        a.reward_events[ a.num_reward_events++ ] = 
            RewardEvent(_rewardType,timenow,_value,_ref);
        a.token_balance += _value;
    }

    function payLead( uint32 _analyst, uint16 _round, uint32 _roundValue, bool _win ) public {
        if (_win) payToken( _analyst, REWARD_ROUND_TOKENS_WINNER, _roundValue * WINNER_PCT / 100, _round);
        else payToken( _analyst, REWARD_ROUND_TOKENS_LOSER, _roundValue * LOSER_PCT / 100, _round );
    }
    
    function payJurist( uint32 _analyst, uint16 _round, uint32 _roundValue, uint8 _level) public {
        if (_level == 0) payToken( _analyst, REWARD_ROUND_TOKENS_JURY_TOP, _roundValue * TOP_JURISTS_X10 / 1000, _round );
        else if (_level == 0) payToken( _analyst, REWARD_ROUND_TOKENS_JURY_MIDDLE, _roundValue * MIDDLE_JURISTS_X10 / 1000, _round );
        else payToken( _analyst, REWARD_ROUND_TOKENS_JURY_BOTTOM, _roundValue * BOTTOM_JURISTS_X10 / 1000, _round );
    }

    // create some analysts... testing only!
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
            register( name, 'veva', email, 0); // make up phony name based on id
            if ( new_leads > 0 ) {
                increaseReputation( i, REPUTATION_LEAD);
                new_leads--;
            }
        }
    }
}
