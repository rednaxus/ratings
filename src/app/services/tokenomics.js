const config = require('../config/appConfig')
const survey = require('./survey')

const s = '***te**'
module.exports = {
	tokenHistory: ( rounds, tokens, last_rounds = 0 ) => {
		let surveySections = survey.getSections()
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
			let rounds = tokenItem.rounds.sort( ( future, past ) => ( past.cycle - future.cycle ) )	 // sort so most recent first
			//console.log(`${s}rounds sorted for token ${tokenItem.token}`,rounds)
			
			if ( !last_rounds) return rounds 

			tokenItem.lastrun = config.cycleTime( tokenItem.rounds[ 0 ].cycle )
			tokenItem.firstrun = config.cycleTime( tokenItem.rounds[ tokenItem.rounds.length - 1 ].cycle )
			tokenItem.numrun = tokenItem.rounds.length
			tokenItem.averages = rounds.reduce( ( accum, round, idx ) => ( 
				idx >= last_rounds ? accum : round.averages.map( ( preOrPost, pIdx) => 
					preOrPost.map( ( avgvalue, qIdx ) => 
						( idx * ( accum[ pIdx ].length ? accum[ pIdx ][ qIdx ] : 1 ) + avgvalue ) / ( idx + 1 )  
					)
				)
			), [[],[]] )	

			let surveyLength = survey.getElements().length
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

	summariesByCategory: () => {

	},
}


