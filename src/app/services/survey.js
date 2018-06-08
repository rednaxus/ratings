

const json = require('../../../survey.json') // services are interoperable server or client so use require

var indexer = {}
var elements = []
var sections = []
let index = 0
json.pages.forEach( page => {
	let startIndex = index
	page.elements.forEach( element => {
  	elements.push( element )
  	indexer[ element.name ] = index++ 
	})
	sections.push( { name: page.name, startIndex: startIndex, sectionLength: index - startIndex } )			
})  	

module.exports = {
	encodeData: ( data ) => {
	  let result = new Array(32)
	  for (var name in data) 
	    result[ indexer[name] ] = data[ name ]
	  console.log('got result',data, result)
	  return result
	},

	generateAnswers: ( curve = 'up' ) => { // up, down
		let div = 3
		return new Array(32).fill().map( (_,idx) =>
			div * ( curve == 'up' ? idx : 32-idx )
		)
	},

	getElements: () => {
		return elements
	},
	
	getSections(){
		return sections
	}


}


