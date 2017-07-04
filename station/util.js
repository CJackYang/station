const fs = require('fs')
const path = require('path')

const request = require('superagent')

let CLOUD_PATH = 'http://localhost:8080'
let pubkey = '123456798123456789'
let SA_PATH = path.join(process.cwd(), 'data/sa.js')

let register = (callback) => {
  fs.stat(SA_PATH, err => {
    if(err) return requestRegisterStation(callback)
    fs.readFile(SA_PATH, (err, data) => {
      if(err) return callback(err)
      return callback(null, JSON.parse(data))
    })
  })
}

let requestRegisterStation = (callback) => {
  request
    .post(CLOUD_PATH + '/register')
    .set('Content-Type', 'application/json')
    .send({
       pubkey
    })
    .end((err, res) => {
      if(err || res.status !== 200) return callback(new Error('register error')) 
      let ws = fs.createWriteStream(path.join(process.cwd(), 'data/sa.js'))
      ws.write(JSON.stringify(res.body, null, ' '))
      ws.close()
      return callback(null, res.body)
    }) 
}

let createRoom = (callback) => {
  register((err, data) => {
    if(err) return callback(err)
    request
    .post(CLOUD_PATH + '/chatRoom')
    .send({sa_uuid: data.sa_uuid})
    .end((err, res) => {
      if(err) return callback(err)
      if(res.status !== 200) return callback(res.error)
      return callback(null, res.body)
    })
  })
  
}


module.exports.register = register
module.exports.createRoom = createRoom