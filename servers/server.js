
//const solc = require('solc');
const fs = require('fs')
//const util = require('util')
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
const cyclesService = require('../src/app/services/API/cycles')
const tokensService = require('../src/app/services/API/tokens')

const statusService = require('../src/app/services/analystStatus')

const { getRatingAgency: RatingAgency, getAnalystRegistry: AnalystRegistry } = require('../src/app/services/contracts')
const utils = require('../src/app/services/utils') // parseB32StringtoUintArray, toHexString, bytesToHex, hexToBytes
const { bytes32FromIpfsHash, ipfsHashFromBytes32 } = require('../src/app/services/ipfs')

//console.log('config',config)

const SurveyService = require('../src/app/services/survey')
const survey = new SurveyService()
let pre = 0
let post = 1

let numVolunteerRepeats = 1 // controls how many total rounds get run, i.e. how hard we stress the system

var port = process.env.PORT || 9030        

var apiRouter = express.Router()
var ctlRouter = express.Router()


app.use(bodyParser.urlencoded({ extended: true })); // configure app to use bodyParser()
app.use(bodyParser.json());                         // this will let us get the data from a POST

let web3 =  require('./web3') // require('./web3') //new Web3(config.ETHEREUM.ws)
utils.setWeb3( web3 )

let state = {
  timestamp: 0,
  cycles: [],
  rounds: [],
  analysts: [],
  tokens: []
}

/*()
let t1 = config.cycleTime( 0 )
let t2 = config.cycleTime( 0 ) + config.cyclePhaseTime(1)
console.log(t1,t2)
console.log(`test cycle frac`,config.cycleFraction(0,t1))
console.log(`test cycle frac`,config.cycleFraction(0,t2))
*/

//console.log('survey',survey)
//console.log(survey.getElements())
console.log('survey answers',survey.generateAnswers().toString())
let sarr = survey.generateAnswers('down')
console.log('survey answers',sarr.toString())
let sb32 = utils.toHexString(sarr)
console.log('survey hex:', sb32)
console.log('survey convert to arr', utils.hexToBytes(sb32).toString())

let briefs = [  // dummy briefs for testing 
  'QmZsWca6dJJUC7CRX1imJnGzw1ZHMT8oEiJXF2AtrfXCpG',
  'QmZRDDRpYyjgWGQKWo736KKmhsr1So4HtMXKxvpKbr7E3Z'
]

let account
let ra
let ar
let tr
let round_analysts = []

let s = '****'

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

const toDate = timestamp => moment(timestamp*1000).format('MMMM Do YYYY, h:mm:ss a')

