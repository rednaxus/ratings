pragma solidity ^0.4.19;

import "./AnalystRegistry.sol";

contract RatingAgency {
    uint8 constant VERSION_MAJOR = 0;
    uint8 constant VERSION_MINOR = 9;
    
    uint16 constant CYCLES_AHEAD = 4; // number to keep ahead of the present
    uint constant ZERO_BASE_TIME = 1514764800;// 1536796800; // e.g. jan 1 2018
    uint constant CYCLE_PERIOD =  86400 * 28; // e.g. 4 weeks
    uint constant ACTIVE_TIME = 86400 * 28;
    uint constant SCHEDULE_TIME = 86400 * 4; // 4 days before round activates
    uint16 constant JURY_SIZE = 6; /// desired jury size
    uint8 constant JURISTS_MIN = 2; // min jurists for a round
    uint16 constant DEFAULT_ROUND_VALUE = 100;
    uint constant BRIEF_DUE_TIME = 86400 * 7;
    uint constant SURVEY_DUE_TIME = 86400 * 7;

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
    uint8 constant SCHEDULED_LEAD = 9;
    uint8 constant SCHEDULED_JURIST = 10;
    uint8 constant BRIEF_DUE = 11;
    uint8 constant BRIEF_SUBMITTED = 12;
    uint8 constant FIRST_SURVEY_DUE = 13;
    uint8 constant FIRST_SURVEY_SUBMITTED = 14;
    uint8 constant SECOND_SURVEY_DUE = 15;
    uint8 constant SECOND_SURVEY_SUBMITTED = 16;
    uint8 constant ROUND_TALLIED = 17;
    uint8 constant DISQUALIFIED = 18;

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


    struct CycleAnalystStatus {
        uint8 num_volunteers;
        uint8 num_confirms;
        uint8 num_rounds;
        bytes32 rounds;
    }
    struct CycleAnalyst {
        uint32 analyst; 
        CycleAnalystStatus[2] analyst_status; // 0 for lead, 1 for jurist 
    }
    /* Cycles are the discreet periods when groups of tokens are run as Rounds */
    struct CycleRoleStatus {    // 0 lead, 1 jurist
        uint16 num_volunteers;
        uint16 num_availables;    // i.e. confirmed
        uint16 num_assigns;
        mapping ( uint16 => uint16 ) availables;  // mapping analyst in-cycle ref to num entries
    }
    struct Cycle {
        uint timestart;
        uint period;
        uint8 stat;
        CycleRoleStatus[2] statuses;
        mapping ( uint16 => CycleAnalyst ) analysts;
        uint16 num_analysts;
    }
    mapping ( uint16 => Cycle ) cycles;
    uint16 public num_cycles = 0;

    struct RoundBrief {
        uint upload_time;
        bytes32 filehash;
    }
    struct RoundAnalyst {
        uint32 analyst_id;
        uint8 stat;
    }
    struct RoundSurvey {
        bytes32 answers;  // 1-5, qualitatives at 24,25, qualitatives at
        byte qualitatives; // yes / no
        uint8 recommendation; // 1-10
        bytes32 comment;
    }

    struct Round {
        uint16 cycle;
        uint32 covered_token;
        uint16 value; // value of the round in veva token
        uint8 stat;
        address representative;
        uint8 num_analysts;

        bytes32 avg_answer;
        uint8 r1_avg;  // scaled 0->100
        uint8 r2_avg;
        uint8 sways;
        uint8 winner;

        mapping ( uint8 => RoundBrief ) briefs; // submitted briefs... 0 is bull, 1 is bear
        mapping ( uint8 => RoundAnalyst ) analysts;
        mapping ( uint8 => RoundSurvey[2] ) surveys;     // 0 for pre, 1 for post
    }
    mapping ( uint16 => Round ) rounds;
    uint16 public num_rounds = 0;

    mapping ( uint16 => uint16 ) rounds_scheduled; // scheduled rounds by id
    mapping ( uint16 => uint16 ) rounds_active;
    uint16 num_rounds_scheduled = 0;
    uint16 num_rounds_active = 0;

    address public registryAddress;

    /**
     * test data
    */
    address constant testregistry1 = 0xed6f9c80fe3cde5334e67a3cea7fd7847578d5fb;
    address[16] live_tokens = [
        0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0, //EOS
        0xf230b790e05390fc8295f4d3f60332c93bed42e2, // Tronix
        0xd850942ef8811f2a866692a623011bde52a462c1, // VeChain
        0xd26114cd6ee289accf82350c8d8487fedb8a0c07, // OMG
        0xb5a5f22694352c15b00323844ad545abb2b11028, // Icon
        0xb8c77482e45f1f44de1745f52c74426c631bdd52, // BnB
        0xe0b7927c4af23765cb51314a0e0521a9645f0e2a, // Digix
        0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a, // Populous
        0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2, // Maker
        0x744d70fdbe2ba4cf95131626614a1763df805b9e, // status
        0x168296bb09e24a88805cb9c33356536b980d3fc5, // RHOC
        0xe94327d07fc17907b4db788e5adf2ed424addff6,  // Reputation
        0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d, // Aeternity
        0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750, // Byteom
        0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74, // Walton
        0x4ceda7906a5ed2179785cd3a40a69ee8bc99c466 // Aeon
    ];

    function bootstrapTokens( ) public {
        for ( uint i = 0; i < live_tokens.length; i++ ) {
            coverToken( live_tokens[i], 0 );
        }
    }

    /**
     * Constructor
    */
    function RatingAgency( address _registry ) public {
        if ( _registry == 0 ) _registry = testregistry1;
        registryAddress = _registry;
        registry = AnalystRegistry( _registry );

        lasttime = ZERO_BASE_TIME;
        registry.update( lasttime );

        bootstrapTokens( );
    }

   /* Generates a random number from 0 to n-1 (based on the last block hash) */
    function randomIdx(uint seed, uint n) public constant returns (uint randomNumber) {
        return(uint(keccak256(block.blockhash(block.number-1), seed ))%(n-1));
    }

    /*
     *   Token methods
    */

    event TokenAdd( uint32, address);
    function coverToken( address _tokenContract, uint _timeperiod ) public {  // only specify period if different
        covered_tokens[ num_tokens ] = CoveredToken( _tokenContract, _timeperiod, msg.sender );
        TokenAdd( num_tokens, _tokenContract );
        num_tokens++;
    }

    event Log( string str, address addr );

    function coveredTokenInfo( uint32 _idx ) public view returns ( uint32, address ){
        return ( _idx, covered_tokens[ _idx ].token_addr );
    }


    /*
     ***   Round Cycler  ***
    */

    // start time for a cycle
    function cycleTime( uint16 _idx ) public pure returns ( uint ){
        return CYCLE_PERIOD * _idx / 4 + ZERO_BASE_TIME;    // cycles offset
    }

    function cycleIdx( uint time ) public pure returns ( uint16 ) {
        return( time <= ZERO_BASE_TIME ?
            0 : uint16( 4 * ( time - ZERO_BASE_TIME ) / CYCLE_PERIOD ) );
    }

    function cycleInfo ( uint16 _cycle ) public view returns ( 
        uint16, uint, uint, uint8, 
        uint16, uint16, uint16, 
        uint16, uint16,uint16 
    ) {
        Cycle storage cycle = cycles[ _cycle ];
        return (
            _cycle, cycleTime( _cycle ), cycle.period, cycle.stat,
            cycle.statuses[0].num_volunteers, cycle.statuses[0].num_availables, cycle.statuses[0].num_assigns,
            cycle.statuses[1].num_volunteers, cycle.statuses[1].num_availables, cycle.statuses[1].num_assigns
        );
    }
    
    function cycleAnalystRef( uint16 _cycle, uint32 _analyst ) public view returns ( uint16 ref ){
        Cycle storage cycle = cycles[ _cycle ];
        for ( uint16 i = 0; i < cycle.num_analysts; i++ )
            if ( cycle.analysts[ i ].analyst == _analyst ) return i;
        return 0xffff;
    }

    function cycleAnalystInfo( uint16 _cycle, uint32 _analyst ) public view returns ( 
        uint16 analyst_ref,
        uint8, uint8, uint8, bytes32,
        uint8, uint8, uint8, bytes32
    ) {
        Cycle storage cycle = cycles[ _cycle ];
        uint16 ref = cycleAnalystRef( _cycle, _analyst );
        CycleAnalyst storage ca = cycle.analysts[ ref ]; 
        return (
            ref,
            ca.analyst_status[0].num_volunteers, ca.analyst_status[0].num_confirms, 
            ca.analyst_status[0].num_rounds, ca.analyst_status[0].rounds,
            ca.analyst_status[1].num_volunteers, ca.analyst_status[1].num_confirms,
            ca.analyst_status[1].num_rounds, ca.analyst_status[1].rounds            
        );
    }

    event CycleAdded( uint16 cycle );
    
    // Create future cycles
    function cycleExtend( uint _timenow, uint8 _num ) public { // can make internal, public for now, testing
        uint timenow = _timenow == 0 ? ZERO_BASE_TIME : _timenow;
        uint16 num_target = _num == 0 ? cycleIdx( timenow ) + CYCLES_AHEAD : _num;
        for ( uint16 i = num_cycles; i < num_target; i++ ) {
            cycles[i].timestart = cycleTime( i );
            cycles[i].period = CYCLE_PERIOD;
            cycles[i].stat = NONE;
            CycleAdded( i );
        }
        num_cycles = num_target;
    }

    event CycleVolunteer( uint16 cycle, uint32 analyst, uint8 role, uint16 num_volunteers );
    function cycleVolunteer( uint16 _cycle, uint32 _analyst, uint8 _role ) public {
        Cycle storage cycle = cycles[ _cycle ];
        uint16 ref = cycleAnalystRef( _cycle, _analyst );
        if (ref == 0xffff) {
            ref = cycle.num_analysts++;
            cycle.analysts[ ref ].analyst = _analyst;
            cycle.statuses[ _role ].num_volunteers++; 
        }
        cycle.analysts[ ref ].analyst_status[ _role ].num_volunteers++;
        CycleVolunteer( _cycle, _analyst, _role, cycle.statuses[ _role ].num_volunteers );
    }

    function cycleAvailabilityRef( uint16 _cycle, uint8 _role, uint16 _analystRef ) public view returns ( uint16 ) {
        Cycle storage cycle = cycles[ _cycle ];
        CycleRoleStatus storage cs = cycle.statuses[ _role ];
        for (uint16 i = 0; i < cycle.statuses[ _role ].num_availables; i++ ){
            if ( cs.availables[ i ] == _analystRef ) return i;
        }
        return 0xffff;
    }
    function cycleConfirm( uint16 _cycle, uint32 _analyst, uint8 _role ) public {
        Cycle storage cycle = cycles[ _cycle ];
        uint16 ref = cycleAnalystRef( _cycle, _analyst );
        require( ref != 0xffff );
        cycle.analysts[ ref ].analyst_status[ _role ].num_confirms++;
        uint16 avail_ref = cycleAvailabilityRef( _cycle, _role, ref );
        CycleRoleStatus storage cs = cycle.statuses[ _role ];
        uint16 ref_avail = cycleAvailabilityRef( _cycle, _role, ref );
        if ( ref_avail == 0xffff ) {
            ref_avail = cs.num_availables++;
            cs.availables[ ref_avail ] = ref;
        }
        cs.num_availables++;
    }
    function cycleSelect( uint16 _cycle, uint8 _role ) public view returns ( uint16, uint16 ) {  // returns local reference to an available analyst
        Cycle storage cycle = cycles[_cycle];
        CycleRoleStatus storage cs = cycle.statuses[ _role ];
        require( cs.num_availables > 0 );
        uint16 ref_avail = uint16( randomIdx( cs.availables[ 0 ], cs.num_availables ) );
        return ( ref_avail, cs.availables[ ref_avail ] );
    }

    // for testing purposes--volunteer and confirm everybody to cycle
    // analysts with Lead capability volunteer twice as lead and jury
    function cycleGenerateAvailabilities( uint16 _cycle ) public {
        uint32 num_analysts = registry.num_analysts();
        for ( uint32 analyst = 0; analyst < num_analysts; analyst++ ) {
            bool isLead = registry.isLead( analyst );
            for ( uint8 role = 0; role < 2; role++ ) {
                if ( role == 0 && !isLead ) continue;
                cycleVolunteer( _cycle, analyst, role );
                cycleConfirm( _cycle, analyst, role );
            }
        }
    }

    // generate more availabilities for all current and future cycles
    function cycleGenerateAllAvailabilities() public {
        for ( uint16 cycleId = cycleIdx( lasttime ); cycleId < num_cycles; cycleId++ ) 
            cycleGenerateAvailabilities( cycleId );
    }

    // for iterating through all availabilities, or getting a single one
    function cycleAvailability( uint16 _cycle, uint8 _role, uint16 _ref_avail ) public returns ( 
        uint32, uint16, uint8 
    ) {
        Cycle storage cycle = cycles[ _cycle ];
        uint16 ref = cycle.statuses[ _role ].availables[ _ref_avail ];
        return ( cycle.analysts[ ref ].analyst, ref, cycle.analysts[ ref ].analyst_status[ _role ].num_confirms );
    }

    function cycleAvailabilityReduce( uint16 _cycle, uint8 _role, uint16 _ref_avail ) public {
        Cycle storage cycle = cycles[ _cycle ];
        CycleRoleStatus storage cs = cycle.statuses[ _role ];
        uint16 ref = cs.availables[ _ref_avail ];
        CycleAnalystStatus storage cas = cycle.analysts[ ref ].analyst_status[ _role ];
        cas.num_confirms--;
        if ( cas.num_confirms == 0 ) { // remove from avail list
            cs.num_availables--;
            for( uint16 i = _ref_avail; i < cs.num_availables; i++ ) 
                cs.availables[ i ] = cs.availables[ i + 1 ];
        }
            
    }
    event CycleAnalystAssigned( uint16 _cycle, uint16 _round, uint16 _ref, uint8 _role, uint32 _analyst );
    // returns analyst so can know what to do with round
    function cycleAssign( uint16 _cycle, uint16 _round, uint16 _ref, uint8 _role ) public returns ( uint16 ref ) {  // move analyst from available to assigned
        Cycle storage cycle = cycles[ _cycle ];
        uint16 ref_avail = cycleAvailabilityRef( _cycle, _role, _ref );
        cycleAvailabilityReduce ( _cycle, _role, ref_avail );
        CycleAnalyst storage ca = cycle.analysts[ _ref ];
        CycleAnalystStatus storage cas = ca.analyst_status[ _role ];
        cas.rounds = uint16InserttoBytes32( cas.rounds, _round, cas.num_rounds++ );
        
        CycleAnalystAssigned( _cycle, _round, _ref, _role, ca.analyst );
    }

    /*
     ***** Round ****
    */

    // assign available analysts from the cycle into the round
    event RoundPopulated( uint16 _cycle, uint16 _round, uint16 num_analysts, uint16 num_leads );
    event RoundAnalystAdded( uint16 _cycle, uint16 _round, uint32 _analyst);
    function roundPopulate( uint16 _cycle, uint16 _round ) public {
        uint16 ref;
        uint16 avail_ref;
        uint32 analyst;
        Round storage round = rounds[ _round ];
        for ( uint16 i = 0; i < 2+JURY_SIZE; i++ ) {
            ( avail_ref, ref ) = cycleSelect( _cycle, i < 2 ? 0 : 1 );  // first two are bull/bear leads
            analyst = cycleAssign( _cycle, _round, ref, i < 2 ? 0 : 1 );
            round.analysts[ round.num_analysts++ ] = RoundAnalyst( analyst, i < 2 ? SCHEDULED_LEAD: SCHEDULED_JURIST );
            RoundAnalystAdded( _cycle, _round, round.analysts[ round.num_analysts-1 ].analyst_id );
            registry.scheduleRound( analyst, _round );
        }
        RoundPopulated( _cycle, _round, round.num_analysts, 2 );
    }

    event RoundActivated( uint16 _cycle, uint16 _round, uint16 num_rounds_active );
    function roundActivate( uint16 _cycle, uint32 _token ) public returns ( uint16 ){ 
        uint16 round = num_rounds++;
        Round storage r     = rounds[ round ];    
        r.cycle             = _cycle;
        r.covered_token     = _token;    
        r.value             = DEFAULT_ROUND_VALUE;
        r.stat              = ACTIVE;
        r.representative    = msg.sender;
        rounds_active[ num_rounds_active++ ] = round;
        roundPopulate( _cycle, round );
        for (uint8 a = 0; a < r.num_analysts; a++ ) {
            RoundAnalyst storage analyst = r.analysts[ a ];
            analyst.stat = a<2 ? BRIEF_DUE: FIRST_SURVEY_DUE;
            registry.activateRound( analyst.analyst_id, round );
        }       
        RoundActivated( r.cycle, round, num_rounds_active );
    }
    
    event RoundFinished( uint16 _cycle, uint16 _round, uint16 num_rounds_active );
    function roundFinish( uint16 _round ) public {
        rounds[ _round ].stat = FINISHED;
        roundTally( _round );
        for (uint16 i = 0; i < num_rounds_active; i++){ // remove from active rounds
            if ( rounds_active[i] == _round ) {
                num_rounds_active--;
                for (uint16 j = i; j < num_rounds_active; j++)
                    rounds_active[ j ] = rounds_active[ j + 1 ];
                break;
            }
        }
        RoundFinished( rounds[ _round ].cycle, _round, num_rounds_active );
    }

    event TallyLog( uint16 round, uint8 analyst, uint8 recommendation);
    event TallyWin( uint16 round, uint8 winner );
    function roundTally( uint16 _round ) public {
        Round storage round = rounds[ _round ];
        /* sway of answers , not used right now
        int[] memory sway = new int[](32);
        for (uint i; i < 32; i++) {
            for (uint8 a; a < round.num_analysts; a++) {
                sway[i] = ( sway[i] * int(i) + int(round.surveys[1][a].answers[i]) - int(round.surveys[0][a].answers[i]) ) / ( i+1 ) ;
            }
            round.avg_sway[ i ] = byte( sway[ i ] );
        }
        */
        uint8 n = 0;
        for ( uint8 aref = 2; aref < round.num_analysts; aref++ ) {
            TallyLog( _round, aref, round.surveys[aref][0].recommendation );
            TallyLog( _round, aref, round.surveys[aref][1].recommendation );

            //if (round.surveys[a][0] && round.surveys[a][1] ) {
                round.r1_avg = (round.r1_avg*n + 10*round.surveys[aref][0].recommendation) / (n+1);
                round.r2_avg = (round.r2_avg*n + 10*round.surveys[aref][1].recommendation) / (n+1);
                n++;

            //}
        }
        TallyLog( _round, 100, round.r1_avg );
        TallyLog( _round, 101, round.r2_avg );

        if ( round.r2_avg > round.r1_avg + 20) round.winner = 0;
        else if ( round.r2_avg < round.r1_avg - 20) round.winner = 1;
        else if ( round.r2_avg > 50 ) round.winner = 0;
        else round.winner = 1;

        // payoff in token and reputation, just leads for nowREWARD_ROUND_TOKENS_LOSER
        for ( uint8 i = 0; i < 2; i++ )
            registry.rewardLead( round.analysts[i].analyst_id, _round, round.value, int8(round.winner == i ? 1 : 0) );
        for ( i = 2; i < round.num_analysts; i++ )
            registry.rewardJurist( round.analysts[ i ].analyst_id, _round, round.value, 0 ); // for now, every jurist is a winner, pending tally above

        TallyWin( _round, round.winner );

    }
    
    function roundBriefs( uint16 _round ) public view returns ( uint, bytes32, uint, bytes32 ){
        Round storage round = rounds[ _round ];
        return (
            round.briefs[ 0 ].upload_time, round.briefs[ 0 ].filehash, 
            round.briefs[ 1 ].upload_time,round.briefs[ 1 ].filehash 
        );
    }

    function roundInfo ( uint16 _round ) public view returns (
        uint16, uint16, uint32, uint16, uint8, uint8
    ) {
        Round storage round = rounds[ _round ];
        return (
            _round, round.cycle, round.covered_token,
            round.value, round.stat, round.num_analysts
        );
    }

    function roundSummary ( uint16 _round ) public view returns (
        bytes32, uint8, uint8, uint8, uint8
    ) {
        Round storage round = rounds[ _round ];
        return (
            round.avg_answer,
            round.r1_avg,  // scaled 0->100
            round.r2_avg,
            round.sways,
            round.winner
        );
    }
    function roundAnalyst( uint16 _round, uint32 _analyst ) public view returns (uint8, uint8) {
        Round storage round = rounds[_round];
        for ( uint8 i=0; i < round.num_analysts; i++){
            if ( round.analysts[ i ].analyst_id == _analyst )
                return( i, round.analysts[ i ].stat ); 
        }
        return ( 0, NONE );    // not found, no status
    }
    function roundAnalystId( uint16 _round, uint8 _inround_analyst) public view returns (uint32) {
        return ( rounds[_round].analysts[ _inround_analyst ].analyst_id );        
    }
    event SurveySubmitted( uint16 _round, uint32 _analyst, uint8 _idx, bytes32 _answers, byte _qualitatives, uint8 _recommendation );
    function submitSurvey(
        uint16 _round,
        uint8 _analyst, // analyst by round index
        uint8 _idx,              // pre (0), or post (1)
        bytes32 _answers,
        byte _qualitatives,
        uint8 _recommendation,
        bytes32 _comment
    ) public {
        Round storage round = rounds[ _round ];
        // do some checks here
        RoundAnalyst storage analyst = round.analysts[ _analyst ];

        //require( _idx==0 && analyst.stat == FIRST_SURVEY_DUE || _idx==1 && analyst.stat == SECOND_SURVEY_DUE );
        round.surveys[_analyst][_idx] = RoundSurvey( _answers, _qualitatives, _recommendation, _comment );
        analyst.stat = _idx == 0 ? FIRST_SURVEY_SUBMITTED : SECOND_SURVEY_SUBMITTED;
        SurveySubmitted( _round, _analyst, _idx, _answers, _qualitatives, _recommendation );
    }

    event BriefSubmitted( uint16 _round, uint8 _analyst, bytes32 _file );
    function submitBrief( uint16 _round, uint8 _analyst, bytes32 _file ) public {
        Round storage round = rounds[ _round ];
        round.briefs[ _analyst ] = RoundBrief( lasttime, _file);
        round.analysts[ _analyst ].stat = BRIEF_SUBMITTED;
        BriefSubmitted( _round, _analyst, _file );
    }

    /* get next 16 rounds */
    function roundsForToken ( uint16 _token, uint16 startAt ) public view returns (uint16 _numFound, uint16[16] _rounds){
        _numFound = 0;
        for (uint16 i = 0; i < num_rounds; i++){
            if (rounds[i].covered_token == _token){
                if (_numFound >= startAt) {
                    _rounds[_numFound - startAt] = i;
                }
                _numFound++;
                if (_numFound == 16 + startAt) break;
            }
        }
        _numFound = _numFound % 16;
    }
    event CycleScheduled( uint16 _cycle, uint time );
    event CycleActivated( uint16 _cycle, uint time );
    event CycleFinished( uint16 _cycle, uint time );

    // cron
    event Cron( uint _lasttime, uint _timestamp );
    function cron( uint _timestamp ) public {
        uint time = _timestamp == 0 ? ZERO_BASE_TIME : _timestamp; // block.timestamp
        uint16 round_id;
        uint16 i;

        Cron( lasttime,time );
        if (time <= lasttime) return; // don't run for earlier times than already run
        registry.update( time ); // keep time in sync

        cycleExtend( time, 0 ); // start new cycles if needed

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
                    roundActivate( icyc, itoken );
            }
            CycleScheduled( icyc, time );
        }

        // finish active rounds due to finish
        for ( i = 0; i < num_rounds_active; i++ ) {
            round_id = rounds_active[ i ];
            Cycle storage cycle = cycles[ rounds[ round_id ].cycle ];
            if (cycle.timestart + cycle.period <= time)
            // if ( rounds[ round_id ].cycle < cycle_now )
                roundFinish( round_id );
        }

        // activate rounds due to start
        for ( i = 0; i < num_rounds_scheduled; i++ ) {
            round_id = rounds_scheduled[ i ];
            //cycle = cycles[ rounds[ round_id ].cycle ];
            // if ( cycle.timestart < time && cycle.timestart + cycle.period >= time )
            // !! note: do this  if ( rounds[ round_id ].cycle <= cycle_now)
            //    roundActivate( round_id );
        }

        lasttime = time;
        //return (num_cycles,num_rounds,lasttime);

    }






    // utilities
    function uint16InserttoBytes32( bytes32 _bytes, uint16 _ui, uint8 _position ) public pure returns ( bytes32 ){
        return bytes32( ( bytes32( _ui ) << ( (15 - _position) * 16 ) ) | _bytes );
    }
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
