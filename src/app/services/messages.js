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


import { appConfig }  from '../config'

import { store } from '../Root'

export const generateMessages = ( { user, cycles, rounds, tokens, timestamp }) => {
	let messages = []

	//const { tokens, cycles, rounds } = store.getState()

	//const s = store.getState()
	//if (!s.user || !s.user.info ) return messages

	//console.log('state in messages',s)
	//console.log('user',s.user.info)

	//const user = s.user.info

	let now = timestamp
  let comingSignupCycles = cycles.filter( cycle => !cycle.analyst_status && cycle.timestart > now )
  let comingCycles = cycles.filter( cycle => cycle.analyst_status && cycle.timestart > now )
  let activeCycles = cycles.filter( cycle => cycle.analyst_status && cycle.timestart <= now && cycle.timefinish >= now )

  let activeRounds = []


	let oneHour = 3600 /*seconds*/
	let oneDay = 86400 /*seconds*/


/********for testing -- 'if' statement to hold and make NOT appear ********/
let testVariable = 0

//Rounds
user.rounds.scheduled = [3, 0, 5, 0, 2]
user.rounds.active = [3, 4, 0, 6]
user.rounds.finished = [8, 9, 0, 7]



/********** BEGIN MESSAGES **********/

/***** New Round Scheduling *****/
	if (comingSignupCycles.length) {
		messages.push({
			type: 'new_round_scheduling',
			priority:'info',
			signupCycles:comingSignupCycles.length
		})
	}


/***** Round Activated *****/
	activeRounds.map( round => {
		messages.push({
			type: 'round_activated',
			priority: 'info',
			round: round
		})
	})



/***** Payment *****/

	//toDo: ready for testing

	for (let i=1; i<2; i++) {

		if (user.reward_events.length) {

	  	let lastRewardEventP = user.reward_events //pulls reward_events array

			//for testing
			let rewardCellP = lastRewardEventP[lastRewardEventP.length-i]  //runs through reward array

			if (rewardCellP.timestamp > now-(7*oneDay)) {

				i--

				if (rewardCellP.reward_type>=2 && rewardCellP.reward_type <=7) {

					console.log ("New Payment!")

					messages.push({
						type: 'payment',
						priority: 'info',
						tokens: rewardCellP.value
					})
				}
			}
		}
	}



/***** Reputation Score *****/
/* Alerts user to any updates in reputation score, hopeully up */
/*if Last Reward was a reputation score and it's been less than a week, display card*/

	/* toDo: ready for testing
	*/


	for (let i=1; i<2; i++) {

		if (user.reward_events.length) {

  		let lastRewardEventR = user.reward_events //pulls reward_events array

			//for testing
			let rewardCellR = lastRewardEventR[lastRewardEventR.length-i]  //runs through reward array

			if (rewardCellR.timestamp > now-(7*oneDay)) {

				i--

				/*change rewardCell.reward_type when done testing */
				if (rewardCellR.reward_type >= 8 || rewardCellR.reward_type <= 13) {

					console.log ("New Rep Score!")

					messages.push({
						type: 'reputation_score',
						priority: 'info',
						reputation:user.reputation,
						new_points: rewardCellR.value
					})
				}
			}
		}
	}


/***** New Level *****/
/* alerts user when they've reached a new level */
/* if user got a new level, display */

	/* toDo:  ready for testing
	*/

	//for Testing
	user.newLevel=1
	user.level=["pawn", "knight"]

	//gets current level, and last level before that
	let lastUserLevel = user.level[user.level.length-2]
	let currentUserLevel = user.level[user.level.length-1]


	for (let i=1; i<2; i++) {

		if (user.reward_events.length) {

	  	let lastRewardEventL = user.reward_events //pulls reward_events array

				//for testing
			let rewardCellL = lastRewardEventL[lastRewardEventL.length-i]  //runs through reward array

			if (rewardCellL.timestamp > now-(30*oneDay)) {

				i--

				if (rewardCellL.reward_type == 20 ) {

					messages.push({
						type: 'new_level',
						priority: 'info',
						previous_level:lastUserLevel,
						new_level: currentUserLevel
					})
				}
			}
		}
	}


/***** Additional Referrals *****/
/* user gets additonal referrals if they get 100 reputation points */
/* check and see if user has num_referrals, and if new referrals were recently issued */

	/* toDo:  timestamp restrictions?  maybe.  Otherwise, ready for testing
	*/

		//for testing
	user.num_referrals=2


	for (let i=1; i<2; i++) {

		if (user.reward_events.length) {

			let lastRewardEventRef = user.reward_events //pulls reward_events array

				//for testing
			let rewardCellRef = lastRewardEventRef[lastRewardEventRef.length-i]  //runs through reward array

			if (rewardCellRef.timestamp > now-(30*oneDay)) {

				i--

				if (rewardCellL.reward_type == 1) {

					messages.push({
						type: 'additional_referrals',
						priority: 'info',
						newRefsAvail: user.num_referrals,
						referrals: user.referrals.length
					})
				}
			}
		}
	}


/***** Round Finished *****/
/*tells user when a round has finished */
/*take most recently finshed rounds and display them*/

	/* toDo: Ready for Testing */

	var getFinishRoundId
	var finishedRound
	var finishedCoveredToken
	var getFinishedTokenName
	var roundTokenF
	var finishedCardCycle
	var finishedCycleId
	var finishedCycleStart
	var finishedCycleEnd
	var finishedTimeBool

	for (var i=1; i<16; i++) {

		getFinishRoundId = user.rounds.finished[user.rounds.finished.length-i]  /* get round ID */

		//console.log()
		let finishedCellLog = [user.rounds.finished.length-i]
		console.log ("Round Finished Test -- Finished Round Array Member #", i, "(", finishedCellLog, "): ", getFinishRoundId)  //if nothing in array, comes back Undefined

		finishedRound = _.find(rounds, ['id', getFinishRoundId])  /* find round ID in rounds data */

		if (finishedRound) {

			finishedCoveredToken = finishedRound.covered_token				/* get covered Token iD */
			getFinishedTokenName = _.find(tokens, ['id', finishedCoveredToken])  /* find covered Token in token Array*/
			roundTokenF = getFinishedTokenName.name   /* set string name to variable */

		//for Testing
		/*
		if (roundTokenF) {
		finishedRound.timestamp = now+i;
		console.log (now)
		console.log ("xxxxxxxxxxxxxxxxxxxxxxxxxxXXXXXXXXXXXxxxxxxxxxxxxxxxxxxxxxx=:>")
		console.log (finishedRound.timestamp)
		}
		*/

			finishedCardCycle = finishedRound.cycle
			finishedCycleStart=appConfig.cycleTime(finishedCardCycle)
			//finishedCycleId = _.find(cycles, ['id', activeRound.cycle])
			finishedCycleEnd = finishedCycleStart + (appConfig.ACTIVE_TIME)

			if (finishedCycleEnd > now - (5*oneDay)) {
				finishedTimeBool = true
			}

			if (roundTokenF && finishedTimeBool) {
				messages.push({
					type: 'round_finished',
					priority: 'info',
					roundToken: roundTokenF,
					roundValue: finishedRound.value
				})
			}
		}
	}

	//OLD CODE, was used for first build.  DO NOT remove until system has been tested AND verified stable with LIVE ROUNDS

	//let getFinishRoundId = user.rounds.finished[user.rounds.finished.length-1]  /* get round ID */
	//let finishedRound = _.find(rounds, ['id', getFinishRoundId])  /* find round ID in rounds data */
	//let finishedCoveredToken = finishedRound.covered_token				/* get covered Token iD */
	//let getFinishedTokenName = _.find(tokens, ['id', finishedCoveredToken])  /* find covered Token in token Array*/
	//let roundTokenF = getFinishedTokenName.name   /* set string name to variable */
	/*
		if (roundTokenF) {
					messages.push({
						type: 'round_finished',
						priority: 'info',
						roundToken: roundTokenF,
						roundValue: finishedRound.value
					})
				}

	*/


/***** Scheduled in round *****/
/* lets user know when they are scheduled for a round */
/* if user has any rounds in "rounds.scheduled", display */

	/* toDo: ready for testing
	*/

	//for Testing
	rounds[0].timestamp = now

	var getScheduledRoundId
	var scheduledRound
	var scheduledCoveredToken
	var getScheduledTokenName
	var roundTokenS


	for (var i=1; i<16; i++) {
		getScheduledRoundId = user.rounds.scheduled[user.rounds.scheduled.length-i]  /* get round ID */

		//console.log()
		let scheduledCellLog = [user.rounds.scheduled.length-i]
		console.log ("Round Scheduled Test -- Scheduled Round Array Member #", i, "(", scheduledCellLog, "): ", getScheduledRoundId)  //if nothing in array, comes back Undefined

		scheduledRound = _.find(rounds, ['id', getScheduledRoundId])  /*find round ID in rounds data */

		if (scheduledRound) {

			scheduledCoveredToken = scheduledRound.covered_token					/*get covered token Id */

			getScheduledTokenName = _.find(tokens, ['id', scheduledCoveredToken])  /*find covered Token */
			roundTokenS = getScheduledTokenName.name											/* set to variable */

			if (roundTokenS) {

				messages.push({
					type: 'round_scheduled',
					priority: 'action-small',
					due: now,
					roundToken: roundTokenS,
					roundValue: scheduledRound.value
				})
			}
		}
	}


/* New Tokens added */
/* alerts user to new tokens being added to the system within the last week*/
/* if token timestamp is within the last week, display */

	/* toDo: Ready for Testing
	*/

	//for testing. will be removed
	tokens[1] =
	{
		address: "0xb5a5f22694352c15b00323844ad545abb2b11028",
		countOps: 201290,
		decimals: 18,
		description: "Neo is the new smart economy.",
		holdersCount: 44826,
		id: 1,
		issuancesCount: 0,
		lastUpdated: 1524839258,
		name: "Neo",
		owner: "0xe16fd9b95758fe8f3a478ef9b750a64513bf2e80",

		price: {
		availableSupply: "387231348.0",
		currency: "USD",
		diff: 0.36,
		diff7d: 22.81,
		diff30d: 93.507901216658,
		marketCapUsd: "1755896677.0",
		rate: "4.53449",
		ts: "1525090459",
		volume24h: "94487400.0"
	},
		rounds: {},
		symbol: "NEO",
		totalSupply: "400228740000000000000000000",
		transfersCount: 201290
	}

	tokens[2] =
	{
		address: "0xb5a5f22694352c15b00323844ad545abb2b11028",
		countOps: 201290,
		decimals: 18,
		description: "Neo is the new smart economy.",
		holdersCount: 44826,
		id: 3,
		issuancesCount: 0,
		lastUpdated: 1524839258,
		name: "Tron",
		owner: "0xe16fd9b95758fe8f3a478ef9b750a64513bf2e80",

		price: {
		availableSupply: "387231348.0",
		currency: "USD",
		diff: 0.36,
		diff7d: 22.81,
		diff30d: 93.507901216658,
		marketCapUsd: "1755896677.0",
		rate: "4.53449",
		ts: "1525090459",
		volume24h: "94487400.0"
	},
		rounds: {},
		symbol: "TRX",
		totalSupply: "400228740000000000000000000",
		transfersCount: 201290
	}

	tokens[3] =
	{
		address: "0xb5a5f22694352c15b00323844ad545abb2b11028",
		countOps: 201290,
		decimals: 18,
		description: "Neo is the new smart economy.",
		holdersCount: 44826,
		id: 5,
		issuancesCount: 0,
		lastUpdated: 1524839258,
		name: "Monero",
		owner: "0xe16fd9b95758fe8f3a478ef9b750a64513bf2e80",

		price: {
		availableSupply: "387231348.0",
		currency: "USD",
		diff: 0.36,
		diff7d: 22.81,
		diff30d: 93.507901216658,
		marketCapUsd: "1755896677.0",
		rate: "4.53449",
		ts: "1525090459",
		volume24h: "94487400.0"
	},
		rounds: {},
		symbol: "XMR",
		totalSupply: "400228740000000000000000000",
		transfersCount: 201290
	}


	//for testing, will be removed
	tokens[1].timestamp = (now - 9*oneDay)
	tokens[2].timestamp = (now - 8*oneDay)
	tokens[3].timestamp = (now - 1)

	var lastTokenAdded = tokens[tokens.length-1]  //captures last token added for now
	var lastTokenAddedArray = tokens.length-1			//sets array cell number
 	var lastTokenName = lastTokenAdded.name 			//pulls the name
	var newTokenCounter = 0												//counts times through array


	for (var i=0; i<1; i++) {

		lastTokenAdded = tokens[lastTokenAddedArray-newTokenCounter]  //captures last token added for now

		lastTokenName = lastTokenAdded.name       //pulls the name

		if (now < lastTokenAdded.timestamp+(7*oneDay)) {

			//console.log ()
			console.log ('New Tokens Added: ', lastTokenName, "; Time Added: ", lastTokenAdded.timestamp, "; Current Time: ", now)

			i--

			messages.push({
				type:'tokens_added',
				tokens:lastTokenName
			})
		}

		newTokenCounter++
		//lastTokenAddedArray = lastTokenAdded

	}


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

		activeRound = _.find(rounds, ['id', getActiveRoundId])  /*find round ID in rounds data */

		if (activeRound) {

			activeCoveredToken = activeRound.covered_token					/* get covered Token */

			getActiveTokenName = _.find(tokens, ['id', activeCoveredToken])  /*find covered Token */

			roundTokenA = getActiveTokenName.name										/* set to string variable */

			if (roundTokenA) {

				messages.push({
					type: 'rounds_in_progress',
					priority: 'info',
					start: ("2018-03-27T14:06-0500"),
					analyst:'lead',
					roundToken: roundTokenA,
					roundValue: 10 //scheduledRound.value
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

	if (user.num_referrals) {
		messages.push({
			type: 'make_referral',
			priority: 'action-big'
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

		startingRound = _.find(rounds, ['id', getStartingRoundId])  /*find round ID in rounds data */

		if (startingRound) {

			startingCoveredToken = startingRound.covered_token					/*get covered token Id */

			getStartingTokenName = _.find(tokens, ['id', startingCoveredToken])  /*find covered Token */

			roundTokenStart = getStartingTokenName.name											/* set to variable */

			//let rsTimestamp = scheduledRound.timestamp
			let rsTimestamp = startingRound.timestamp

			//test to see if jurist or lead:  to test with just leads: remove !
			if (!(appConfig.isRoundLead(startingRound.in_round_id) == 0 || appConfig.isRoundLead(startingRound.in_round_id) == 1)) {
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
					startTime: now
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

		brRound = _.find(rounds, ['id', getBRRoundId])  /*find round ID in rounds data */

		if (brRound) {

			brCoveredToken = brRound.covered_token					/* get covered Token */

			getBRTokenName = _.find(tokens, ['id', brCoveredToken])  /*find covered Token */

			roundTokenBR = getBRTokenName.name										/* set to string variable */

			briefCheck =  brRound.briefs.length

			if (briefCheck == 2) {
				messages.push({
					type: 'brief_posted',
					priority: 'info',
					due: ("2018-03-28T19:06-0500"),
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
	if (!(appConfig.isRoundLead(rounds.in_round_id) == 0 || appConfig.isRoundLead(rounds.in_round_id) == 1)) {
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

		activeRoundPre = _.find(rounds, ['id', getActiveRoundIdPre])  //find round ID in rounds data

		if (activeRoundPre) {
			preDueReminder = (activeRoundPre.timestamp+(4*oneDay))
			preDueDate = (activeRoundPre.timestamp+(6*oneDay))
			activeCoveredTokenPre = activeRoundPre.covered_token					//get token being covered
			getActiveTokenNamePre = _.find(tokens, ['id', activeCoveredTokenPre])  //find covered Token
			roundTokenPre = getActiveTokenNamePre.name  //name of token set to var

			//to test with just leads, remove !
			if (!(appConfig.isRoundLead(activeRoundPre.in_round_id) == 0 || appConfig.isRoundLead(activeRoundPre.in_round_id) == 1)) {
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
					due:("2018-03-27T14:06-0500"),
					round:3
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
	if (!(appConfig.isRoundLead(rounds.in_round_id) == 0 || appConfig.isRoundLead(rounds.in_round_id) == 1)) {
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

		activeRoundPost = _.find(rounds, ['id', getActiveRoundIdPost])  //find round ID in rounds data

		if (activeRoundPost) {
			postDueReminder = (activeRoundPost.timestamp+(5*oneDay))
			postDueDate = (activeRoundPost.timestamp+(7*oneDay))
			activeCoveredTokenPost = activeRoundPost.covered_token					//get token being covered
			getActiveTokenNamePost = _.find(tokens, ['id', activeCoveredTokenPost])  //find covered Token
			roundTokenPost = getActiveTokenNamePost.name  //name of token set to var

			//to test with just leads, remove !
			if (!(appConfig.isRoundLead(activeRoundPost.in_round_id) == 0 || appConfig.isRoundLead(activeRoundPost.in_round_id) == 1)) {
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
					due:("2018-03-27T14:06-0500"),
					round:3
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
	confirmRound = _.find(rounds, ['id', getConfirmRoundId])  // find round ID in rounds data

	if (confirmRound) {
		confirmCoveredToken = confirmRound.covered_token					//covered token name
		getConfirmTokenName = _.find(tokens, ['id', confirmCoveredToken])  // find covered Token
		roundTokenC = getConfirmTokenName.name										//name string set to var

		//checks to see if user is a lead
		if ((appConfig.isRoundLead(confirmRound.in_round_id) == 0 || appConfig.isRoundLead(confirmRound.in_round_id) == 1)) {
			isLeadConfirm = true
		}
		else {isLeadConfirm = false}

		//change to make sure there are two leads
		if ((appConfig.isRoundLead(confirmRound.in_round_id) == 0 || appConfig.isRoundLead(confirmRound.in_round_id) == 1)) {
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
					round: 91,
					token:roundTokenC
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
		startRound = _.find(rounds, ['id', getStartRoundId])  // find round ID in rounds data

		if (startRound) {

			startReminder = (startRound.timestamp-(3*oneDay))  // how far back to remind user?  current: 3 days
			startReminderEnd = (startRound.timestamp)  //last time to remind user?  current: round Start

			startCoveredToken = startRound.covered_token				//gets covered token
			getStartTokenName = _.find(tokens, ['id', startCoveredToken])  // find covered Token
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
					round:44,
					starting:startRound.timestamp,
					token:roundTokenSt
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
		activeRoundBD = _.find(rounds, ['id', getActiveRoundIdBD])  //find round ID in rounds data

		if (activeRoundBD) {

			/*variables to see if brief reminder needs to be shown*/
			briefDueReminder = (activeRoundBD.timestamp+(4*oneDay))
			briefDueDate = (activeRoundBD.timestamp+(5*oneDay))

			activeCoveredTokenBD = activeRoundBD.covered_token					//get Covered Token
			getActiveTokenNameBD = _.find(tokens, ['id', activeCoveredTokenBD])  //find covered Token
			roundTokenBD = getActiveTokenNameBD.name  //name of token

			if ((appConfig.isRoundLead(activeRoundBD.in_round_id) == 0 || appConfig.isRoundLead(activeRoundBD.in_round_id) == 1)) {
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
					due:("2018-03-28T19:06-0500"),
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
		activeRoundRD = _.find(rounds, ['id', getActiveRoundIdRD])  //find round ID in rounds data

		if (activeRoundRD) {

			/*variables to see if brief reminder needs to be shown*/
			rebutDueReminder = (activeRoundRD.timestamp+(4*oneDay))
			rebutDueDate = (activeRoundRD.timestamp+(6*oneDay))

			activeCoveredTokenRD = activeRoundRD.covered_token					//get Covered Token
			getActiveTokenNameRD = _.find(tokens, ['id', activeCoveredTokenRD])  //find covered Token
			roundTokenRD = getActiveTokenNameRD.name  //name of token

			//is user a lead?
			if ((appConfig.isRoundLead(activeRoundRD.in_round_id) == 0 || appConfig.isRoundLead(activeRoundRD.in_round_id) == 1)) {
				isLeadRD = true
			}
			else {isLeadRD = false}

			if (isLeadRD && user.rounds.active && (now > rebutDueReminder) && (now < rebutDueDate)) {

				messages.push({
					type: 'rebuttal_due',
					due:("2018-03-28T19:06-0500"),
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
		confirmRoundJ = _.find(rounds, ['id', getConfirmRoundIdJ])  // find round ID in rounds data

		if (confirmRoundJ) {
			confirmCoveredTokenJ = confirmRoundJ.covered_token					//name of covered token
			getConfirmTokenNameJ = _.find(tokens, ['id', confirmCoveredTokenJ])  // find covered Token
			roundTokenCj = getConfirmTokenNameJ.name										//token name set to var

			//to test with leads: remove !
			if (!(appConfig.isRoundLead(confirmRoundJ.in_round_id) == 0 || appConfig.isRoundLead(confirmRoundJin_round_id) == 1)) {
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
					round: 32,
					start: now,
					Token: roundTokenCj
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
