const request = require('superagent')

let postAsync = async (url, params, contentType) => {
  let reqHandle = request.post(url)
  if(params)
    reqHandle.send(params) 
  if(contentType)
    reqHandle.set('Content-Type', contentType)
  else
    reqHandle.set('Content-Type', 'application/json')
        
  return await request()
}

module.exports.postAsync = postAsync