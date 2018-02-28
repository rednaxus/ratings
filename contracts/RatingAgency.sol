pragma solidity ^0.4.18;


import "./AnalystRegistry.sol";

  
contract RatingAgency {
  
    uint16 constant CYCLES_AHEAD = 4; // number to keep ahead of the present
    uint constant ZERO_BASE_TIME = 1514764800;// 1536796800; // e.g. jan 1 2018 
    uint constant CYCLE_PERIOD =  86400 * 28; // e.g. 4 weeks
    uint constant ACTIVE_TIME = 86400 * 28;
    uint constant SCHEDULE_TIME = 86400 * 4; // 4 days before round activates 
    uint16 constant JURY_SIZE = 6; /// desired jury size
    uint8 constant JURISTS_MIN = 2; // min jurists for a round
    uint16 constant DEFAULT_ROUND_VALUE = 100;
    
    uint16 constant REPUTATION_LEAD = 12;
  
    // statuses
    uint8 constant NONE = 0;
    uint8 constant PENDING = 1;
    uint8 constant SCHEDULED = 2;
    uint8 constant ACTIVE = 3;
    uint8 constant FINISHED = 4;
    uint8 constant CANCELLED = 5;
    uint8 constant AVAILABLE = 6;
    uint8 constant CONFIRMED = 7;
    uint8 constant ASSIGNED = 8;

    uint public lasttime;
    
    AnalystRegistry registry;

    struct CoveredToken {
      // rules:
      address token_addr;
  //    uint timestart;
      uint timeperiod;
      address representative;
    }
    mapping( uint32 => CoveredToken) covered_tokens;
    uint32 public num_tokens = 0;

    /* Cycles are the discreet periods when groups of tokens are run as Rounds */
    struct Cycle {
        uint timestart;
        uint period;
        uint8 stat;
        uint8 num_jurists_available;
        uint8 num_jurists_assigned;
        uint8 num_leads_available;
        uint8 num_leads_assigned;
        mapping ( uint16 => uint32 ) jurists_available;
        mapping ( uint16 => uint32 ) jurists_assigned;
        mapping ( uint16 => uint32 ) leads_available;
        mapping ( uint16 => uint32 ) leads_assigned;
    }
    mapping ( uint16 => Cycle ) cycles;
    uint16 public num_cycles = 0;
    
    struct RoundBrief {
        uint upload_time;
        address filehash;
    }
    struct RoundAnalyst {
        uint32 analyst_id;
        uint8 stat;
    }
    struct RoundEval {// Round evaluations
        bytes32 questions;  // 1-5, qualitatives at 24,25, qualitatives at 
        bool[2] qualitatives; // yes / no
        int8 recommendation; // 1-10
        bytes32 comment;
    }
    struct Round {
        uint16 cycle;
        uint32 covered_token;
        uint16 value; // value of the round in veva token
        uint8 stat;
        address representative;
        uint8 num_analysts;
        mapping ( uint8 => RoundBrief ) briefs; // submitted briefs... 0 is bull, 1 is bear
        mapping ( uint8 => RoundAnalyst ) analysts;
        mapping ( uint8 => RoundEval ) evaluations;     // 0 for pre, 1 for post
    }
    mapping ( uint16 => Round ) rounds;
    uint16 public num_rounds = 0;

    mapping ( uint16 => uint16 ) rounds_scheduled; // scheduled rounds by id
    mapping ( uint16 => uint16 ) rounds_active;
    uint16 num_rounds_scheduled = 0;
    uint16 num_rounds_active = 0;
  
    address public registryAddress;
    /**
     * Constructor 
    */
    address constant testregistry1 = 0xdf6ea7200b7fd34f4f7449775cbfe3d1acd3c939;
    function RatingAgency( address _registry ) public {
        if ( _registry == 0 ) _registry = testregistry1;
        registryAddress = _registry;
        registry = AnalystRegistry( _registry );
        
        lasttime = ZERO_BASE_TIME;
        //bootstrapDummyTokens( 4 );
    }

   /* Generates a random number from 0 to n-1 (based on the last block hash) */
    function randomIdx(uint seed, uint n) public constant returns (uint randomNumber) {
        return(uint(keccak256(block.blockhash(block.number-1), seed ))%(n-1));
    }
    
    
    
    
    event TokenAdd( uint32, address);
    function coverToken( address _tokenContract, uint _timeperiod ) public {  // only specify period if different
        covered_tokens[ num_tokens ] = CoveredToken( _tokenContract, _timeperiod, msg.sender );
        TokenAdd( num_tokens, _tokenContract );
        num_tokens++;
    }
    
    function coveredTokenInfo( uint32 _idx ) public view returns ( uint32, address ){
        return ( _idx, covered_tokens[ _idx ].token_addr );
    }
    
    
    /* *** Round Cycle methods  *** */
    // start time for a cycle
    function cycleTime( uint16 _idx ) public pure returns ( uint ){
        return CYCLE_PERIOD * _idx / 4 + ZERO_BASE_TIME;    // cycles offset
    }

    function cycleIdx( uint time ) public pure returns ( uint16 ) {
        return( time <= ZERO_BASE_TIME ? 
            0 : uint16( 4 * ( time - ZERO_BASE_TIME ) / CYCLE_PERIOD ) );
    }
  
    function cycleInfo ( uint16 _cycle ) public view returns ( uint16, uint, uint, uint8, uint8, uint8, uint8, uint8 ) {
        Cycle storage cycle = cycles[ _cycle ];
        return (
            _cycle,
            cycleTime( _cycle ), 
            cycle.period, 
            cycle.stat, 
            cycle.num_jurists_available,
            cycle.num_jurists_assigned,
            cycle.num_leads_available, 
            cycle.num_leads_assigned
        );
    }
    
    event CycleAdded( uint16 cycle );
    function cycleUpdate( uint _timenow ) public { // can make internal, public for now, testing 
        uint timenow = _timenow == 0? ZERO_BASE_TIME : _timenow;
        uint16 num_target = cycleIdx( timenow ) + CYCLES_AHEAD;
        for ( uint16 i = num_cycles; i < num_target; i++ ) {
            cycles[i] = Cycle( cycleTime( i ), CYCLE_PERIOD, NONE, 0, 0, 0, 0 );
            CycleAdded( i );
        }
        num_cycles = num_target;
    }
    
    event AvailabilityAdd( uint16 cycle, uint32 analyst, bool lead, uint16 leads, uint16 jurists  );
    function addAvailability( uint16 _cycle, uint32 _analyst, bool _lead) public {
        Cycle storage cycle = cycles[ _cycle ];
        if (_lead) {
            cycle.leads_available[ cycle.num_leads_available++ ] = _analyst;
        } else {
            cycle.jurists_available[ cycle.num_jurists_available++] = _analyst;
        }
        AvailabilityAdd( _cycle, _analyst, _lead, cycle.num_leads_available, cycle.num_jurists_available );
    }
    
    function selectAvailableAnalyst( uint16 _cycle, bool _lead ) public view returns ( uint16 ) {  // returns local reference to an available analyst
        Cycle storage cycle = cycles[_cycle];
        require( _lead ? cycle.num_leads_available > 0 : cycle.num_jurists_available > 0 );
        return ( _lead ? 
            uint16( randomIdx( cycle.leads_available[ 0 ], cycle.num_leads_available ) )  
            : uint16( randomIdx( cycle.jurists_available[ 0 ],cycle.num_jurists_available ) )
        );
    }
    
    // for testing, volunteer everybody to cycle
    function generateAvailabilities( uint16 _cycleId ) public {
        for ( uint32 id = 0; id < registry.num_analysts(); id++ ) { 
            addAvailability( _cycleId, id, registry.isLead( id ) );
        }
    }

    // generate availabilities for all unvolunteered current and future cycles
    function generateAllAvailabilities() public {
        for ( uint16 cycleId = cycleIdx(lasttime); cycleId < num_cycles; cycleId++ ) {
            if ( cycles[ cycleId ].num_leads_assigned == 0 && cycles[ cycleId ].num_leads_available == 0 )
                generateAvailabilities( cycleId );
        }
    }
    
    // returns analyst so can know what to do with round
    function assignAnalyst( uint16 _cycle, uint16 _analystRef, bool _lead ) public returns ( uint32 analyst ) {  // move analyst from available to assigned
        Cycle storage cycle = cycles[_cycle];
        uint16 i;
        if (_lead) {
            cycle.leads_assigned[ cycle.num_leads_assigned ] = cycle.leads_available[ _analystRef ];
            cycle.num_leads_available--;
            for ( i = _analystRef; i < cycle.num_leads_available; i++ ) cycle.leads_available[ i ] = cycle.leads_available[ i+1 ];
            analyst = cycle.leads_assigned[ cycle.num_leads_assigned++ ];
        } else {
            cycle.jurists_assigned[ cycle.num_jurists_assigned++ ] = cycle.jurists_available[ _analystRef ];
            cycle.num_jurists_available--;
            for ( i = _analystRef; i < cycle.num_jurists_available; i++ ) cycle.jurists_available[ i ] = cycle.jurists_available[ i+1 ];
            analyst = cycle.jurists_assigned[ cycle.num_jurists_assigned++ ];
        }
    }
  
    // assign available analysts from the cycle into the round
    event RoundPopulated( uint16 _cycle, uint16 _round, uint16 num_analysts, uint16 num_leads );
    function populateRound( uint16 _cycle, uint16 _round ) public {
        uint16 ref;
        uint32 analyst;
        Round storage round = rounds[ _round ];
        for ( uint16 i = 0; i < 2+JURY_SIZE; i++ ) {
            ref = selectAvailableAnalyst( _cycle, i < 2 );  // first two are bull/bear leads
            analyst = assignAnalyst( _cycle, ref, i < 2 );
            round.analysts[ round.num_analysts++ ] = RoundAnalyst( analyst, NONE ); 
            registry.roundParticipant( analyst, _round );
        }
        RoundPopulated( _cycle, _round, round.num_analysts, 2 );
    }      
  
    event RoundActivated( uint16 _cycle, uint16 _round, uint16 num_rounds_scheduled, uint16 num_rounds_active );
    function activateRound( uint16 _roundId ) public {
        rounds[ _roundId ].stat = ACTIVE;
        rounds_active[ num_rounds_active++ ] = _roundId;
        for (uint16 i = 0; i < num_rounds_scheduled; i++) { // remove from scheduled rounds
            if ( rounds_scheduled[i] == _roundId ) {
                num_rounds_scheduled--;
                for (uint16 j = i; j < num_rounds_scheduled; j++) 
                    rounds_scheduled[ j ] = rounds_scheduled[ j + 1 ];
                break;
            }
        }
        RoundActivated( rounds[ _roundId].cycle, _roundId, num_rounds_scheduled, num_rounds_active );
    }
    
    event RoundScheduled( uint16 cycle, uint16 round, uint32 token );
    function initiateRound( uint16 _cycle, uint32 _token ) public returns( uint16 ) {
        rounds[ num_rounds ] = Round( _cycle, _token, DEFAULT_ROUND_VALUE, SCHEDULED, msg.sender, 0 );
        rounds_scheduled[ num_rounds_scheduled++ ] = num_rounds;
        populateRound( _cycle, num_rounds );
        RoundScheduled( _cycle, num_rounds, _token );
        return num_rounds++;
    }
 
    event RoundFinished( uint16 _cycle, uint16 _round, uint16 num_rounds_scheduled, uint16 num_rounds_active );
    function finishRound( uint16 _roundId ) public {
        rounds[ _roundId ].stat = FINISHED;
        rounds_active[ num_rounds_active++ ] = _roundId;
        for (uint16 i = 0; i < num_rounds_active; i++){ // remove from active rounds
            if ( rounds_active[i] == _roundId ) {
                num_rounds_active--;
                for (uint16 j = i; j < num_rounds_active; j++) 
                    rounds_scheduled[ j ] = rounds_active[ j + 1 ];
                break;
            }
        }
        RoundFinished( rounds[ _roundId ].cycle, _roundId, num_rounds_scheduled, num_rounds_active );
    }   

    event CycleScheduled(uint16 _cycle, uint time);
    event CycleActivated(uint16 _cycle, uint time);
    event CycleFinished(uint16 _cycle, uint time);
    
    // cron
    event Cron(uint _lasttime, uint _timestamp);
    function cron(uint _timestamp) public {
        uint time = _timestamp == 0 ? ZERO_BASE_TIME : _timestamp; // block.timestamp
        uint16 round_id;
        uint16 i;
        Cycle storage cycle; 

        Cron(lasttime,time);
        if (time <= lasttime) return; // don't run for earlier times than already run
        cycleUpdate( time ); // start new cycles if needed

        uint16 cycle_now = cycleIdx( time );
        // uint16 cycle_last = cycleIdx( lasttime );
        uint16 cycle_schedule_idx = cycleIdx( time + SCHEDULE_TIME );
        uint16 cycle_last_schedule_idx = cycleIdx( lasttime + SCHEDULE_TIME );
    
        
        // schedule new rounds...covered tokens
        for ( uint16 icyc = cycle_last_schedule_idx + 1; icyc <= cycle_schedule_idx; icyc++ ) { 
            //uint cyc_time = cycle_time( icyc );
            uint16 cyc4 = ( icyc-1 ) % 4; // first cycle used is 1 so can pre-schedule, no activity cycle 0
            for ( uint16 itoken = 0; itoken < num_tokens; itoken++ ) {
                if ( ( itoken % 4 ) == cyc4 )  // every 4th token at this particular timeperiod 
                    initiateRound( icyc, itoken );
            }
            CycleScheduled(icyc,time);
        }

        // finish active rounds due to finish
        for ( i = 0; i < num_rounds_active; i++ ) {
            round_id = rounds_active[ i ];
            cycle = cycles[ rounds[ round_id ].cycle ];
            if (cycle.timestart + cycle.period <= time) 
            // if ( rounds[ round_id ].cycle < cycle_now )
                finishRound ( round_id );
        }

        // activate rounds due to start
        for ( i = 0; i < num_rounds_scheduled; i++ ) {
            round_id = rounds_scheduled[ i ];
            //cycle = cycles[ rounds[ round_id ].cycle ];
            // if ( cycle.timestart < time && cycle.timestart + cycle.period >= time ) 
            if ( rounds[ round_id ].cycle <= cycle_now)
                activateRound( round_id );
        }
      
        lasttime = time;
        //return (num_cycles,num_rounds,lasttime);
          
    }   
  



    /* for testing:
    address[] tok_addresses  = [
        0xc01cc4ad3bdcffc9c7c7971bece1c7b9d6e73ebb, 
        0xb0b21c80097d12a350e2e973a08ac79772eb91ad,
        0x0203aa677b449d252fcce5582317e9f5f8785289,
        0xc98da5a39438f5a533de8705c0db19717f6d0274 
    ];


    function bootstrapDummyTokens( uint8 _num ) public { 
        uint8 num = _num == 0 ? 4 : _num;
        for ( uint8 i = 0; i< num; i++ ){
            coverToken( tok_addresses[ i % 4 ], 0 );
        }
    }
    */

    
    // utilities
    function bytesToBytes32(bytes b, uint offset) private pure returns (bytes32 out) {
        for (uint i = 0; i < 32; i++) 
            out |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
    }

}





contract Survey {  // "read-only" survey questions
  uint16 public version = 1;
  uint16 num_questions = 24;  // num questions not including final
  string public questions; // ipfs hash for questions json 
  function Survey(string _questionsfile) public {
      questions = _questionsfile;
  }
}





