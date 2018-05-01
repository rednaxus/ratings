/*  NOTES  */

/*

toAdd:
1. store.user.info.newLevel — bool noting whether a new level has been achieved
2. store.user.info.level - array showing level progression
3. store.user.info.new_referrals_available - int showing number of referrals user has available (or maybe array?)
4. rounds.data[] -> timestamp


ToDo:
1. fix New Token Added timestamp
2. add new tokens -> timestamp PLUS array elements
3. add time restrictions
4. make sure Analyst Messages makes sense and uses all data
5. clean up coding indentations, etc.
6. clean up {data}
7. Make sure to use timestamp data for catching everything



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
	//toDo: add rewardType

	messages.push({
		type: 'payment',
		priority: 'info',
		balance: user.token_balance
	})



/***** Reputation Score *****/
/* Alerts user to any updates in reputation score, hopeully up */
/*if Last Reward was a reputation score and it's been less than a week, display card*/

	/* toDo: 1) build time restrictions
					2) fix rewardType in Contract
	*/

  let lastRewardEvent = user.reward_events //pulls reward_events array

	//for testing
	let rewardCell = lastRewardEvent[lastRewardEvent.length-1]  //for now, last reward event

/*change rewardCell.reward_type when done testing */

	if (rewardCell.reward_type==10) {

				messages.push({
				type: 'reputation_score',
				priority: 'info',
				reputation:user.reputation,
				new_points: rewardCell.value
				})
			}


/***** New Level *****/
/* alerts user when they've reached a new level */
/* if user got a new level, display */

	/* toDo:  1) determine if newLevel is an array or reward type
	*/

	//for Testing
	user.newLevel=1
	user.level=["pawn", "knight"]

	//gets current level, and last level before that
	let lastUserLevel = user.level[user.level.length-2]
	let currentUserLevel = user.level[user.level.length-1]


	if (user.newLevel) {

			messages.push({
				type: 'new_level',
				priority: 'info',
				previous_level:lastUserLevel,
				new_level: currentUserLevel
			})
		}


/***** Additional Referrals *****/
/* user gets additonal referrals if they get 100 reputation points */
/* check and see if user has num_referrals, and if new referrals were recently issued */

	/* toDo:  timestamp restrictions
	*/

		user.num_referrals=2

		if (user.num_referrals) {

				messages.push({
					type: 'additional_referrals',
					priority: 'info',
					newRefsAvail: user.num_referrals,
					referrals: user.referrals.length
				})
			}


/***** Round Finished *****/
/*tells user when a round has finished */
/*take most recently finshed rounds and display them*/

	/* toDo:  1) timestamps
	*/

	//for Testing
	user.rounds.finished = [9, 8, 0]


	let getFinishRoundId = user.rounds.finished[user.rounds.finished.length-1]  /* get round ID */
	let finishedRound = _.find(rounds, ['id', getFinishRoundId])  /* find round ID in rounds data */
	let finishedCoveredToken = finishedRound.covered_token				/* get covered Token iD */
	let getFinishedTokenName = _.find(tokens, ['id', finishedCoveredToken])  /* find covered Token in token Array*/
	let roundTokenF = getFinishedTokenName.name   /* set string name to variable */

	if (roundTokenF) {
				messages.push({
					type: 'round_finished',
					priority: 'info',
					roundToken: roundTokenF,
					roundValue: finishedRound.value
				})
			}




/***** Scheduled in round *****/
/* lets user know when they are scheduled for a round */
/* if user has any rounds in "rounds.scheduled", display */

	/* toDo: 1) timestamps
	*/

	//for Testing
	rounds[0].timestamp = now
	user.rounds.scheduled = [1, 6, 0]


	let getScheduledRoundId = user.rounds.scheduled[user.rounds.scheduled.length-1]  /* get round ID */
	let scheduledRound = _.find(rounds, ['id', getScheduledRoundId])  /*find round ID in rounds data */
	let scheduledCoveredToken = scheduledRound.covered_token					/*get covered token Id */
	let getScheduledTokenName = _.find(tokens, ['id', scheduledCoveredToken])  /*find covered Token */
	let roundTokenS = getScheduledTokenName.name											/* set to variable */


	if (roundTokenS) {

			messages.push({
			type: 'round_scheduled',
			priority: 'action-small',
			due: now,
			roundToken: roundTokenS,
			roundValue: scheduledRound.value
		})
	}



/* Tokens added */
/* alerts user to new tokens being added to the system within the last week*/
/* if token timestamp is within the last week, display */


	/* toDo: 1. make sure all new tokens added will get hit
	*/


