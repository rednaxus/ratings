pragma solidity ^0.4.18;

import "./Aleph.sol";
import "./AnalystRegistry.sol";
//import "./Owned.sol";
//import "./erc20-api.sol";


contract Brief {
  uint upload_time;
  address filehash;
}

contract Round {
  using Aleph for *;
  
  //uint8 constant BULL = 0;
  //uint8 constant BEAR = 1;
  uint8 constant JURISTS_MIN = 2;
  
  uint32 public covered_token;
  uint public round_value; // value of the round in veva token
  address public representative;


  address[2] public lead_briefs; // submitted briefs....0 is bull, 1 is bear  

  // uint32 constant JURISTS_MIN = 2;
  enum round_state { PENDING, SCHEDULED, ACTIVE, FINISHED, CANCELLED }
  enum analyst_status { NONE, AVAILABLE, ASSIGNED, CONFIRMED, CANCELLED } 
  
  round_state state; 
  struct RoundAnalyst {
    uint32 analyst_id;
    analyst_status status;
  }
  mapping ( uint8 => RoundAnalyst ) analysts; // round analysts by local id... bull=0,bear=1, ...jurists
  uint8 num_analysts = 2; // bull, bear implicit
  
  //uint8[2] public leads; // ref to above... lead[0] is bull, lead[1] is bear

  struct Eval {// Round evaluations
    bytes32 questions;  // 1-5, qualitatives at 24,25, qualitatives at 
    bool[2] qualitatives; // yes / no
    int8 recommendation; // 1-10
    bytes32 comment;
  }
  //Eval[20] first_eval;
  //Eval[20] second_eval;



  function Round( uint16 _coveredtoken, uint _value ) public {
    covered_token = _coveredtoken;  
    round_value = _value;
    state = round_state.PENDING;
    analysts[0] = RoundAnalyst(0,analyst_status.NONE); // bull
    analysts[1] = RoundAnalyst(0,analyst_status.NONE); // bear
  }
  
  function submit_eval(bytes32 questions, bytes32 comment, uint8 recommendation, bool qual1, bool qual2) public pure {
      // parse it
  }
  
  function influence() public constant returns (int8){
      int8 composite_diff = 0;
      for (uint8 i=0;i<24;i++){
       //   composite_diff += second_eval[i].recommendation - first_eval[i].recommendation;
      }
      return composite_diff;
  }
  


  /*function remove_jury_member( uint32 _analyst ) public {
    uint32 jurist = jurists.find( _analyst );
    jurists.remove ( jurist );
    return false; // not found
      
  }*/

  function count_jury_confirmed() constant internal returns (uint) {
    uint8 num = 0;
    for ( uint8 i = 2; i < num_analysts; i++ ) {
      if ( analysts[i].status == analyst_status.CONFIRMED ) num++; 
    }    
    return num;
  }

  function is_ready() public constant returns (bool) {
      return (analysts[0].analyst_id != 0 && analysts[1].analyst_id != 0 && count_jury_confirmed() > JURISTS_MIN);
  }

  function set_lead( uint32 _analyst, bool _bull ) public {
    analysts[_bull ? 0 : 1] = RoundAnalyst( _analyst, analyst_status.NONE );
  }

  function add_jurist(uint32 _analyst) public {
    analysts[num_analysts++] = RoundAnalyst( _analyst, analyst_status.NONE );
  }

  function find_analyst( uint32 _analyst ) public constant returns (uint8) {
    for ( uint8 i = 0; i < num_analysts; i++ ) {
      if ( analysts[i].analyst_id == _analyst  ) return i;
    }
    require(false); 
  }
  function cancel_analyst( uint32 _analyst ) public {
    uint8 ref = find_analyst( _analyst );
    analysts[ref].status = analyst_status.CANCELLED;
  }
  function confirm_analyst( uint32 _analyst ) public {
      analysts[ find_analyst( _analyst ) ].status = analyst_status.CONFIRMED;
  }
  function schedule() public {
      state = round_state.SCHEDULED;
  }
  function activate() public {
      state = round_state.ACTIVE;      
  }
  function finish() public {
      state = round_state.FINISHED; 
  }
}

