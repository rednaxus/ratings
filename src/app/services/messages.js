
import { appConfig }  from '../config'

import { store } from '../Root'

export const generateMessages = () => {
	let messages = []

	const { tokens, cycles, rounds } = store.getState()

	const s = store.getState()
	if (!s.user || !s.user.info ) return messages

	console.log('state in messages',s)
	console.log('user',s.user.info)

	const user = s.user.info

	let now = cycles.cronInfo / 1000
  let comingSignupCycles = cycles.data.filter( cycle => !cycle.analyst_status && cycle.timestart > now )
  let comingCycles = cycles.data.filter( cycle => cycle.analyst_status && cycle.timestart > now )
  let activeCycles = cycles.data.filter( cycle => cycle.analyst_status && cycle.timestart <= now && cycle.timefinish >= now )

  let activeRounds = []

	console.log ("hghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghg")
	console.log (user.reward_events)
	console.log (user.reward_events)
	console.log ("hghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghghg")

	console.log (user.reward_events[0])

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

	messages.push({
		type: 'reputation_score',
		priority: 'info',
		reputation:50,
		new_points:5
	})

	/* New Level */

	/* Additional Referrals */

	/* Round Finished */

	/* Scheduled in round */

	/* Tokens added */

	/* Rounds in progress */

	/* Sponsored analyst joins */

	/* New ratings in */

	/* make a referral */
	messages.push({
		type: 'make_referral',
		priority: 'action-big'
	})


	/* Round Starting */
	/* Brief Review */
	/* Pre-Survey Due */

	/* Post-Survey Due */
	/* Round Confirmation */

	/* Leads */
	/* Round Starting */
	/* Briefs Due */
	/* Rebuttal Due */
	/* Round Confirmation */
	/* Brief Review */

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
