const request = require('superagent')

let postAsync = async () => {
  let req = request.get('http://localhost:27017').set
  return await req
}

let a = await postAsync()