contract RoundCycle {
  using Aleph for *;
  uint public timestart;
  uint public period;
  Aleph.itMapUintUint available_jurists;
  Aleph.itMapUintUint available_leads;
  Aleph.itMapUintUint assigned_jurists;
  Aleph.itMapUintUint assigned_leads;
  
  enum cycle_state { PENDING, SCHEDULED, ACTIVE, FINISHED, CANCELLED }
  cycle_state state;
  
  function RoundCycle (uint _timestart,uint _period) public {
      timestart = _timestart;
      period = _period;
      state = cycle_state.PENDING;
  }
    //mapping (uint32 => address) leads; 
 // add availability based on cycle index
  function add_availability(uint32 _analystid,bool _lead) public {
    uint32 idx = uint32(available_leads.size());
    if (_lead) available_leads.insert(idx,_analystid); 
    else available_jurists.insert(idx,_analystid);
  }
  function num_avail() public constant returns ( uint, uint ){
    return (available_leads.size(),available_jurists.size());      
  }
  function num_assigned() public constant returns ( uint, uint ){
      return ( assigned_leads.size(), assigned_jurists.size() );
  }
  function random_avail(bool _lead) public constant returns (uint32) { // returns reference to an available analyst
    uint32 idx;
    if (_lead) {
        idx = uint32(Aleph.randomIdx(available_leads.getValueByIndex(0),available_leads.size()));
        return uint32(available_leads.getValueByIndex(idx));
    } else {
        idx = uint32(Aleph.randomIdx(available_jurists.getValueByIndex(0),available_jurists.size()));
        return uint32(available_jurists.getValueByIndex(idx));
    }
  }
  function assign_analyst(uint32 _analystid,bool _lead) public {
    uint32 id;
    if (_lead) {
      id = uint32(available_leads.find(_analystid));
      available_leads.remove(id);
      assigned_leads.insert(assigned_leads.size(),_analystid);      
    } else {
      id = uint32(available_jurists.find(_analystid));
      available_jurists.remove(id);
      assigned_jurists.insert(assigned_jurists.size(),_analystid); 
    }
  }
}
  
