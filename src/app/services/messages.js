/*  NOTES  */

/*

toAdd:
1. store.user.info.newLevel — bool noting whether a new level has been achieved
2. store.user.info.level - array showing level progression
3. store.user.info.new_referrals_available - int showing number of referrals user has available (or maybe array?)
4. rounds.data[] -> timestamp (when round will start or did start)
5. confirmed rounds


ToDo:
1. fix New Token Added timestamp
2. add new tokens -> timestamp PLUS array elements
3. -------------
4. make sure Analyst Messages makes sense and uses all data
5. clean up coding indentations, etc.
6. clean up {data}
7. condense code (reuse vars, etc)
8. linkage
9. let ==> var



toAskAlan: Minor Bugs and Questions

1. round data not showing up on first hot reload? (i.e. round_finished; round_scheduled)
2. timestamps:  Is it enough to code (now + {seconds})?

*/



/* TIMES USED
1 hour: 3600 seconds
1 day: 86400 seconds
*/


import config from '../config/appConfig'

import { cyclesByStatus } from './analystStatus'

//import { store } from '../Root'

import { referralCode } from '../services/referralCode.js'

const ms = secs => secs * 1000

export const generateMessages = ( { user, cycles, rounds, tokens, timestamp } ) => {
	//console.log('generate messages', 'user',...user,'cycles',...cycles,'rounds',...rounds,'tokens',...tokens,timestamp)

	const getToken = id => tokens.find( token => token.id == id )
	const getRound = id => rounds.find( round => round.id == id )

	let messages = []

	//const { tokens, cycles, rounds } = store.getState()

	//const s = store.getState()
	//if (!s.user || !s.user.info ) return messages

	//console.log('state in messages',s)
	//console.log('user',s.user.info)

	//const user = s.user.info

	let now = timestamp   //delete this later so everything will still compile with old code.
	//let oneHour = 3600 /*seconds*/
	//let oneDay = 86400 /*seconds*/   //delete all of this later


  //let comingSignupCycles = cycles.filter( cycle => !cycle.analyst_status && cycle.timestart > now )
  //let comingCycles = cycles.filter( cycle => cycle.analyst_status && cycle.timestart > now )
  //let activeCycles = cycles.filter( cycle => cycle.analyst_status && cycle.timestart <= now && cycle.timefinish >= now )

  //let activeRounds = []



  let {
    comingSignupCycles,
    comingVolunteerCycles,
    comingConfirmedCycles,
    activeCycles,
    finishedCycles
  } = cyclesByStatus( { cycles, rounds, tokens, timestamp } )

  const is_recent = item => config.is_recent( item.timestamp, now )
  const is_recent_period = item => config.is_recent_period( item.timestamp, now )

/********for testing -- 'if' statement to hold and make NOT appear ********/
/*let testVariable = 0

//Rounds
user.rounds.scheduled = [3, 0, 5, 0, 2]
user.rounds.active = [3, 4, 0, 6]
user.rounds.finished = [8, 9, 0, 7]
*/


	/********** BEGIN MESSAGES **********/

	/***** New Round Scheduling *****/
	if (comingSignupCycles.length) {
		messages.push({
			type: 'new_round_scheduling',
			priority: 1,
			signupCycles:comingSignupCycles.length
		})
	}

	/***** Round Scheduled ******/
	comingConfirmedCycles.map( cycle =>
		messages.push({
			type: 'round_scheduled',
			priority: 2, //'action-small',
			role: cycle.role,
			due: config.cycleTime( cycle.id + 1, true ),
			now: ms( timestamp ),
			roundValue: config.DEFAULT_ROUND_VALUE
		})
	)

	/***** Round Activated *****/
	activeCycles.map( cycle => {
		let token  = getToken( cycle.token )
		let round = rounds.find( round => round.id === cycle.round )
		if ( is_recent( { timestamp: config.cycleTime( cycle.id ) } ) ) messages.push({
			type: 'round_activated',
			priority: 0,
			role: cycle.role,
			start: ms( config.cycleTime( cycle.id ) ),
			due: ms( config.cycleTime( cycle.id ) + config.CYCLE_PERIOD / config.CYCLE_SURVEY_DUE ),
			now: ms( timestamp ),
			cycle: cycle.id,
			round: cycle.round,
			tokenId: token.id,
			tokenName: token.name
		})
		messages.push({
			type: 'rounds_in_progress',
			priority: 0,
			start: ms( config.cycleTime( cycle.id ) ),
			now: ms( timestamp ),
			role: cycle.role,
			tokenId: token.id,
			tokenName: token.name,
			round: round.id,
			roundValue: round.value
		})
	})

	/***** Round Finished *****/
	finishedCycles.map( cycle => {
		//console.log('****',cycle,...tokens)
		let round = rounds.find( round => round.id == cycle.round )
		let token = getToken( cycle.token )
		messages.push({
			type: 'round_finished',
			priority: 0,
			role: cycle.role,
			start: ms( config.cycleTime( cycle.id ) ),
			now: ms( timestamp ),
			tokenId: token.id,
			tokenName: token.name,
			tokenAddress: token.address,
			round: cycle.round,
			roundValue: round.value
		})
	})


	/***** Recent Payments *****/

  console.log('reward events',user.reward_events)

	user.reward_events.forEach( ( reward, idx ) => { 
		if ( !config.reward_is_tokens( reward ) || !is_recent( reward ) ) return
		messages.push({
			type: 'payment',
			priority: 0,
			tokens: reward.value,
			balance: user.token_balance
		})
	})

	/***** Reputation Score *****/
	/* 
		Recent updates in reputation points
	*/
	user.reward_events.forEach( ( reward, idx ) => { 
		if ( !config.reward_is_reputation( reward ) || !is_recent( reward ) ) return
		messages.push({
			type: 'reputation_score',
			priority: 0,
			reputation:user.reputation,
			new_points: reward.value
		})
	})

	/***** Level Change (i.e. promotion) *****/
	/*
	    Show any level changes for a cycle period
	    Show additonal referrals for level change
	*/
	user.reward_events.forEach( ( reward, idx ) => { 
		//console.log(reward,config.reward_is_promotion(reward),is_recent_period(reward))
		if ( !config.reward_is_promotion( reward ) || !is_recent_period( reward ) ) return	
		messages.push({
			type: 'new_level',
			priority: 0,
			previous_level: reward.ref - 1,
			new_level: reward.ref 
		})
		messages.push({
			type: 'additional_referrals',
			priority: 1,
			newRefsAvail: config.LEVELS[ reward.ref ].referrals,
			referrals: user.referral_balance,
			referrals_made: user.num_referrals
		})
	})


	/*
	    uint8 constant REWARD_REFERRAL = 1;

    uint8 constant REWARD_ROUND_TOKENS_WINNER = 2;
    uint8 constant REWARD_ROUND_TOKENS_LOSER = 3;
    uint8 constant REWARD_ROUND_TOKENS_JURY_TOP = 4;
    uint8 constant REWARD_ROUND_TOKENS_JURY_MIDDLE = 5;
    uint8 constant REWARD_ROUND_TOKENS_JURY_BOTTOM = 6;
    uint8 constant REWARD_REFERRAL_TOKENS = 7;

    uint8 constant REWARD_ROUND_POINTS_WINNER = 8;
    uint8 constant REWARD_ROUND_POINTS_LOSER = 9;
    uint8 constant REWARD_ROUND_POINTS_JURY_TOP = 10;
    uint8 constant REWARD_ROUND_POINTS_JURY_MIDDLE = 11;
    uint8 constant REWARD_ROUND_POINTS_JURY_BOTTOM = 12;
    uint8 constant REWARD_ROUND_POINTS_NEGATIVE = 13;

    uint8 constant REWARD_BONUS = 19;
    uint8 constant REWARD_PROMOTION = 20;
    uint8 constant REFERRAL_POINTS = 21;
    */

	/* toDo:  timestamp restrictions?  maybe.  Otherwise, ready for testing
	*/



	/***** New Tokens added *****/
	/* 
			new tokens being added to the system within CYCLE_RECENT (e.g. 1 week)
	*/
	tokens.forEach( ( token, idx ) => {	
		if ( is_recent( token) ) messages.push({
			type:'token_added',
			priority: 0,
			name: token.name,
			id: token.id,
			timestamp: token.timestamp
		})
	})

	//console.log('generated messages', messages )
	return messages



/***** Rounds in progress *****/
/* reminds user about rounds that they are currently participating in */
/* if round.active, remind user */

	/* toDo: ready for testing
	*/

	var getActiveRoundId
	var activeRound
	var activeCoveredToken
	var getActiveTokenName
	var roundTokenA

	for (var i=1; i<16; i++) {
		getActiveRoundId = user.rounds.active[user.rounds.active.length-i]  /* get round ID */

		//console.log()
		let activeCellLog = [user.rounds.active.length-i]
		console.log ("Round Active Test -- Active Round Array Member #", i, "(", activeCellLog, "): ", getActiveRoundId)  //if nothing in array, comes back Undefined

		activeRound = rounds.find( round => round.id == getActiveRoundId )  /*find round ID in rounds data */

		if (activeRound) {

			activeCoveredToken = activeRound.covered_token					/* get covered Token */

			getActiveTokenName = getToken( activeCoveredToken )  /*find covered Token */

			roundTokenA = getActiveTokenName.name										/* set to string variable */

			if (roundTokenA) {

				messages.push({
					type: 'rounds_in_progress',
					priority: 'info',
					start: activeRound.timestamp,
					analyst:'lead',
					roundToken: roundTokenA,
					roundValue: activeRound.value
				})
			}
		}
	}


/***** Sponsored analyst joins *****/
/* lets user know when an analyst they referred joins the system */
/* HOW */

	/* toDo: 1) figure out how to do this
	*/

	if (testVariable == 1) {
		messages.push({
			type: 'sponsored_analyst_joins',
			priority: 'info',
			analyst:22,
			reputation_points:3
		})
	}


	/***** New ratings in *****/
	/* lets user know when new ratings are in */
	/* HOW */

	/* toDo: 1) figure out how to do this
	*/

	if (testVariable == 1) {

		messages.push({
			type: 'new_ratings',
			priority: 'info',
			rounds:[22,33,34]
		})
	}


	/***** make a referral *****/
	/* reminds user to use any available referrals */
	/* should show up whenever there are unused referrals */


//if we decide to use keypairs
	let { identity } = referralCode.getRefCodePair()


	if (user.num_referrals) {
		messages.push({
			type: 'make_referral',
			priority: 'action-big',
			refCode: identity,
			unused_refs: user.num_referrals.length
		})
	}


/***** JURIST Round Starting *****/
/* Reminds Jurists that a round is starting*/
/* if JURIST, and if they are in an upcoming round, display */

	/* toDo: ready for testing
	*/

	//testData
	/*
	rounds[1] = {
		analyst: 1,
		analyst_status: 9,
		briefs: [],
		covered_token: 2,
		cycle: 1,
		id: 1,
		inround_id: 0,
		num_analysts: 8,
		status: 2,
		timestamp: 1514764901,
		value: 10
	}
	*/

	//for testing only
	//rounds[1].timestamp = now-1

	var getStartingRoundId
	var startingRound
	var startingCoveredToken
	var getStartingTokenName
	var roundTokenStart
	let displayRSjurist = false;
	let displayRStime = false;


	for (var i=1; i<16; i++) { 

		getStartingRoundId = user.rounds.scheduled[user.rounds.scheduled.length-i]  /* get round ID of scheduled rounds*/

		//console.log()
		let startingCellLog = [user.rounds.scheduled.length-i]
		console.log ("Round Starting Test -- Starting Round Array Member #", i, "(", startingCellLog, "): ", getStartingRoundId)  //if nothing in array, comes back Undefined

		startingRound = rounds.find( round.id == getStartingRoundId )  /*find round ID in rounds data */

		if (startingRound) {

			startingCoveredToken = startingRound.covered_token					/*get covered token Id */

			getStartingTokenName = getToken( startingCoveredToken )  /*find covered Token */

			roundTokenStart = getStartingTokenName.name											/* set to variable */

			//let rsTimestamp = scheduledRound.timestamp
			let rsTimestamp = startingRound.timestamp

			//test to see if jurist or lead:  to test with just leads: remove !
			if (!(config.isRoundLead(startingRound.in_round_id) == 0 || config.isRoundLead(startingRound.in_round_id) == 1)) {
				displayRSjurist = true;
			}

			//for Testing
			//rsTimestamp = now+1

			//checks to see if round is upcoming
			if (now < rsTimestamp) {
				displayRStime = true;
			}

			if (displayRSjurist && displayRStime) {

				messages.push({
					type: 'jurist_round_starting',
					priority: 'info',
					token: roundTokenS,
					/*startTime: now*/
				})
			}
		}
	}


/***** Brief Review *****/
/* alerts user when both briefs are in (jury AND lead) */
/* checks active rounds  -> checks to see if two briefs have been submitted */

	/* toDo: ready for testing
	*/

	var getBRRoundId
	var brRound
	var brCoveredToken
	var getBRTokenName
	var roundTokenBR
	var briefCheck

	for (var i=1; i<16; i++) {
		getBRRoundId = user.rounds.active[user.rounds.active.length-i]  /* get round ID */

		//console.log()
		let brCellLog = [user.rounds.active.length-i]
		console.log ("Round Brief Due Test -- Active Round Array Member #", i, "(", brCellLog, "): ", getBRRoundId)  //if nothing in array, comes back Undefined

		brRound = rounds.find( round => round.id == getBRRoundId )  /*find round ID in rounds data */

		if (brRound) {

			brCoveredToken = brRound.covered_token					/* get covered Token */

			getBRTokenName = getToken( brCoveredToken )  /*find covered Token */

			roundTokenBR = getBRTokenName.name										/* set to string variable */

			briefCheck =  brRound.briefs.length

			if (briefCheck == 2) {
				messages.push({
					type: 'brief_posted',
					priority: 'info',
					due: brRound.timestamp+(config.ACTIVE_TIME),
					token: roundTokenBR
				})
			}
		}
	}


/***** Pre-Survey Due *****/
/*reminds when pre-survey is due */
/* if JURY, and if 4-6 days after active round start, display */

	/*toDo:   ready for testing
	*/

	/*determine if analyst is jury or lead */
	let preJurist = false;
	//why does this need to be declared here?

	//REMOVE ONCE TESTED
	//to test with just leads, remove !
	/*
	if (!(config.isRoundLead(rounds.in_round_id) == 0 || config.isRoundLead(rounds.in_round_id) == 1)) {
		preJurist = true;
	}

	else {
		preJurist = false;
	}
	*/

	/*test only data (timestamp) */
	rounds[0].timestamp = (now-(5*oneDay))

	/*variables to see if brief reminder needs to be shown*/
	var getActiveRoundIdPre
	var activeRoundPre
	var activeCoveredTokenPre
	var getActiveTokenNamePre
	var roundTokenPre

	var roundBeginTimePre
	var preDueReminder
	var preDueDate

	/*determine round(s) user is involved in*/
	for (var i=1; i<16; i++) {

		//roundBeginTimePre = rounds[rounds.length-i].timestamp
		preDueReminder = (roundBeginTimePre+(4*oneDay))
		preDueDate = (roundBeginTimePre+(6*oneDay))

		getActiveRoundIdPre = user.rounds.active[user.rounds.active.length-i]  // get round ID

		activeRoundPre = rounds.find( round.id == getActiveRoundIdPre )  //find round ID in rounds data

		if (activeRoundPre) {
			preDueReminder = (activeRoundPre.timestamp+(4*oneDay))
			preDueDate = (activeRoundPre.timestamp+(6*oneDay))
			activeCoveredTokenPre = activeRoundPre.covered_token					//get token being covered
			getActiveTokenNamePre = getToken( activeCoveredTokenPre )  //find covered Token
			roundTokenPre = getActiveTokenNamePre.name  //name of token set to var

			//to test with just leads, remove !
			if (!(config.isRoundLead(activeRoundPre.in_round_id) == 0 || config.isRoundLead(activeRoundPre.in_round_id) == 1)) {
				preJurist = true
			}
			else {preJurist = false}

			//console.log()
			let preCellLog = [user.rounds.active.length-i]
			console.log ("Round Brief Due Test -- Active Round Array Member #", i, "(", preCellLog, "): ", getActiveRoundIdPre)  //if nothing in array, comes back Undefined
			console.log ("timestamps => NOW: ", now, " Round Begin: ", activeRoundPre.timestamp, " Brief Alert Start: ", preDueReminder, " Brief Alert End: ", preDueDate)

			if (preJurist && user.rounds.active && (now >= preDueReminder) && (now <= preDueDate)) {

				messages.push({
					type: 'pre_survey_due',
					priority: 'info',
					due:activeRoundPre.timestamp+(config.ACTIVE_TIME),
					round: rountTokenPre
				})
			}
		}
	}


/***** Post-Survey Due *****/
/*reminds when pre-survey is due */
/* if JURY, and if 5-7 days after active round start, display */

	/*toDo:   ready for testing
	*/

	/*determine if analyst is jury or lead */
	let postJurist = false;
	//why does this need to be declared here?

	//REMOVE ONCE TESTED
	//to test with just leads, remove !
	/*
	if (!(config.isRoundLead(rounds.in_round_id) == 0 || config.isRoundLead(rounds.in_round_id) == 1)) {
		postJurist = true;
	}

	else {
		postJurist = false;
	}
	*/

	/*test only data (timestamp) */
	rounds[0].timestamp = (now-(6*oneDay))

	/*variables to see if brief reminder needs to be shown*/
	var getActiveRoundIdPost
	var activeRoundPost
	var activeCoveredTokenPost
	var getActiveTokenNamePost
	var roundTokenPost

	var roundBeginTimePost
	var postDueReminder
	var postDueDate

	/*determine round(s) user is involved in*/
	for (var i=1; i<16; i++) {

		//roundBeginTimePre = rounds[rounds.length-i].timestamp
		postDueReminder = (roundBeginTimePost+(4*oneDay))
		postDueDate = (roundBeginTimePost+(6*oneDay))

		getActiveRoundIdPost = user.rounds.active[user.rounds.active.length-i]  // get round ID

		activeRoundPost = rounds.find( round => round.id == getActiveRoundIdPost )  //find round ID in rounds data

		if (activeRoundPost) {
			postDueReminder = (activeRoundPost.timestamp+(5*oneDay))
			postDueDate = (activeRoundPost.timestamp+(7*oneDay))
			activeCoveredTokenPost = activeRoundPost.covered_token					//get token being covered
			getActiveTokenNamePost = getToken( activeCoveredTokenPost )  //find covered Token
			roundTokenPost = getActiveTokenNamePost.name  //name of token set to var

			//to test with just leads, remove !
			if (!(config.isRoundLead(activeRoundPost.in_round_id) == 0 || config.isRoundLead(activeRoundPost.in_round_id) == 1)) {
				postJurist = true
			}
			else {postJurist = false}

			//console.log()
			let postCellLog = [user.rounds.active.length-i]
			console.log ("Round Brief Due Test -- Active Round Array Member #", i, "(", postCellLog, "): ", getActiveRoundIdPost)  //if nothing in array, comes back Undefined
			console.log ("timestamps => NOW: ", now, " Round Begin: ", activeRoundPost.timestamp, " Brief Alert Start: ", postDueReminder, " Brief Alert End: ", postDueDate)

			if (postJurist && user.rounds.active && (now >= postDueReminder) && (now <= postDueDate)) {

				messages.push({
					type: 'post_survey_due',
					priority: 'info',
					due:activeRoundPost.timestamp+(config.ACTIVE_TIME),
					round:roundTokenPost
				})
			}
		}
	}


/***** LEAD Round Confirmation *****/
/* lets user know that round has actually been confirmed */
/* if round has two leads and at least 15 other analysts, confirm round IF analyst is a lead*/

	//toDo: CHANGE TO SOME KIND OF LEAD STATUS, then ready to test

	//check for two Leads
	let twoLeads = false;
	//why declare here??

	//check to see if user is LEAD
	let isLeadConfirm = false;
	//why declare?

//get Round Info
	var getConfirmRoundId
	var confirmRound
	var confirmCoveredToken
	var getConfirmTokenName
	var roundTokenC


for (var i=1; i<16; i++) {

	getConfirmRoundId = user.rounds.scheduled[user.rounds.scheduled.length-i]  // round ID
	confirmRound = rounds.find(round.id == getConfirmRoundId )  // find round ID in rounds data

	if (confirmRound) {
		confirmCoveredToken = confirmRound.covered_token					//covered token name
		getConfirmTokenName = getToken( confirmCoveredToken )  // find covered Token
		roundTokenC = getConfirmTokenName.name										//name string set to var

		//checks to see if user is a lead
		if ((config.isRoundLead(confirmRound.in_round_id) == 0 || config.isRoundLead(confirmRound.in_round_id) == 1)) {
			isLeadConfirm = true
		}
		else {isLeadConfirm = false}

		//change to make sure there are two leads
		if ((config.isRoundLead(confirmRound.in_round_id) == 0 || config.isRoundLead(confirmRound.in_round_id) == 1)) {
			twoLeads = true
		}
		else {twoLeads = false}

		//console.log()
		let rcCellLog = [user.rounds.scheduled.length-i]
		console.log ("Round Confirm Test -- Scheduled Round Array Member #", i, "(", rcCellLog, "): ", getConfirmRoundId)  //if nothing in array, comes back Undefined

		//for testing -- needs to be deleted
		//confirmRound.num_analysts = 18

			if (twoLeads && confirmRound.num_analysts >= 17 && isLeadConfirm) {

				messages.push({
					type: 'lead_confirmation',
					priority: 'info',
					/*round: 91,
					token:roundTokenC*/
				})
			}
		}
	}


/*****Round Starting*****/
/* reminds user that a round is starting */
/* if user is scheduled for a round, and round is starting within 3 days, remind user about round */

	/* toDo: ready to test
	*/

	/*test data (timestamp) */
		rounds[0].timestamp = (now+(oneDay))

	/*variables to see if brief reminder needs to be shown*/
	var startReminder // how far back to remind user?  current: 3 days
	var startReminderEnd //last time to remind user?  current: round Start

	//commented out for testing
	//get Round Info
	var getStartRoundId  // round ID
	var startRound // find round ID in rounds data
	var startCoveredToken //gets covered token
	var getStartTokenName // find covered Token
	var roundTokenSt //sets name string to var

	for (var i=1; i<16; i++) {

		//get Round Info
		getStartRoundId = user.rounds.scheduled[user.rounds.scheduled.length-i]  // round ID
		startRound = rounds.find( round => round.id == getStartRoundId )  // find round ID in rounds data

		if (startRound) {

			startReminder = (startRound.timestamp-(3*oneDay))  // how far back to remind user?  current: 3 days
			startReminderEnd = (startRound.timestamp)  //last time to remind user?  current: round Start

			startCoveredToken = startRound.covered_token				//gets covered token
			getStartTokenName = getToken( startCoveredToken )  // find covered Token
			roundTokenSt = getStartTokenName.name								//sets name string to var

			//console.log()
			let rsCellLog = [user.rounds.scheduled.length-i]
			console.log ("Round Start Test -- Scheduled Round Array Member #", i, "(", rsCellLog, "): ", getStartRoundId)  //if nothing in array, comes back Undefined
			console.log ("round starts: ", startRound.timestamp)
			console.log ("reminder starts: ", startReminder)
			console.log ("reminder ends: ", startReminderEnd)

			if (user.rounds.scheduled && (now >= startReminder) && (now <= startReminderEnd)) {

				messages.push({
					type: 'round_starting',
					priority: 'info',
					starting:startRound.timestamp,
					/*token:roundTokenSt*/
				})
			}
		}
	}


/***** Briefs Due *****/
/*reminds when briefs are due */
/* if user is lead, and round started between 4-5 days ago, display */

	/* toDo  ready to test
	*/

	//check to see if user is LEAD
	let isLeadBD = false;
	//why declare?

	/*test ONLY data (timestamp) */
	rounds[0].timestamp = (now-((4*oneDay)+1))

	/*variables to see if brief reminder needs to be shown*/
	var briefDueReminder
	var briefDueDate

	var getActiveRoundIdBD // round ID
	var activeRoundBD //find round ID in rounds data
	var activeCoveredTokenBD //get Covered Token
	var getActiveTokenNameBD //find covered Token
	var roundTokenBD //name of token

	for (var i=1; i<16; i++) {

		/*determine round(s) user is involved in*/
		getActiveRoundIdBD = user.rounds.active[user.rounds.active.length-i]  // round ID
		activeRoundBD = getRound( getActiveRoundIdBD )  //find round ID in rounds data

		if (activeRoundBD) {

			/*variables to see if brief reminder needs to be shown*/
			briefDueReminder = (activeRoundBD.timestamp+(4*oneDay))
			briefDueDate = (activeRoundBD.timestamp+(5*oneDay))

			activeCoveredTokenBD = activeRoundBD.covered_token					//get Covered Token
			getActiveTokenNameBD = getToken( activeCoveredTokenBD )  //find covered Token
			roundTokenBD = getActiveTokenNameBD.name  //name of token

			if ((config.isRoundLead(activeRoundBD.in_round_id) == 0 || config.isRoundLead(activeRoundBD.in_round_id) == 1)) {
				isLeadBD = true
			}
			else {isLeadBD = false}

			//console.log()
			let bdCellLog = [user.rounds.scheduled.length-i]
			console.log ("Brief Due Test -- Active Round Array Member #", i, "(", bdCellLog, "): ", getActiveRoundIdBD)  //if nothing in array, comes back Undefined
			console.log ("round starts: ", activeRoundBD.timestamp)
			console.log ("reminder starts: ", briefDueReminder)
			console.log ("reminder ends: ", briefDueDate)

			if (isLeadBD && user.rounds.active && (now > briefDueReminder) && (now < briefDueDate)) {

				messages.push({
					type: 'briefs_due',
					due:activeRoundBD.timestamp+(5*oneDay),
					round: roundTokenBD
				})
			}
		}
	}


/***** Rebuttal Due *****/
/*reminds when rebuttals are due */
/* if user is lead, and round started between 4-6 days ago, display */

	/*toDo ready for testing
	*/

	//check to see if user is LEAD
	let isLeadRD = false;
	//why declare?

	/*test data (timestamp) */
	rounds[0].timestamp = (now-((4*oneDay)+1))

	/*variables to see if brief reminder needs to be shown*/
	var roundBeginTimeRD
	var rebutDueReminder
	var rebutDueDate

	/*determine round(s) user is involved in*/
	var getActiveRoundIdRD // round ID
	var activeRoundRD //find round ID in rounds data
	var activeCoveredTokenRD //get Covered Token
	var getActiveTokenNameRD //find covered Token
	var roundTokenRD //name of token

	for (var i=1; i<16; i++) {
			/*determine round(s) user is involved in*/
		getActiveRoundIdRD = user.rounds.active[user.rounds.active.length-i]  // round ID
		activeRoundRD = getRound( getActiveRoundIdRD )  //find round ID in rounds data

		if (activeRoundRD) {

			/*variables to see if brief reminder needs to be shown*/
			rebutDueReminder = (activeRoundRD.timestamp+(4*oneDay))
			rebutDueDate = (activeRoundRD.timestamp+(6*oneDay))

			activeCoveredTokenRD = activeRoundRD.covered_token					//get Covered Token
			getActiveTokenNameRD = getToken( activeCoveredTokenRD )  //find covered Token
			roundTokenRD = getActiveTokenNameRD.name  //name of token

			//is user a lead?
			if ((config.isRoundLead(activeRoundRD.in_round_id) == 0 || config.isRoundLead(activeRoundRD.in_round_id) == 1)) {
				isLeadRD = true
			}
			else {isLeadRD = false}

			if (isLeadRD && user.rounds.active && (now > rebutDueReminder) && (now < rebutDueDate)) {

				messages.push({
					type: 'rebuttal_due',
					due:activeRoundRD.timestamp+(6*oneDay),
					round: roundTokenRD
				})
			}
		}
	}



/***** JURIST Round Confirmation *****/
/* lets user know that round has actually been confirmed */
/* if round has two leads and at least 15 other analysts, confirm round IF analyst is a jurist*/

	/* toDo: ready for testing
	*/

	//check to see if user is JURIST
	let isJuristConfirm = false;

	var getConfirmRoundIdJ // round ID
	var confirmRoundJ // find round ID in rounds data
	var confirmCoveredTokenJ //name of covered token
	var getConfirmTokenNameJ // find covered Token
	var roundTokenCj //token name set to var


	for (var i=1; i<16; i++) {

		//get Round Info
		getConfirmRoundIdJ = user.rounds.scheduled[user.rounds.scheduled.length-i]  // round ID
		confirmRoundJ = getRound( getConfirmRoundIdJ )  // find round ID in rounds data

		if (confirmRoundJ) {
			confirmCoveredTokenJ = confirmRoundJ.covered_token					//name of covered token
			getConfirmTokenNameJ = getToken( confirmCoveredTokenJ )  // find covered Token
			roundTokenCj = getConfirmTokenNameJ.name										//token name set to var

			//to test with leads: remove !
			if (!(config.isRoundLead(confirmRoundJ.in_round_id) == 0 || config.isRoundLead(confirmRoundJin_round_id) == 1)) {
				isJuristConfirm = true
			}
			else {isJuristConfirm = false}

			//console.log()
			let rcjCellLog = [user.rounds.scheduled.length-i]
			console.log ("Round Confirm Test (JURY) -- Scheduled Round Array Member #", i, "(", rcjCellLog, "): ", getConfirmRoundIdJ)  //if nothing in array, comes back Undefined

			//for Testing
			confirmRoundJ.num_analysts = 18

			if (confirmRoundJ.num_analysts >= 17 && isJuristConfirm) {

				messages.push({
					type: 'round_confirmed',
					priority: 'info',
					start: confirmRoundJ.timestamp
				})
			}
		}
	}

	return messages
}

