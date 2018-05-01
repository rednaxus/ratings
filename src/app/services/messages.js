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

<<<<<<< HEAD

	let oneHour = 3600 /*seconds*/
	let oneDay = 86400 /*seconds*/



/********for testing -- if statement to hold and make NOT appear ********/
let testVariable = 0

=======
	console.log ("hghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghg")
	console.log (user.reward_events)
	console.log (user.reward_events)
	console.log ("hghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghg")
	console.log('test')
	console.log (user.reward_events[0])
>>>>>>> 99219439b29ede679ff890e94e5b32178032d1f2

	/* New Round Scheduling */
	if (comingSignupCycles.length) {
		messages.push({
			type: 'new_round_scheduling',
			priority:'info',
			signupCycles:comingSignupCycles.length
		})
	}



	/* Round Activated */
	activeRounds.map( round => {
		messages.push({
			type: 'round_activated',
			priority: 'info',
			round: round
		})
	})



	/* Payment */

	messages.push({
		type: 'payment',
		priority: 'info',
		balance: user.token_balance
	})



	/* Reputation Score */
  let lastRewardEvent = user.reward_events
  console.log ('again logging',lastRewardEvent)


	let lastRewardEvent = user.reward_events
	let rewardCell = lastRewardEvent[lastRewardEvent.length-1]

/*change to rewardCell.reward_type when done testing */
	if (rewardCell.reward_type==20) {

				messages.push({
				type: 'reputation_score',
				priority: 'info',
				reputation:user.reputation,
				new_points: rewardCell.value
				})
			}



	/* New Level */
	user.newLevel=1
	user.level=["pawn", "knight"]

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

	/* Additional Referrals */
	/* user gets additonal referrals if they get 100 reputation points */

		user.num_referrals=7

			if (user.num_referrals) {

				messages.push({
					type: 'additional_referrals',
					priority: 'info',
					newRefsAvail: user.num_referrals,
					referrals: user.referrals.length
				})
			}


	/* Round Finished */

	user.rounds.finished = [9, 8, 0]

	let getFinishRoundId = user.rounds.finished[user.rounds.finished.length-1]  /* round ID */
	let finishedRound = _.find(rounds, ['id', getFinishRoundId])  /*find round ID in rounds data */
	let finishedCoveredToken = finishedRound.covered_token
	let getFinishedTokenName = _.find(tokens, ['id', finishedCoveredToken])  /*find covered Token */
	let roundTokenF = getFinishedTokenName.name

	if (roundTokenF) {
				messages.push({
					type: 'round_finished',
					priority: 'info',
					roundToken: roundTokenF,
					roundValue: finishedRound.value
				})
			}




	/* Scheduled in round */


	user.rounds.scheduled = [1, 6, 0]

	let getScheduledRoundId = user.rounds.scheduled[user.rounds.scheduled.length-1]  /* round ID */
	let scheduledRound = _.find(rounds, ['id', getScheduledRoundId])  /*find round ID in rounds data */
	let scheduledCoveredToken = scheduledRound.covered_token
	let getScheduledTokenName = _.find(tokens, ['id', scheduledCoveredToken])  /*find covered Token */
	let roundTokenS = getScheduledTokenName.name


	if (roundTokenS) {

	messages.push({
		type: 'round_scheduled',
		priority: 'action-small',
		due: ("2018-03-28T19:06-0500"),
		roundToken: roundTokenS,
		roundValue: scheduledRound.value
	})

}



	/* Tokens added */
	/*alerts user to new tokens being added to the system within the last week*/


//Still To Do:

/*

1. make sure all new tokens added will get hit

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


	let lastTokenAdded = tokens[tokens.length-1]

 	let lastTokenName = lastTokenAdded.name


if (now < lastTokenAdded.timestamp+(7*oneDay)) {


			messages.push({
				type:'tokens_added',
				tokens:lastTokenName
			})

		}


	/* Rounds in progress */

	user.rounds.active = [3, 4, 0]

	let getActiveRoundId = user.rounds.active[user.rounds.active.length-1]  /* round ID */
	let activeRound = _.find(rounds, ['id', getActiveRoundId])  /*find round ID in rounds data */
	let activeCoveredToken = activeRound.covered_token
	let getActiveTokenName = _.find(tokens, ['id', activeCoveredToken])  /*find covered Token */
	let roundTokenA = getActiveTokenName.name

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

	/* Sponsored analyst joins */


