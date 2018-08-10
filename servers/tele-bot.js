var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const axios = require('axios')
const config = require('./config')

const botStr = `https://api.telegram.org/bot${config.telegram.botkey}`
const smelly = 'https://agario-skins.org/images/skins/custom/smelly.png'

const msgStr = `${botStr}/sendMessage`
const imgStr = `${botStr}/sendPhoto`
const ikmStr = `${botStr}/InlineKeyboardMarkup`

const stinkie_img = 'https://stinkie.one/static/media/logo.591c1b5d.jpg'

const ratingPanel = [ { text:'1', url: smelly }, { text: '2', url: smelly } ]

app.use(bodyParser.json()) // for parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true
  })
) // for parsing application/x-www-form-urlencoded

//This is the route the API will call
app.post('/new-message', function(req, res) {
  const error = err => {
    // ...and here if it was not
    console.log('Error :', err)
    res.end('Error :' + err)
  }
  const success = response => {
    console.log('Message posted')
    res.end('ok')
  }
  const msg = m => m.toLowerCase()

  const { message } = req.body

  console.log('got another new message',message)

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id


  if (message && message.text){ // text request messages
    const text = msg( message.text )
    if ( text.indexOf('stinkie') >= 0 ) {

      axios.post(imgStr,{ chat_id: message.chat.id, photo: stinkie_img }).then( success ).catch( error ) 

    } else if ( text.indexOf('run round') >= 0 ) {

      axios.post( msgStr,{ chat_id: message.chat.id, text: 'Ready to run for AOS token'} ).then( success ).catch( error ) 

    } else if ( text.indexOf('rate') >= 0 ) { //keyboard for ratings

      axios.post( ikmStr, { inline_keyboard: ratingPanel }).then( success ).catch( error ) 

    }
    else return res.end()
  }
})

// Finally, start our server
app.listen(4000, function() {
  console.log('Telegram app listening on port 4000!')
})


