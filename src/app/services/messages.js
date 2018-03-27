


import { appConfig }  from '../config';

import { store } from '../Root'

export const generateMessages = () => {
	let messages = []

	const { tokens, cycles, rounds } = store.getState()

  let comingSignupCycles = cycles.data.filter( cycle => !cycle.analyst_status && cycle.timestart > now )
  let comingCycles = cycles.data.filter( cycle => cycle.analyst_status && cycle.timestart > now )
  let activeCycles = cycles.data.filter( cycle => cycle.analyst_status && cycle.timestart <= now && cycle.timefinish >= now )

	/* New Round Scheduling */
	if (comingSignupCycles.length) {
		messages.push({ 
			type: 'new_round_scheduling', 
			priority:'info', 
			signupCycles:comingSignupCycles.length
		})
	}

	/* Round Activated */

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
	messages.push({ type: 'make_referral' })


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