if (testVariable == 1) {
			messages.push({
				type: 'sponsored_analyst_joins',
				priority: 'info',
				analyst:22,
				reputation_points:3
			})
		}


	/* New ratings in */

	if (testVariable == 1) {

		messages.push({
			type: 'new_ratings',
			priority: 'info',
			rounds:[22,33,34]
		})

			}


	/* make a referral */

	messages.push({
		type: 'make_referral',
		priority: 'action-big'
	})


	/* Round Starting */
	/* JURIST */


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
let rsTimestamp = scheduledRound.timestamp
//let rsTimestamp = rounds[1].timestamp

if (!(appConfig.isRoundLead(rounds.in_round_id) == 0 || appConfig.isRoundLead(rounds.in_round_id) == 1)) {
		displayRSjurist = true;
}

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


	/* Brief Review */
	/* alerts user when both briefs are in (jury AND lead) */
	/* checks active rounds  -> checks to see if two briefs have been submitted */


	let briefCheck = activeRound.briefs.length

	if (briefCheck == 2) {
	messages.push({
		type: 'brief_posted',
		priority: 'info',
		due: ("2018-03-28T19:06-0500"),
		token: roundTokenA
	})
}


	/* Pre-Survey Due */
	/*reminds when pre-survey is due */

	/*toDo */

	/*
	1. fix timestamp (once timestamps are avaiable)
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
let getActiveRoundIdPre = user.rounds.active[user.rounds.active.length-1]  // round ID
let activeRoundPre = _.find(rounds, ['id', getActiveRoundIdPre])  //find round ID in rounds data
let activeCoveredTokenPre = activeRoundPre.covered_token
let getActiveTokenNamePre = _.find(tokens, ['id', activeCoveredTokenPre])  //find covered Token
let roundTokenPre = getActiveTokenNamePre.name  //name of token


if (preJurist && user.rounds.active && (now >= preDueReminder) && (now <= preDueDate)) {


	messages.push({
		type: 'pre_survey_due',
		priority: 'info',
		due:("2018-03-27T14:06-0500"),
		round:3
	})


}





	/* Post-Survey Due */
	/*reminds when pre-survey is due */

	/*toDo */

	/*
	1. fix timestamp (once timestamps are avaiable)
	2. make sure it captures all rounds a user is a part of
	3. change 'DUE'
	*/




/*determine if analyst is jury or lead */
let postJurist = false;

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
let activeCoveredTokenPost = activeRoundPost.covered_token
let getActiveTokenNamePost = _.find(tokens, ['id', activeCoveredTokenPost])  //find covered Token
let roundTokenPost = getActiveTokenNamePost.name  //name of token


if (postJurist && user.rounds.active && (now >= postDueReminder) && (now <= postDueDate)) {


	messages.push({
		type: 'post_survey_due',
		priority: 'info',
		due:("2018-03-27T14:06-0500"),
		round:3
	})

}


	/* LEAD Round Confirmation */
	/* if round has two leads and at least 15 other analysts, confirm round IF analyst is a lead*/


//check for two Leads
//toDo: double-check that function will kick back both ints
let twoLeads = false;

	if ((appConfig.isRoundLead(rounds.in_round_id) == 0 && appConfig.isRoundLead(rounds.in_round_id) == 1)) {
		twoLeads = true;
	}

	else {
		twoLeads = false;
	}


//check to see if user is LEAD
	let isLeadConfirm = false;

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
	let confirmCoveredToken = confirmRound.covered_token
	let getConfirmTokenName = _.find(tokens, ['id', confirmCoveredToken])  // find covered Token
	let roundTokenC = getConfirmTokenName.name


