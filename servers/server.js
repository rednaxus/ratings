var Promise = require('bluebird');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var livereload = require('express-livereload')

var Web3 = require('web3');
var parseRange = require('parse-numeric-range').parse;
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//console.log('web3 version:',web3)
app.use(express.static('www'));
var config = {
  watchDir:process.cwd() + "/www",
};

// livereload(app, config);


app.use(bodyParser.urlencoded({ extended: true })); // configure app to use bodyParser()
app.use(bodyParser.json());                         // this will let us get the data from a POST


// proxy to ethereum private server
var httpProxy = require('http-proxy');
var ethProxy = httpProxy.createProxyServer({});
//app.use('/eth', ethproxy({target: 'http://localhost:8545'}));


var getAccountBalance = (account,cb) => {
  console.log('getting eth balance');
  web3.eth.getBalance(account,(err,result)=> {
    console.log('got eth balance:',web3.fromWei(result,'ether'));
    if (cb) cb(val);
  });
}

var getBlock = () => { // delete me
  var block = 2000000;
  var getEthBlock = Promise.promisify(web3.eth.getBlock);
  getEthBlock(block).then((result)=> {
    console.log('got block '+block+':',result);
  });
}


var getBlocks = (blockrange) => {
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

var doEthTests = () => {

  getAccountBalance('0x935A534AC8cfF53221D6bE2eF1531342f5895a44');
  // getBlock();
}
// doEthTests();

var port = process.env.PORT || 8030;        // set our port

var apiRouter = express.Router();              // get an instance of the express Router
apiRouter.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to api!' });   
});

/*
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x7E5BCE8eE498F6C29e4DdAd10CB816D6E2f139f7", "latest"],"id":1}' http://localhost:8545
*/
apiRouter.route('/eth')
  .get(function(req,res){
    console.log('got get');
  })
  .post(function(req,res) {
    console.log('got post, making proxy request',req.body);
    ethProxy.web(req, res, { target: 'http://localhost:8545' }, function(e) { 
      console.log('got proxy response',e);
      res.json({message:"got it"});
    });
  });

apiRouter.route('/blocks')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .get(function(req,res){
      var type = req.query.type || 'eth'; // 'bc'
      var range = req.query.range || '1-32';
      getBlocks(range,type).then((blocks)=> {
        res.json(blocks);
      });
      
    })
    .post(function(req, res) {
      console.log('got post');
      res.json({message:'got post'});
        /*
        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });
        */
    });


app.use('/api', apiRouter);


app.listen(port, function () {
  console.log('listening on port '+port);
});



