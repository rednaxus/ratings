import { appConfig }  from '../config'


export const referralCode = {

  getRefCodePair: function () {

    console.log ("ID -> REGISTRATION CODE")

    const pairGen = require('ethereumjs-wallet');
    const keyPair = pairGen.generate();

    var regKey = keyPair.getPrivateKey()

    var analystId = keyPair.getAddressString()
    var regKeyString = keyPair.getPrivateKeyString()

    console.log ("Analyst ID: " + analystId)
    console.log ("Registration Code: " + regKeyString)

    return analystId

  }

}
