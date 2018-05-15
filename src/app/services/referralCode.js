//import { appConfig }  from '../config'
import { generate } from 'ethereumjs-wallet'

export const referralCode = {

  getRefCodePair: () => {

    console.log ("ID -> REGISTRATION CODE")

    //const pairGen = require('ethereumjs-wallet');
    const keyPair = generate()

    var regKey = keyPair.getPrivateKey()

    var analystId = keyPair.getAddressString()
    var regKeyString = keyPair.getPrivateKeyString()

    console.log ("Analyst ID: " + analystId)
    console.log ("Registration Code: " + regKeyString)

    return { identity: analystId, regcode: regKeyString }

  }

}

export default referralCode