/********* END MESSAGES **********/



/********* BEGIN MOCK MESSAGES **********/

export const generateMockMessages = () => {
	let messages = []

	/* New Round Scheduling */
	messages.push({
		type: 'new_round_scheduling',
		priority:'info',
		signupCycles:2,

	})

	/* Round Activated */
	messages.push({
		type: 'round_activated',
		priority: 'info',
		due: ("2018-03-28T19:06-0500"),
		start: ("2018-03-27T14:06-0500"),
		round: 2
	})

	/* Payment */
	messages.push({
		type: 'payment',
		priority: 'info',
		tokens: 20
	})

	/* Reputation Score */
	messages.push({
		type: 'reputation_score',
		priority: 'info',
		reputation:50,
		new_points:5
	})

	/* New Level */
	messages.push({
		type: 'new_level',
		priority: 'info',
		previous_level:'pawn',
		new_level:'knight'
	})

	/* Additional Referrals */
	messages.push({
		type: 'addition_referrals',
		priority: 'info',
		new_ref:2,
		referrals:8
	})

	/* Round Finished */
	messages.push({
		type: 'round_finished',
		priority: 'info',
		start: ("2018-03-27T14:06-0500"),
		round:2
	})

	/* Scheduled in round */
	messages.push({
		type: 'round_scheduled',
		priority: 'action-small',
		due: ("2018-03-28T19:06-0500"),
		cycle:2
	})

	/* Tokens added */
	messages.push({
		type:'tokens_added',
		tokens:[3,4,5]
	})

	/* Rounds in progress */
	messages.push({
		type: 'rounds_in_progress',
		priority: 'info',
		start: ("2018-03-27T14:06-0500"),
		analyst:'lead',
		round:18,
		rounds:[2,3,4]
	})

	/* Sponsored analyst joins */
	messages.push({
		type: 'sponsored_analyst_joins',
		priority: 'info',
		analyst:22,
		reputation_points:3
	})

	/* New ratings in */
	messages.push({
		type: 'new_ratings',
		priority: 'info',
		rounds:[22,33,34]
	})

	/* make a referral */
	messages.push({
		type: 'make_referral',
		priority: 'action-big',
		unused_refs: 4
	})

	/* Round Starting */
	messages.push({
		type: 'jurist_round_starting',
		priority: 'action-small',
		round:5
	})

	/* Brief Review */
	messages.push({
		type: 'brief_posted',
		priority: 'info',
		due: ("2018-03-28T19:06-0500"),
		round:2
	})

	/* Pre-Survey Due */
	messages.push({
		type: 'pre_survey_due',
		priority: 'info',
		due:("2018-03-27T14:06-0500"),
		round:3
	})

	/* Post-Survey Due */
	messages.push({
		type: 'post_survey_due',
		priority: 'info',
		due:("2018-03-27T14:06-0500"),
		round:3
	})

	/* Round Confirmation */
	messages.push({
		type: 'lead_confirmation',
		priority: 'info',
		round: 91,
		cycle:3
	})

	/* Round Starting */
	messages.push({
		type: 'round_starting',
		priority: 'info',
		round:44,
		starting:1514937600,
		cycle:3
	})

	/* Briefs Due */
	messages.push({
		type: 'briefs_due',
		due:("2018-03-28T19:06-0500"),
		round: 4
	})

	/* Rebuttal Due */
	messages.push({
		type: 'rebuttal_due',
		due:("2018-03-28T19:06-0500"),
		round:3
	})

	/* Round Confirmation */
	messages.push({
		type: 'round_confirmed',
		priority: 'info',
		round: 32,
		start: ("2018-03-28T19:06-0500"),
		cycle:5
	})

	return messages
}