if (twoLeads && confirmRound.num_analysts >= 17 && isLeadConfirm) {

	messages.push({
		type: 'lead_confirmation',
		priority: 'info',
		round: 91,
		token:roundTokenC
	})
}


	/*Round Starting*/
	/* if user is scheduled for a round, and round is starting within 3 days, remind user about round */

	/*test data (timestamp) */
		rounds[0].timestamp = (now+(oneDay))

	/*variables to see if brief reminder needs to be shown*/
	let roundBeginTimeStart = rounds[rounds.length-2].timestamp  //round start time -- should capture all upcoming rounds
	let startReminder = (roundBeginTimeStart-(3*oneDay))  // how far back to remind user?  current: 3 days
	let startReminderEnd = (roundBeginTimeStart)  //last time to remind user?  current: round Start


	//get Round Info
		let getStartRoundId = user.rounds.scheduled[user.rounds.scheduled.length-1]  // round ID
		let startRound = _.find(rounds, ['id', getStartRoundId])  // find round ID in rounds data
		let startCoveredToken = startRound.covered_token
		let getStartTokenName = _.find(tokens, ['id', startCoveredToken])  // find covered Token
		let roundTokenSt = getStartTokenName.name



if (user.rounds.scheduled && (now >= startReminder) && (now <= startReminderEnd)) {
		/* Round Starting */
		messages.push({
			type: 'round_starting',
			priority: 'info',
			round:44,
			starting:roundBeginTimeStart,
			token:roundTokenSt
		})
}



	/* Briefs Due */
	/*reminds when briefs are due */

	/*toDo */
	/*
	1. fix timestamp (once timestamps are avaiable)
	2. make sure it captures all rounds a user is a part of
	3. change 'DUE'
	*/


/*test data (timestamp) */
	rounds[0].timestamp = (now-(3*oneDay))


/*variables to see if brief reminder needs to be shown*/
let roundBeginTime = rounds[rounds.length-1].timestamp
let briefDueReminder = (roundBeginTime+(4*oneDay))
let briefDueDate = (roundBeginTime+(5*oneDay))


/*determine round(s) user is involved in*/
let getActiveRoundIdBD = user.rounds.active[user.rounds.active.length-1]  // round ID
let activeRoundBD = _.find(rounds, ['id', getActiveRoundIdBD])  //find round ID in rounds data
let activeCoveredTokenBD = activeRoundBD.covered_token
let getActiveTokenNameBD = _.find(tokens, ['id', activeCoveredTokenBD])  //find covered Token
let roundTokenBD = getActiveTokenNameBD.name  //name of token


if (user.rounds.active && (now > briefDueReminder) && (now < briefDueDate)) {

	messages.push({
		type: 'briefs_due',
		due:("2018-03-28T19:06-0500"),
		round: roundTokenBD
	})
}


	/* Rebuttal Due */
	/*reminds when rebuttals are due */

	/*toDo */

	/*
	1. fix timestamp (once timestamps are avaiable)
	2. make sure it captures all rounds a user is a part of
	3. change "DUE"
	*/


/*test data (timestamp) */
	rounds[0].timestamp = (now-(3*oneDay))


/*variables to see if brief reminder needs to be shown*/
let roundBeginTimeRD = rounds[rounds.length-1].timestamp
let rebutDueReminder = (roundBeginTimeRD+(4*oneDay))
let rebutDueDate = (roundBeginTimeRD+(5*oneDay))


/*determine round(s) user is involved in*/
let getActiveRoundIdRD = user.rounds.active[user.rounds.active.length-1]  // round ID
let activeRoundRD = _.find(rounds, ['id', getActiveRoundIdRD])  //find round ID in rounds data
let activeCoveredTokenRD = activeRoundRD.covered_token
let getActiveTokenNameRD = _.find(tokens, ['id', activeCoveredTokenRD])  //find covered Token
let roundTokenRD = getActiveTokenNameRD.name  //name of token


if (user.rounds.active && (now > rebutDueReminder) && (now < rebutDueDate)) {

	messages.push({
		type: 'briefs_due',
		due:("2018-03-28T19:06-0500"),
		round: roundTokenRD
	})
}

	/* JURIST Round Confirmation */
	/* if round has two leads and at least 15 other analysts, confirm round IF analyst is a jurist*/


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
	let confirmCoveredTokenJ = confirmRoundJ.covered_token
	let getConfirmTokenNameJ = _.find(tokens, ['id', confirmCoveredTokenJ])  // find covered Token
	let roundTokenCj = getConfirmTokenNameJ.name


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