//for testing. will be removed
	tokens[1] =
	{
		address: "0xb5a5f22694352c15b00323844ad545abb2b11028",
		countOps: 201290,
		decimals: 18,
		description: "Neo is the new smart economy.",
		holdersCount: 44826,
		id: 5,
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



//for testing, will be removed
	tokens[1].timestamp = (now - oneDay)


	let lastTokenAdded = tokens[tokens.length-1]  //captures last token added for now
 	let lastTokenName = lastTokenAdded.name       //pulls the name

	if (now < lastTokenAdded.timestamp+(7*oneDay)) {

			messages.push({
				type:'tokens_added',
				tokens:lastTokenName
			})
		}


/***** Rounds in progress *****/
/* reminds user about rounds that they are currently participating in */
/* if round.active, remind user */

	/* toDo: 1) capture all rounds
	*/

	//for testing
	user.rounds.active = [3, 4, 0]


	let getActiveRoundId = user.rounds.active[user.rounds.active.length-1]  /* get round ID */
	let activeRound = _.find(rounds, ['id', getActiveRoundId])  /*find round ID in rounds data */
	let activeCoveredToken = activeRound.covered_token					/* get covered Token */
	let getActiveTokenName = _.find(tokens, ['id', activeCoveredToken])  /*find covered Token */
	let roundTokenA = getActiveTokenName.name										/* set to string variable */


	if (roundTokenA) {

		messages.push({
			type: 'rounds_in_progress',
			priority: 'info',
			start: ("2018-03-27T14:06-0500"),
			analyst:'lead',
			roundToken: roundTokenA,
			roundValue: scheduledRound.value
		})
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

	/* toDo: timestamps
	*/


	//testData
	rounds[1] = {
		analyst: 1,
		analyst_status: 9,
		briefs: {},
		covered_token: 4,
		cycle: 1,
		id: 1,
		inround_id: 0,
		num_analysts: 8,
		status: 2,
		timestamp: 1514764901,
		value: 10
	}


	let displayRSjurist = false;
	let displayRStime = false;

	//let rsTimestamp = scheduledRound.timestamp
	let rsTimestamp = rounds[1].timestamp

	//test to see if jurist or lead
	if (!(appConfig.isRoundLead(rounds.in_round_id) == 0 || appConfig.isRoundLead(rounds.in_round_id) == 1)) {
			displayRSjurist = true;
	}

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


/***** Brief Review *****/
/* alerts user when both briefs are in (jury AND lead) */
/* checks active rounds  -> checks to see if two briefs have been submitted */

	/* toDo: 1) timestamps
	*/

	let briefCheck = activeRound.briefs.length

	if (briefCheck == 2) {
		messages.push({
			type: 'brief_posted',
			priority: 'info',
			due: ("2018-03-28T19:06-0500"),
			token: roundTokenA
			})
		}


/***** Pre-Survey Due *****/
/*reminds when pre-survey is due */
/* if JURY, and if 4-6 days after active round start, display */

	/*toDo:   1. fix timestamp (once timestamps are avaiable)
	2. make sure it captures all rounds a user is a part of
	3. change 'DUE'
	*/

	/*determine if analyst is jury or lead */
	let preJurist = false;
	//why does this need to be declared here?

	//to test with just leads, remove !
	if (!(appConfig.isRoundLead(rounds.in_round_id) == 0 || appConfig.isRoundLead(rounds.in_round_id) == 1)) {
		preJurist = true;
	}

	else {
		preJurist = false;
	}


	/*test data (timestamp) */
		rounds[0].timestamp = (now-(5*oneDay))

	/*variables to see if brief reminder needs to be shown*/
	let roundBeginTimePre = rounds[rounds.length-2].timestamp
	let preDueReminder = (roundBeginTimePre+(4*oneDay))
	let preDueDate = (roundBeginTimePre+(6*oneDay))


	/*determine round(s) user is involved in*/
	let getActiveRoundIdPre = user.rounds.active[user.rounds.active.length-1]  // get round ID
	let activeRoundPre = _.find(rounds, ['id', getActiveRoundIdPre])  //find round ID in rounds data
	let activeCoveredTokenPre = activeRoundPre.covered_token					//get token being covered
	let getActiveTokenNamePre = _.find(tokens, ['id', activeCoveredTokenPre])  //find covered Token
	let roundTokenPre = getActiveTokenNamePre.name  //name of token set to var


	if (preJurist && user.rounds.active && (now >= preDueReminder) && (now <= preDueDate)) {

		messages.push({
			type: 'pre_survey_due',
			priority: 'info',
			due:("2018-03-27T14:06-0500"),
			round:3
		})
	}


/***** Post-Survey Due *****/
/*reminds when pre-survey is due */
/* if JURY, and if 5-7 days after active round start, display */

	/*toDo  1. fix timestamp (once timestamps are avaiable)
	2. make sure it captures all rounds a user is a part of
	3. change 'DUE'
	*/


	/*determine if analyst is jury or lead */
	let postJurist = false;
	//why does this need to be declared here?

	//to test with just leads, remove !
	if (!(appConfig.isRoundLead(rounds.in_round_id) == 0 || appConfig.isRoundLead(rounds.in_round_id) == 1)) {
		postJurist = true;
	}
	else {
		postJurist = false;
	}

	/*test data (timestamp) */
	rounds[0].timestamp = (now-(6*oneDay))

	/*variables to see if brief reminder needs to be shown*/
	let roundBeginTimePost = rounds[rounds.length-2].timestamp
	let postDueReminder = (roundBeginTimePost+(5*oneDay))
	let postDueDate = (roundBeginTimePost+(7*oneDay))

	/*determine round(s) user is involved in*/
	let getActiveRoundIdPost = user.rounds.active[user.rounds.active.length-1]  // round ID
	let activeRoundPost = _.find(rounds, ['id', getActiveRoundIdPost])  //find round ID in rounds data
	let activeCoveredTokenPost = activeRoundPost.covered_token					//get covered token
	let getActiveTokenNamePost = _.find(tokens, ['id', activeCoveredTokenPost])  //find covered Token
	let roundTokenPost = getActiveTokenNamePost.name  //name of token set to var


	if (postJurist && user.rounds.active && (now >= postDueReminder) && (now <= postDueDate)) {

		messages.push({
			type: 'post_survey_due',
			priority: 'info',
			due:("2018-03-27T14:06-0500"),
			round:3
		})
	}


/***** LEAD Round Confirmation *****/
/* lets user know that round has actually been confirmed */
/* if round has two leads and at least 15 other analysts, confirm round IF analyst is a lead*/

	//check for two Leads
	//toDo: double-check that function will kick back both ints
	let twoLeads = false;
	//why declare here??

	if ((appConfig.isRoundLead(rounds.in_round_id) == 0 && appConfig.isRoundLead(rounds.in_round_id) == 1)) {
		twoLeads = true;
	}

	else {
		twoLeads = false;
	}

	//check to see if user is LEAD
	let isLeadConfirm = false;
	//why declare?

	if ((appConfig.isRoundLead(rounds.in_round_id) == 0 || appConfig.isRoundLead(rounds.in_round_id) == 1)) {
		isLeadConfirm = true;
	}
	else {
		isLeadConfirm = false;
	}

//for testing
	user.rounds.scheduled = [1, 6, 0]

//get Round Info
	let getConfirmRoundId = user.rounds.scheduled[user.rounds.scheduled.length-1]  // round ID
	let confirmRound = _.find(rounds, ['id', getConfirmRoundId])  // find round ID in rounds data
	let confirmCoveredToken = confirmRound.covered_token					//covered token name
	let getConfirmTokenName = _.find(tokens, ['id', confirmCoveredToken])  // find covered Token
	let roundTokenC = getConfirmTokenName.name										//name string set to var


	if (twoLeads && confirmRound.num_analysts >= 17 && isLeadConfirm) {

		messages.push({
			type: 'lead_confirmation',
			priority: 'info',
			round: 91,
			token:roundTokenC
		})
	}


/*****Round Starting*****/
/* reminds user that a round is starting */
/* if user is scheduled for a round, and round is starting within 3 days, remind user about round */

	/* toDo: 1) timestamps
	*/

	/*test data (timestamp) */
		rounds[0].timestamp = (now+(oneDay))

	/*variables to see if brief reminder needs to be shown*/
	let roundBeginTimeStart = rounds[rounds.length-2].timestamp  //round start time -- should capture all upcoming rounds
	let startReminder = (roundBeginTimeStart-(3*oneDay))  // how far back to remind user?  current: 3 days
	let startReminderEnd = (roundBeginTimeStart)  //last time to remind user?  current: round Start


	//get Round Info
	let getStartRoundId = user.rounds.scheduled[user.rounds.scheduled.length-1]  // round ID
	let startRound = _.find(rounds, ['id', getStartRoundId])  // find round ID in rounds data
	let startCoveredToken = startRound.covered_token				//gets covered token
	let getStartTokenName = _.find(tokens, ['id', startCoveredToken])  // find covered Token
	let roundTokenSt = getStartTokenName.name								//sets name string to var



	if (user.rounds.scheduled && (now >= startReminder) && (now <= startReminderEnd)) {

			messages.push({
				type: 'round_starting',
				priority: 'info',
				round:44,
				starting:roundBeginTimeStart,
				token:roundTokenSt
			})
	}


/***** Briefs Due *****/
/*reminds when briefs are due */
/* if user is lead, and round started between 4-5 days ago, display */

	/* toDo  1. fix timestamp (once timestamps are avaiable)
	2. make sure it captures all rounds a user is a part of
	3. change 'DUE'
	*/

	//check to see if user is LEAD
	let isLeadBD = false;
	//why declare?

	if ((appConfig.isRoundLead(rounds.in_round_id) == 0 || appConfig.isRoundLead(rounds.in_round_id) == 1)) {
		isLeadBD = true;
	}

	else {
		isLeadBD = false;
	}

	/*test data (timestamp) */
	rounds[0].timestamp = (now-(3*oneDay))

	/*variables to see if brief reminder needs to be shown*/
	let roundBeginTime = rounds[rounds.length-1].timestamp
	let briefDueReminder = (roundBeginTime+(4*oneDay))
	let briefDueDate = (roundBeginTime+(5*oneDay))


	/*determine round(s) user is involved in*/
	let getActiveRoundIdBD = user.rounds.active[user.rounds.active.length-1]  // round ID
	let activeRoundBD = _.find(rounds, ['id', getActiveRoundIdBD])  //find round ID in rounds data
	let activeCoveredTokenBD = activeRoundBD.covered_token					//get Covered Token
	let getActiveTokenNameBD = _.find(tokens, ['id', activeCoveredTokenBD])  //find covered Token
	let roundTokenBD = getActiveTokenNameBD.name  //name of token


	if (isLeadBD && user.rounds.active && (now > briefDueReminder) && (now < briefDueDate)) {

		messages.push({
			type: 'briefs_due',
			due:("2018-03-28T19:06-0500"),
			round: roundTokenBD
		})
	}


/***** Rebuttal Due *****/
/*reminds when rebuttals are due */
/* if user is lead, and round started between 4-6 days ago, display */


	/*toDo 1. fix timestamp (once timestamps are avaiable)
	2. make sure it captures all rounds a user is a part of
	3. change "DUE"
	*/

	//check to see if user is LEAD
	let isLeadRD = false;
	//why declare?

	if ((appConfig.isRoundLead(rounds.in_round_id) == 0 || appConfig.isRoundLead(rounds.in_round_id) == 1)) {
		isLeadRD = true;
	}
	else {
		isLeadRD = false;
	}

	/*test data (timestamp) */
	rounds[0].timestamp = (now-(3*oneDay))

	/*variables to see if brief reminder needs to be shown*/
	let roundBeginTimeRD = rounds[rounds.length-1].timestamp
	let rebutDueReminder = (roundBeginTimeRD+(4*oneDay))
	let rebutDueDate = (roundBeginTimeRD+(6*oneDay))

	/*determine round(s) user is involved in*/
	let getActiveRoundIdRD = user.rounds.active[user.rounds.active.length-1]  // round ID
	let activeRoundRD = _.find(rounds, ['id', getActiveRoundIdRD])  //find round ID in rounds data
	let activeCoveredTokenRD = activeRoundRD.covered_token					//get Covered Token
	let getActiveTokenNameRD = _.find(tokens, ['id', activeCoveredTokenRD])  //find covered Token
	let roundTokenRD = getActiveTokenNameRD.name  //name of token

	if (isLeadRD && user.rounds.active && (now > rebutDueReminder) && (now < rebutDueDate)) {

		messages.push({
			type: 'briefs_due',
			due:("2018-03-28T19:06-0500"),
			round: roundTokenRD
		})
	}


/***** JURIST Round Confirmation *****/
/* lets user know that round has actually been confirmed */
/* if round has two leads and at least 15 other analysts, confirm round IF analyst is a jurist*/

	/* toDo: 1) timestamps
	*/

	//check for two Leads
	//toDo: double-check that function will kick back both ints
	let twoLeadsJ = false;

	if ((appConfig.isRoundLead(rounds.in_round_id) == 0 && appConfig.isRoundLead(rounds.in_round_id) == 1)) {
		twoLeadsJ = true;
	}
	else {
		twoLeadsJ = false;
	}

//check to see if user is JURIST
	let isJuristConfirm = false;

		if (!(appConfig.isRoundLead(rounds.in_round_id) == 0 || appConfig.isRoundLead(rounds.in_round_id) == 1)) {
			isJuristConfirm = true;
		}
		else {
			isJuristConfirm = false;
		}

		//for testing
	user.rounds.scheduled = [1, 6, 0]

//get Round Info
	let getConfirmRoundIdJ = user.rounds.scheduled[user.rounds.scheduled.length-1]  // round ID
	let confirmRoundJ = _.find(rounds, ['id', getConfirmRoundIdJ])  // find round ID in rounds data
	let confirmCoveredTokenJ = confirmRoundJ.covered_token					//name of covered token
	let getConfirmTokenNameJ = _.find(tokens, ['id', confirmCoveredTokenJ])  // find covered Token
	let roundTokenCj = getConfirmTokenNameJ.name										//token name set to var

	if (twoLeadsJ && confirmRoundJ.num_analysts >= 17 && isJuristConfirm) {

		messages.push({
			type: 'round_confirmed',
			priority: 'info',
			round: 32,
			start: now,
			Token: roundTokenCj
		})
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
