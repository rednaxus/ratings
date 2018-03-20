/* 
   ethplorer api
  
*/
import axios  from 'axios'

const baseUrl = 'https://api.ethplorer.io/'
const params = { apiKey: 'freekey' }

const fetchInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  	'X-Requested-With': 'XMLHttpRequest'
  }
})

export const getTokenInfo = ( tokenAddr ) => {
  return fetchInstance.request({
     	method:'get',
      url:'getTokenInfo'
  })
}


