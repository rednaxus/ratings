const config = require('../config/appConfig')
const survey = require('./survey')

const s = '***te**'
module.exports = {
	tokenHistory: ( rounds, tokens, last_rounds = 0 ) => {
		let surveySections = survey.getSections()
		let recommendationIdx = survey.recommendationIndex()

		//console.log('survey sections', surveySections )
		let tokenList = []
		rounds.filter( round => config.STATUSES[ round.status ] == "finished" ).forEach( round => {
			let tokenObj = tokenList.find( tokenItem => tokenItem.token == round.covered_token )
			
			if (!tokenObj) {
				tokenObj = { token: round.covered_token, rounds: [] }
				tokenList.push( tokenObj )
			}
			tokenObj.rounds.push( round )
		})

		tokenList.sort( (t1, t2) => ( t1.token - t2.token ) )
		//console.log(`${s}token list with unsorted rounds`,tokenList)
		return tokenList.map( tokenItem => {
			let token = tokens.find( token => token.id == tokenItem.token )
			let rounds = tokenItem.rounds.sort( ( future, past ) => ( past.cycle - future.cycle ) )	 // sort so most recent first
			//console.log(`${s}rounds sorted for token ${tokenItem.token}`,rounds)
			
			if ( !last_rounds) return rounds 

			tokenItem.address = token.address
			tokenItem.name = token.name
			tokenItem.lastrun = config.cycleTime( rounds[ 0 ].cycle )
			tokenItem.firstrun = config.cycleTime( rounds[ tokenItem.rounds.length - 1 ].cycle )
			tokenItem.numrun = tokenItem.rounds.length
			tokenItem.averages = rounds.reduce( ( accum, round, idx ) => ( 
				idx >= last_rounds ? accum : round.averages.map( ( preOrPost, pIdx) => 
					preOrPost.map( ( avgvalue, qIdx ) => 
						( idx * ( accum[ pIdx ].length ? accum[ pIdx ][ qIdx ] : 1 ) + avgvalue ) / ( idx + 1 )  
					)
				)
			), [[],[]] )	


			let surveyLength = survey.getElements().length
			//console.log('averages',tokenItem.averages)
			tokenItem.lastRecommendation = rounds[ 0 ].averages[1][recommendationIdx]
			tokenItem.recentAvgRecommendation = tokenItem.averages[1][recommendationIdx]
			tokenItem.sectionAverages = tokenItem.averages.map( ( preOrPostAverages, preOrPostIdx ) => 
				preOrPostAverages.reduce( ( accum, avg, idx ) => {
					if ( idx >= surveyLength ) return accum
					let sectionIdx = surveySections.findIndex( section => section.startIndex <= idx  && idx < ( section.startIndex + section.sectionLength ) )
					//console.log(`${s}average ${avg} ...avg index ${idx} section index ${sectionIdx}`)
					let section = surveySections[ sectionIdx ]
					let withinSectionIdx = idx - section.startIndex
					
					if ( section.startIndex == idx ) accum.push( avg )
					else accum[ sectionIdx ] = Math.round( 100 * ( accum[ sectionIdx ] * withinSectionIdx + avg ) / ( withinSectionIdx + 1 ) ) / 100
					return accum
				}, [])
			)
			return tokenItem
		})
 
		return tokenList
	},

	tokenHistorySummary: (rounds, tokens, last_rounds = 0 ) => 
		module.exports.tokenHistory( rounds, tokens, last_rounds ).map( tokenItem => ({
				//token: tokenItem.token,
				address: tokenItem.address,
				name: tokenItem.name,
				lastrun: tokenItem.lastrun,
				firstrun: tokenItem.firstrun,
				numrun: tokenItem.numrun,
				lastRecommendation: tokenItem.lastRecommendation,
				recentAvgRecommendation: tokenItem.recentAvgRecommendation,
				sectionAverages: tokenItem.sectionAverages[1]
		}))
}


