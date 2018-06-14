const { normalize, schema } = require('normalizr')

const user = new schema.Entity('users')

const comment = new schema.Entity('comments', {
	commenter: user
})

const article = new schema.Entity('articles', {
	author: user,
	comments: [comment]
})



module.exports = {
	test1: () => {
		const myData = {
		  "id": "123",
		  "author": {
		    "id": "1",
		    "name": "Paul"
		  },
		  "title": "My awesome blog post",
		  "comments": [
		    {
		      "id": "324",
		      "commenter": {
		        "id": "2",
		        "name": "Nicole"
		      }
		    }
		  ]
		}

		/*
		{"entities":{"users":{"1":{"id":"1","name":"Paul"},"2":{"id":"2","name":"Nicole"}},"comments":{"324":{"id":"324","commenter":"2"}},"articles":{"123":{"id":"123","author":"1","title":"My awesome blog post","comments":["324"]}}},"result":"123"}
		*/

		const normalizedData = normalize(myData, article)
		console.log('original data:', myData)
		console.log('normalized data:', JSON.stringify(normalizedData))
		console.log('article schema',article)
		console.log('comment schema',comment)
	}

}