//console.log('web3',web3.eth.personal);
web3.eth.getCoinbase( ( err, coinbase ) => { // setup on launch

  account = coinbase
  console.log('got coinbase ',account)
  tr = { from: account, gas: config.ETHEREUM.gas, gasPrice: config.ETHEREUM.gasPrice }

  RatingAgency().then( _ra  => {
    ra = _ra
    cyclesService.getCronInfo( false ).then( timestamp => {
      console.log(`${s}current rating agency time: ${ timestamp }:${ toDate(timestamp) }`)
      state.timestamp = timestamp
    }).catch( ctlError )
    tokensService.getTokensInfo(false).then( tokens => {
      console.log(`${s}tokens:`,tokens)
      state.tokens = tokens
      console.log(`${s}waiting...`)
    }).catch( ctlError )
  })
  AnalystRegistry().then( _ar  => {
    ar = _ar
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
  console.log( `${s}Volunteer test users to cycle ${cycle} for token ${token}` )
  let promises = []  
  testAnalysts.forEach( analyst => {
    let role = analyst.id < 4 ? 0 : 1  // first four in test analysts are leads
    promises.push( 
      ra.cycleVolunteer( cycle, analyst.id, role )
      /*.then( result => {
        console.log( `${s}got result`,result )
        return result
      }).catch( ctlError )
      */
    )
  })
  Promise.all( promises ).then( results_volunteer => {
    console.log( `${s}got volunteer results`,results_volunteer )
    //res.json( results_volunteer )
    
    console.log( `${s}Confirm test analysts to cycle ${cycle} for token ${token}` )
    promises = []
    testAnalysts.forEach( analyst => {
      let role = analyst.id < 4 ? 0 : 1       
      promises.push( 
        ra.cycleConfirm( cycle, analyst.id, role )
        /*.then( result => {
          console.log( `${s}got result`,result )
          return result
        }).catch( ctlError )*/
      )
    })
    Promise.all( promises ).then( results_confirm => {
      console.log( `${s}got confirm results`, results_confirm )
      //res.json( results_confirm )
      promises = []
      ra.cycleRoundCanCreate(cycle).then( results_cancreate => {
        console.log( `${s}can create round: ${results_cancreate}`) // should be true, we just confirmed everybody
        ra.num_rounds().then( results_round => {
          let round = results_round.toNumber()
          console.log( `${s}Activating round ${round} for cycle ${cycle} with token ${token}` )
          ra.roundActivate( cycle, token ).then( results_round => {
            console.log( `${s}activated round ${round}`, results_round )
            //res.json( results_round )

            roundsService.getRoundInfo( round ).then( roundInfo => { // need num_analysts
              console.log(`${s}info for round ${round}`,roundInfo )
              promises = []
              for (let a = 0; a < roundInfo.num_analysts; a++){
                promises.push( ra.roundAnalystId( round, a ) )
              }
              Promise.all( promises ).then( results => {
                promises.forEach( (_,idx) => round_analysts.push( results[idx].toNumber() ) )
                console.log(`${s}round analysts: ${round_analysts.toString()}`)

                console.log( `${s}Submit pre-surveys for round ${round}` )
                promises = []
                round_analysts.forEach( ( round_analyst, idx ) => {
                  if ( idx < 2 ) return // no survey for leads
                  
                  let answers = utils.toHexString( survey.generateAnswers() )
                  //let qualitatives = utils.toHexString([42]) // encoded byte, i.e. true/false
                  //let recommendation = 50
                  let comment = `hello from analyst on pre-survey ${idx}:${round_analyst}`
                  promises.push( 
                    ra.roundSurveySubmit( round, idx, pre, answers, comment ) 
                    /*.then( result => {
                      console.log( `${s}got result`,result )
                      return result
                    }).catch( ctlError )
                    */
                  )
                })
                Promise.all( promises ).then( results_survey_submit => {
                  console.log( `${s}survey submit results`, results_survey_submit )
                  //res.json( results_survey_submit )

                  console.log( `${s}submit briefs`)

                  promises = [
                    ra.roundBriefSubmit( round, 0, bytes32FromIpfsHash(briefs[0]) ),
                    ra.roundBriefSubmit( round, 1, bytes32FromIpfsHash(briefs[1]) )
                  ]
                  Promise.all( promises ).then( results_briefs => {
                    console.log( `${s}Briefs submitted`,results_briefs )
                    // res.json( results_briefs )
                    
                    console.log( `${s}Submit post-surveys for round ${round}` )
                    promises = []
                    round_analysts.forEach( ( round_analyst, idx ) => {
                      if ( idx < 2 ) return // no survey for leads

                      let answers = utils.toHexString( survey.generateAnswers('down') )
                      //let qualitatives = utils.toHexString([24]) // encoded byte, i.e. true/false
                      //let recommendation = 20
                      let comment = `hello from analyst on post-survey ${idx}:${round_analyst}`
                      promises.push( 
                        ra.roundSurveySubmit( round, idx, post, answers, comment ) 
                      )
                    })
                    Promise.all( promises ).then( results_survey_submit => {
                      console.log( `${s}survey submit results`, results_survey_submit )
                      //res.json( results_survey_submit )
                      ra.roundFinish( round ).then( results_round_finish => {
                        console.log( `${s}round ${round} finished`, results_round_finish )
                        //res.json( results_round_finish )
                        roundsService.getRoundInfo( round ).then( round_info => {
                          console.log( `${s}round info+summary for ${round}`, round_info )
                          res.json( round_info )
                        }).catch( ctlError )
                      }).catch( ctlError )
                    }).catch( ctlError )
                  }).catch( ctlError )
                }).catch( ctlError )
              }).catch( ctlError )
            }).catch( ctlError )
          }).catch( ctlError )
        }).catch( ctlError )
      }).catch( ctlError )
    })

  }).catch( ctlError )
 

})

ctlRouter.route( '/testNextCycle' ).get( ( req, res ) => {
  //let cycle = +req.params.cycle
  let token = 2 // for now...want to do for all tokens


  ra.lasttime().then( timestamp => {
    let cycle = config.cycleIdx( timestamp ) + 1 // next cycle is of interest
    
    console.log( `${s}Volunteer test users to cycle ${cycle} for token ${token}` )
    let promises = testAnalysts.map( analyst => ra.cycleVolunteer( cycle, analyst.id, analyst.id < 4 ? 0 : 1 ) )  // first four in test analysts are leads      
    Promise.all( promises ).then( results_volunteer => {
      console.log( `${s}got volunteer results`,results_volunteer )
      //res.json( results_volunteer )
      
      console.log( `${s}Confirm test analysts to cycle ${cycle} for token ${token}` )
      let promises = testAnalysts.map( analyst => ra.cycleConfirm( cycle, analyst.id, analyst.id < 4 ? 0 : 1 ) )
      Promise.all( promises ).then( results_confirm => {
        console.log( `${s}got confirm results`, results_confirm )
        //res.json( results_confirm )

        console.log( `${s}cron forward to target cycle ${cycle}` )
        ra.cronTo( config.cycleTime ( cycle ) ).then( result_cron => { 
          console.log(`${s}cycle ${cycle - 1} finished`,result_cron)
          console.log(`${s}get rounds active`)
          roundsService.getRoundsActive().then( active_rounds => {
            console.log( `${s}got active rounds [${active_rounds.toString()}]` )
            let promises = active_rounds.map( round => new Promise( ( resolve, reject ) => {
              roundsService.getRoundInfo( round ).then( roundInfo => { // need num_analysts
                console.log( `${s}got info for round ${round}`, roundInfo )
                console.log( `${s}analysts: [${roundInfo.analysts.toString()}]` )
                console.log( `${s}submit pre-surveys for round ${round}` )
                let promises = roundInfo.analysts.map( ( analyst, aref ) => {
                  if ( aref < 2 ) return null// no survey for leads
                  
                  let answers = utils.toHexString( survey.generateAnswers() )
                  let comment = `hello from analyst on pre-survey ${aref}:${analyst}`
                  return roundsService.submitRoundSurvey( round, aref, answers, comment, pre )
                }).filter( item => item )
                Promise.all( promises ).then( results_survey_submit => {
                  console.log( `${s}submitted survey results for round ${round}`, results_survey_submit )
                  //res.json( results_survey_submit )

                  console.log( `${s}submit briefs for round ${round}`)

                  let promises = new Array(2).fill().map( (_,aref) => roundsService.submitRoundBrief( round, aref, briefs[aref] ) )
                  Promise.all( promises ).then( results_briefs => {
                    console.log( `${s}Briefs submitted for round ${round}`,results_briefs )
                    // res.json( results_briefs )
                    console.log( `briefs submitted for round ${round}`)   

                    console.log(`${s}advancing cron to cycle+frac`)
                    ra.cronTo( config.cycleTime ( cycle ) + config.cycleFracTime( config.CYCLE_FRACTION ) ).then( result_cron => { 
                      ra.lasttime().then( timestamp => {
                        console.log(`${s}cron advanced to ${timestamp}:${toDate(timestamp)}`)
                        console.log(`${s}....submitting post brief surveys`)

                        resolve( timestamp )              
                      }).catch( reject )
                    }).catch( ctlError )

                  }).catch( ctlError )
                }).catch( ctlError )
              }).catch( ctlError )
            }))
          }).catch( ctlError )          
        }).catch( ctlError )
        /*

        */
        // cron phase1, submit pre jury surveys
        // cron to phase 2, do leads submissions
        // cron to phase 3, post jury surveys
        // move cron to next cycle

      })

    }).catch( ctlError )
   


  }).catch( ctlError )

   
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


const getAnalystCycles = analyst => new Promise ( ( resolve, reject ) => cyclesService.getCyclesInfo( analyst ).then( cycles => {
    //console.log( `${s}got cycles for analyst ${ analyst }`,cycles )
  let cyclesInfo = statusService.cyclesByStatus( { cycles, rounds:state.rounds, timestamp:state.timestamp, tokens:state.tokens })
  //console.log(`cycles by status for ${analyst}`,cyclesByStatus)
  resolve( { cycles, cyclesByStatus: cyclesInfo } )
}).catch( reject ))

const doAnalystUpdate = analyst => new Promise( (resolve, reject ) => {
  let s = `***${analyst}***`
  let role = analyst < 4 ? 0 : 1
  cyclesService.getCronInfo().then( timestamp => {
    //console.log(`resolving analyst ${analyst}`)
    //resolve(`analyst ${analyst} done`)
    let currentCycle = config.cycleIdx( timestamp )
    let cyclePhase = config.cyclePhase( currentCycle, timestamp )
    console.log(`${s}cycle ${currentCycle} with timestamp ${timestamp} at phase ${cyclePhase}`)
    cyclesService.getCyclesInfo( analyst ).then( cycles => {
      //console.log( `${s}got cycles for analyst ${ analyst }`,cycles )
      let byStatus = statusService.cyclesByStatus( { cycles, rounds:state.rounds, timestamp:state.timestamp, tokens:state.tokens } )
      byStatus.comingSignupCycles.forEach( cycle => { // volunteer for any future cycles some number of times
        let status = cycle.role[ role ]
        if ( status.num_volunteers + status.num_confirms >= numVolunteerRepeats ) {
          console.log('already volunteered, dont add')
        } else { // volunteer to this cycle
          console.log(`${s}volunteer me`)
        }
        if ( status.num_volunteers & statusService.isConfirmDue( cycle ) ) {
          //confirm
          console.log(`${s}confirm me`)
        }

      })
      console.log(`${s}cycles by status`,byStatus)
      resolve(byStatus)
    })
  })
})

ctlRouter.route('/testDoAnalyst/:analyst').get( ( req, res ) => {
  doAnalystUpdate( +req.params.analyst ).then( result => {
    console.log(`${s}`,result)
    res.json( result )
  })
})

apiRouter.route('/getAnalystCyclesStatus/:analyst').get( ( req, res ) => {
  getAnalystCycles( +req.params.analyst ).then( ( { cycles, cyclesByStatus } ) => {
    console.log(`${s}`,cycles,cyclesByStatus)
    res.json( cyclesByStatus )
  })
})

// e.g. totalTime: 2419200 for 28 days (1 standard cycle)
ctlRouter.route( '/testCron/:totalTime/:interval' ).get( ( req, res ) => { // interval as fraction of period
  let totalTime = +req.params.totalTime
  let intervalTime = config.cycleFracTime( +req.params.interval )
  let finishTime
  let cronRunIdx = 0

  const runCrons = timestamp => new Promise( ( resolve, reject ) => {
    const doCron = cronTime => ra.cronTo( cronTime ).then( res => {
      let cycleStart = config.cycleIdx( cronTime )
      console.log(`${s+s}${cronRunIdx}-cron ran at ${cronTime}:${toDate(cronTime)}...cycle start:${cycleStart}`)
      cronRunIdx++
      
      console.log(`${s}get rounds active`)
      Promise.all( [ roundsService.getRoundsActive(), roundsService.getRounds() ] ).then( nums => {
        let [ num_active_rounds, num_rounds ] = nums
        console.log( `${s}${num_active_rounds} active rounds and ${num_rounds} total rounds` )
        //Promise.all( active_rounds.map( round => roundsService.getRoundInfo( round ) )).then( rounds => { // need num_analysts
        
        roundsService.getRoundsInfo( num_rounds - num_active_rounds, num_active_rounds ).then( rounds => {
          console.log(`${s}got active rounds`,rounds)
          state.rounds = rounds
          let promises = testAnalysts.map( analystInfo => doAnalyst( analystInfo.id ) )
          utils.runPromisesInSequence( promises ).then( () => {
            let nextTime = cronTime + intervalTime
            if ( nextTime <= finishTime ) doCron( nextTime ) // repeat
            else resolve( cronTime )
          }).catch( reject )
        }).catch( reject )
      }).catch( reject )
    }).catch( reject )
    doCron( timestamp )
  })

  cyclesService.getCronInfo().then( timestamp => {
    finishTime = timestamp + totalTime
    console.log(`${s}cron procedure...${totalTime} cycles ${timestamp}:${toDate(timestamp)} => ${finishTime}:${toDate(finishTime)}`)
    console.log(`${s}interval time ${intervalTime}`)
    runCrons( timestamp + intervalTime ).then( lastTime => console.log(`finished ${lastTime}:${toDate(lastTime)}`))
  })
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




