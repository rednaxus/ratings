
//const solc = require('solc');
const fs = require('fs')
const util = require('util')
//const debug = require('debug')

//const cronlog = debug('cron')
//const eventlog = debug('event')
const moment = require('moment')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const parseRange = require('parse-numeric-range').parse
const config = require('../src/app/config/appConfig')
const roundsService = require('../src/app/services/API/rounds')


const { setWeb3, getRatingAgency, getAnalystRegistry } = require('../src/app/services/contracts')

//console.log('config',config)

const SurveyService = require('../src/app/services/survey')
const survey = new SurveyService()
let pre = 0
let post = 1

//console.log('survey',survey)
//console.log(survey.getElements())
console.log('survey answers',survey.generateAnswers())
console.log('survey answers',survey.generateAnswers('down'))

var port = process.env.PORT || 9030;        

var apiRouter = express.Router()
var ctlRouter = express.Router()

// Contract descriptions from truffle
//const RatingAgencyObj = require("../build/contracts/RatingAgency.json")
//const AnalystRegistryObj = require("../build/contracts/AnalystRegistry.json")

app.use(bodyParser.urlencoded({ extended: true })); // configure app to use bodyParser()
app.use(bodyParser.json());                         // this will let us get the data from a POST

let web3 =  require('./web3') // require('./web3') //new Web3(config.ETHEREUM.ws)
setWeb3( web3 )


let account
let ra
let ar
let tr

let testAnalysts = new Array(14).fill().map( ( item,idx ) => 
  ({ id: idx, email: `veva${ (idx<10?'0':'') + idx }@veva.one` }) 
)
console.log( 'test analysts',testAnalysts )

const sendError = err => {
  console.log( 'send error', err )
}
const callError = err => {
  console.log( 'call error', err )
}
const apiError = err  => {
  console.log( 'api error', err )
}
const ctlError = err => console.log( 'ctl error', err )

//console.log('web3',web3.eth.personal);
web3.eth.getCoinbase( ( err, coinbase ) => { // setup on launch

  account = coinbase
  console.log('got coinbase ',account)
  tr = { from: account, gas: config.ETHEREUM.gas, gasPrice: config.ETHEREUM.gasPrice }

  getRatingAgency().then( ratingAgency  => {
    ra = ratingAgency
    ra.lasttime().then( result => {
      console.log(`current rating agency time: ${ result.toNumber() }`)
    })
  })
  getAnalystRegistry().then( analystRegistry  => {
    ar = analystRegistry
    ar.num_analysts().then( result => {
      console.log(`analysts: ${ result.toNumber() }`)
    })
  })
})



const getAccountBalance = (account,cb) => {
  console.log('getting eth balance');
  web3.eth.getBalance(account,(err,result)=> {
    console.log('got eth balance:',web3.fromWei(result,'ether'));
    if (cb) cb(val);
  });
}

const getBlock = () => { // delete me
  var block = 2000000;
  var getEthBlock = Promise.promisify(web3.eth.getBlock);
  getEthBlock(block).then((result)=> {
    console.log('got block '+block+':',result);
  });
}


const getBlocks = blockrange => {
  return new Promise((resolve,reject)=>{
    var rangeArr = parseRange(blockrange);
    var getBlock;
    var blocks = [];
    var blockResults = [];
    if (!rangeArr.length) {
      console.log('no blocks requested');
      reject('no blocks requested');
    }
    getBlock = Promise.promisify(web3.eth.getBlock);

    rangeArr.forEach((blocknum)=> {
      blocks.push(getBlock(blocknum).then((result)=>{
        blockResults.push(result);
      }));
    });
    
    Promise.all(blocks).then(()=> {
      blockResults.sort((b1,b2)=> { return(b1.number - b2.number) } );
      //console.log('got blocks',rangeArr);
      //console.log('block results',blockResults)
      resolve(blockResults);
    });

  });

}


/*
 *      api routes
*/

apiRouter.get('/', ( req, res ) => {
    res.json({ message: 'hooray! welcome to api!' });   
})

apiRouter.get('/round/:round/:analyst', ( req, res ) => {
  roundsService.getRoundInfo( req.params.round, req.params.analyst ).then( roundInfo => {

    console.log('round info',roundInfo)
    res.json( roundInfo )
  }).catch( apiError )
})


/*
 *     control routes
*/

ctlRouter.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to ctl!' });   
})

ctlRouter.route('/cron/:time').get( ( req, res ) => {
    ra.cron( +req.params.time ).then( result => {
      res.json( result )
    })
})

