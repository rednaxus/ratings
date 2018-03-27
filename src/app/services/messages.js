
import { appConfig }  from '../config'

import { store } from '../Root'

export const generateMessages = () => {
	let messages = []

	const { tokens, cycles, rounds } = store.getState()

  let comingSignupCycles = cycles.data.filter( cycle => !cycle.analyst_status && cycle.timestart > now )
  let comingCycles = cycles.data.filter( cycle => cycle.analyst_status && cycle.timestart > now )
  let activeCycles = cycles.data.filter( cycle => cycle.analyst_status && cycle.timestart <= now && cycle.timefinish >= now )

  let activeRounds = {} 

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

	/* Reputation Score */
	
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