contract RatingAgency {
  using Aleph for *;
  
  uint16 constant CYCLES_AHEAD = 4; // number to keep ahead of the present
  uint constant ZERO_BASE_TIME = 1514764800;// 1536796800; // e.g. jan 1 2018 
  uint constant CYCLE_PERIOD =  86400 * 28; // e.g. 4 weeks
  uint constant ACTIVE_TIME = 86400 * 28;
  uint constant SCHEDULE_TIME = 86400 * 4; // 4 days before round activates 
  uint16 constant JURY_SIZE = 6;
  uint16 constant DEFAULT_ROUND_VALUE = 100;

  uint constant INFINITY = 0xffffff;
  uint16 constant REPUTATION_LEAD = 12;
  
   //string public name;
  uint public lasttime = ZERO_BASE_TIME;
  AnalystRegistry registry;

  struct CoveredToken {
      // rules:
      address token_addr;
  //    uint timestart;
      uint timeperiod;
      address representative;
  }
  mapping( uint => CoveredToken) covered_tokens;
  uint32 public num_tokens = 0;

  mapping (uint16 => address) cycles; // RoundCycle
  uint16 public num_cycles = 0;
  
  mapping (uint16 => address) rounds;
  uint16 public num_rounds = 0;

  Aleph.itMapUintUint rounds_scheduled; // scheduled rounds by id
  Aleph.itMapUintUint rounds_active; // active round ids
  
    /**
     * Constructor 
    */
    address testregistry1 = 0xaf44039d2789721ae22565ab687ca9c4eaaade54;
    function RatingAgency(
        address _registry
    ) public {
        if (_registry == 0) _registry = testregistry1;
        registry = AnalystRegistry(_registry);
        lasttime = ZERO_BASE_TIME;
        bootstrap_dummy_tokens(4);
    }

    event TokenAdd(uint32,address);
    function cover_token(address _tokenContract,uint _timeperiod) public {  // only specify period if different
        covered_tokens[num_tokens] = CoveredToken(_tokenContract,_timeperiod,msg.sender);
        TokenAdd(num_tokens,_tokenContract);
        num_tokens++;
    }
    function get_token_addr(uint32 idx) public view returns (uint32,address){
        return (idx,covered_tokens[idx].token_addr);
    }
    /*
    event TokenList(uint32 idx,address token);
    function apiTokenList(uint32 _num) public returns (uint32 num) {
        num = _num == 0 ? num_tokens: _num;
        for ( uint32 i = 0; i < num; i++ ) {
            TokenList(i,covered_tokens[i].token_addr);        
        }
    }
    
  function findToken(address _tokenContract) public constant returns (uint) {
    //if (token.token_addr == _tokenContract && msg.sender == token.representative) {
    for(uint idx=0;idx<num_tokens;idx++) 
        if (covered_tokens[idx].token_addr == _tokenContract) return idx;
    return INFINITY;
  }
  function removeToken(address _tokenContract) public {
    uint idx = findToken(_tokenContract);
    require(idx!=INFINITY);
    delete covered_tokens[idx];
    for (uint jdx=idx;jdx<num_tokens-1;jdx++) covered_tokens[jdx] = covered_tokens[jdx+1];
    num_tokens--;
  }
  */
  function activate_round( uint16 _roundidx ) public {
     Round round = Round( rounds[_roundidx] );
     round.activate();
  }

  function populate_round( uint16 _roundcycle, uint16 _roundidx ) public {
    RoundCycle cyc = RoundCycle( cycles[_roundcycle] );
    Round round = Round( rounds[_roundidx] );

    for (uint16 ilead = 0; ilead<=1; ilead++) {
        uint32 lead = cyc.random_avail(true);
        cyc.assign_analyst(lead,true);
        round.set_lead( lead, ilead == 0 ); 
    }

    for( uint16 i = 0; i < JURY_SIZE; i++ ) {
      uint32 jurist = cyc.random_avail(false);
      round.add_jurist( jurist );
    }
  }      
  
  function schedule_round( uint16 _cycle, uint16 _coveredtoken_id ) public returns( uint16 ){
    Round round = new Round( _coveredtoken_id, DEFAULT_ROUND_VALUE );
    round.schedule();
    rounds[num_rounds] = address( round );
    // rounds_scheduled.insert( num_rounds, num_rounds );
    // populate_round( _cycle, num_rounds );
    return num_rounds++;
  }

  function get_analyst_rounds() public constant returns ( address, address ){
    Analyst analyst = Analyst(registry.getByAddress(msg.sender));
    return (analyst.invited_round(),analyst.active_round());
    
  }
  function confirm_round( uint16 _round ) public {
    uint32 analyst = registry.getId( msg.sender );
    Round round = Round(rounds[_round]);
    round.confirm_analyst(analyst);
  }
  function cancel_round( uint16 _round ) public {
    uint32 analyst = registry.getId( msg.sender );
    Round round = Round( rounds[_round] );
    round.cancel_analyst( analyst );
  }

  // cron  
  uint16 cycle_scheduled_idx;   // waiting for analysts start idx
  uint16 cycle_active_idx;      // active now start
  uint16 cycle_finished_idx;    // finished now start idx

  event Round_Scheduled(uint16 cycle, uint16 round, uint16 token);
  event Log(string str);
  function cron(uint _timestamp) public returns (string) {
    uint time = _timestamp == 0 ? ZERO_BASE_TIME: _timestamp; // block.timestamp
    uint16 round_id;
    uint16 icyc;
    uint16 itoken;
    // need phase for invite then apply
    
    // changes to analysts, new, reputation updates, promotions

    // rounds selected to mail to round participants
    // if crossed into new round cycles
    
    // new pending rounds
    update_cycles(time);

    uint16 cycle_now_idx = cycle_idx( time );
    uint16 cycle_last_idx = cycle_idx( lasttime );
    uint16 cycle_schedule_idx = cycle_idx( time + SCHEDULE_TIME );
    uint16 cycle_last_schedule_idx = cycle_idx( lasttime + SCHEDULE_TIME );
    

    uint16 num_done = 0;
    for ( icyc = cycle_last_schedule_idx+1; icyc <= cycle_schedule_idx; icyc++ ) { 
        // schedule new rounds...covered tokens coming into play
        //uint cyc_time = cycle_time( icyc );
        uint16 cyc4 = (icyc-1) % 4; // first cycle used is 1 so can pre-schedule, no activity cycle 0
        for ( itoken = 0; itoken < num_tokens; itoken++ ) {
            // every 4th token at this particular timeperiod
            if ( (itoken % 4) == cyc4 ) { 
                round_id = schedule_round( icyc, itoken );
                Round_Scheduled( icyc, round_id, itoken );
            }
        }
    }
/*
    // finish active rounds due to finish
    for ( i=0; i<rounds_active.size(); i++ ) {
      uint16 round_id = rounds.getKeyByIndex(i);
      round = Round(round_addr);
      if (round.timestart()+round.timeperiod() < time) { // deactivate the round
        round.finish();
        rounds_active.remove(  );
        // event!
      }
    }
    
    // activate rounds due to start
    for (i=0;i<scheduled_rounds.size();i++){
      round_addr = rounds.getKeyByIndex(i);
      round = Round(round_addr);
      // check round for activation, change any user statuses
      if (round.timestart() < time && round.timestart()+round.timeperiod() >= time) {
            scheduled_rounds.remove(round);
            // !check on whether confirmations are done
            if (round.isReady()) {
              round.setStatus(Round.round_status.ACTIVE);
              active_rounds.insert(round,round);
            } else { // cancel the round
              round.setStatus(Round.round_status.CANCELLED);
            }

            // event!
        }
      
    }
    // move active cycle if needed
    
   
    */
    
    lasttime = time;
    return '{"status":"done"}';
          
  }   
  


    
  address[] tok_addresses  = [
      0xc01cc4ad3bdcffc9c7c7971bece1c7b9d6e73ebb, 
      0xb0b21c80097d12a350e2e973a08ac79772eb91ad,
      0x0203aa677b449d252fcce5582317e9f5f8785289,
      0xc98da5a39438f5a533de8705c0db19717f6d0274 
  ];

  function bootstrap_dummy_tokens(uint8 _num) public {
    uint8 num = _num == 0 ? 4 : _num;
    for ( uint8 i = 0; i< num; i++ ){
        cover_token(tok_addresses[i % 4],0);
    }
  }
  // Round Cycles
  event Cycle_Added(uint16 cycle);
  
  function update_cycles(uint _timenow) internal { 
    uint timenow = _timenow == 0? ZERO_BASE_TIME : _timenow;
    uint16 num_target = cycle_idx( timenow ) + CYCLES_AHEAD;
    for ( uint16 i = num_cycles; i < num_target; i++ ) {
      cycles[i] = new RoundCycle( cycle_time(i), CYCLE_PERIOD );
      Cycle_Added( i );
    }
    num_cycles = num_target;
  }

  // get start time
  function cycle_time( uint16 _idx ) public pure returns (uint){
    return CYCLE_PERIOD * _idx / 4 + ZERO_BASE_TIME;    // cycles offset
  }

  function cycle_idx( uint time ) public pure returns (uint16) {
    if (time <= ZERO_BASE_TIME) return 0;
    return uint16(4 * (time - ZERO_BASE_TIME) / CYCLE_PERIOD);
  }
  

  function get_roundcycle( uint16 _cycleIdx ) public constant returns (address) {
      return cycles[_cycleIdx];
  }
  
  // for testing
  event Availability_Add( uint16 cycle, uint32 analyst, bool lead );
  function generate_availabilities( uint16 _cycleIdx ) public {
    RoundCycle cycle = RoundCycle( cycles[_cycleIdx] );
    for ( uint32 id = 0; id < registry.num_analysts(); id++ ) { // add everybody to cycle
        Analyst analyst = Analyst( registry.getById(id) );
        cycle.add_availability( id, analyst.reputation() >= REPUTATION_LEAD ); 
        Availability_Add( _cycleIdx, id, analyst.reputation() >= REPUTATION_LEAD );
    }
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