ctlRouter.route('/rounds').get( ( req, res ) => {
  ra.lasttime().call( tr ).then( result => {
    res.json({lasttime: result})    
    console.log( result )
  }).catch( callError )
})

ctlRouter.route( '/cycleGenerateAvailabilities/:cycleId' ).get( ( req, res ) => {
  ra.cycleGenerateAvailabilities(req.params.cycleId).then( result => {
    //let str = util.inspect( result, { depth:6 } ) 
    //console.log( str )
    res.json( result )
  }).catch( sendError )
})

ctlRouter.route( '/roundActivate/:cycle/:token' ).get( ( req, res ) => {
  ra.roundActivate( req.params.cycle, req.params.token ).then( result => {
    //let str = util.inspect( result, { depth:6 } ) 
    //console.log( str )
    res.json( result )
  }).catch( sendError )
})

/* full fledged tests */
ctlRouter.route( '/testWholeRound/:cycle/:token' ).get( ( req, res) => {
  let cycle = +req.params.cycle
  let token = +req.params.token
  
  console.log( `Volunteer test users to cycle ${cycle} for token ${token}` )
  let promises = []  
  testAnalysts.forEach( analyst => {
    let role = analyst.id < 4 ? 0 : 1  // first four in test analysts are leads
    promises.push( 
      ra.cycleVolunteer( cycle, analyst.id, role ).then( result => {
        console.log( 'got result',result )
        return result
      }).catch( ctlError )
    )
  })
  Promise.all( promises ).then( results_volunteer => {
    console.log( 'got volunteer results',results_volunteer )
    //res.json( results_volunteer )
    
    console.log( `Confirm test analysts to cycle ${cycle} for token ${token}` )
    promises = []
    testAnalysts.forEach( analyst => {
      let role = analyst.id < 4 ? 0 : 1       
      promises.push( 
        ra.cycleConfirm( cycle, analyst.id, role ).then( result => {
          console.log( 'got result',result )
          return result
        }).catch( ctlError )
      )
    })
    Promise.all( promises ).then( results_confirm => {
      console.log( 'got confirm results', results_confirm )
      //res.json( results_confirm )
      promises = []
      
      ra.num_rounds().then( results_round => {
        let round = results_round.toNumber()
        console.log( `Activating round ${round} for cycle ${cycle} with token ${token}` )
        ra.roundActivate( cycle, token ).then( results_round => {
          console.log( `activated round ${round}`, results_round )
          //res.json( results_round )

          console.log( `Submit pre-surveys for round ${round}` )
          promises = []
          testAnalysts.forEach( analyst => {
            let role = analyst.id < 4 ? 0 : 1       

            let answers = survey.toHexString( survey.generateAnswers() )
            let qualitatives = ''
            let recommendation = 0
            let comment = `hello from analyst ${analyst.id}`
            promises.push( 
              ratingAgency.roundSurveySubmit( round, analyst.id, pre, answers, qualitatives, recommendation, comment ) 
              .then( result => {
                console.log( 'got result',result )
                return result
              }).catch( ctlError )
            )
          })
          Promise.all( promises ).then( results_survey_submit => {
            console.log( 'survey submit results', results_survey_submit )
            res.json( results_survey_submit )
          })
        })
      })
    })

  }).catch( ctlError )
 
  

  

  

  // Submit dummy briefs by the leads

  // Submit second surveys for the jurists

  // Finish the round

  // Get the round tallies


})

ctlRouter.route( '/testNextCycle/:cycle' ).get( ( req, res ) => {
  // get the current time/cycle

  // Volunteer users to next cycle

  // Confirm users for cycle, one group for each token

  // Move cron to start of next cycle

    // Call roundCanActivate (should return next token id) -- do until false
  
    // Activate round for next token

  
  // Move cron halfway to first survey due

  // for each round:
    // Generate first surveys for all jurists and submit them

    // Submit dummy lead briefs

    // Move cron to brief/survey due time

    // Generate second surveys for all jurists and submit them

  // 


})

/*
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x7E5BCE8eE498F6C29e4DdAd10CB816D6E2f139f7", "latest"],"id":1}' http://localhost:8545
*/
apiRouter.route('/eth').get(function(req,res){
    console.log('got get');
}).post(function(req,res) {
  console.log('got post, making proxy request',req.body);
  ethProxy.web(req, res, { target: 'http://localhost:8545' }, function(e) { 
    console.log('got proxy response',e);
    res.json({message:"got it"});
  })
})



app.use('/api', apiRouter)

app.use('/ctl', ctlRouter)

app.listen(port, function () {
  console.log('listening on port '+port);
})




