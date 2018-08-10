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

const ratingPanel = {"keyboard": [["Done","Done 2"], ["Update"], ["Log Time"]],"one_time_keyboard": true} //[ [ { text:'1', url: smelly }, { text: '2', url: smelly } ] ]

//keyboard = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text='18-02-28-141715.mp4', callback_data='2018-02-28 14:17:27')],[InlineKeyboardButton(text='18-02-28-135007.mp4', callback_data='2018-02-28 13:50:24')],])
const rp2 =  { 
    inline_keyboard: [
      [{ text: 'Some button text 1', callback_data: '1' }],
      [{ text: 'Some button text 2', callback_data: '2' }],
      [{ text: 'Some button text 3', callback_data: '3' }]
    ]
}

app.use(bodyParser.json()) // for parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true
  })
) // for parsing application/x-www-form-urlencoded

let last_chat_id = 100

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

  const { message, callback_query } = req.body

  console.log('got another new message',req.body)

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id


  if (message && message.text){ // text request messages
    const text = msg( message.text )
    last_chat_id = message.chat.id

    if ( text.indexOf('stinkie') >= 0 ) {

      axios.post(imgStr,{ chat_id: message.chat.id, photo: stinkie_img }).then( success ).catch( error ) 

    } else if ( text.indexOf('run round') >= 0 ) {

      axios.post( msgStr,{ chat_id: message.chat.id, text: 'Ready to run for AOS token'} ).then( success ).catch( error ) 

    } else if ( text.indexOf('rate') >= 0 ) { //keyboard for ratings

      axios.post( msgStr, { chat_id: message.chat.id, text: 'test keyboard', reply_markup: rp2 }).then( success ).catch( error ) 

    }
    else return res.end()
  } else if (callback_query) {
      axios.post( msgStr, { chat_id: callback_query.from.id, text: callback_query.data } ).then( success ).catch( error )
  }
  else return res.end()
})


// Finally, start our server
app.listen(4000, function() {
  console.log('Telegram app listening on port 4000!')
})


/*
  callback_query:
   { id: '1583783509977761152',
     from:
      { id: 368753334,
        is_bot: false,
        first_name: 'alan',
        last_name: 'k',
        username: 'alan_on40',
        language_code: 'en-US' },
     message:
      { message_id: 106,
        from: [Object],
        chat: [Object],
        date: 1533925873,
        text: 'test keyboard' },
     chat_instance: '5779136896984275476',
     data: '2' } }

*/