

const json = require('../../../survey.json') // services are interoperable server or client so use require

class Survey {

	constructor(){
		this.indexer = {}
		this.elements = []
		this.sections = []
		let index = 0
		json.pages.forEach( page => {
			page.elements.forEach( element => {
  			this.elements.push(element)
  			this.indexer[element.name] = index++ 
			})
			this.sections.push( page.name )
		})  	
	}


	encodeData(data) {
	  let result = new Array(32)
	  for (var name in data) 
	    result[ this.indexer[name] ] = data[ name ]
	  console.log('got result',data, result)
	  return result
	}

	getElements(){
		return this.elements
	}
	
	getSections(){
		return this.sections
	}


}

 

module.exports = Survey
