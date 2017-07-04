const http = require('http')

const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const uuid = require('uuid')
const utils = require('./network')
const request = require('superagent')

const app = express()

let SA = new Map()

let WA = new Map()



let bindingRoom = new Map()

app.use(logger('dev', {
  skip: (req, res) => res.nolog === true
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/register', (req, res) => {
  // console.log(req)
  let pbk = req.body.pubkey
  let sa_uuid = uuid.v4()
  let date = new Date().getTime()
  let sa = {pbk, date, sa_uuid}
  SA.set(sa_uuid, sa)
  res.status(200).json(sa)
})

app.post('/chatRoom', (req, res) => {
  let sa_uuid = req.body.sa_uuid
  let sa = SA.get(sa_uuid)
  if(!sa) return res.status(400)
  let roomid = uuid.v4()
  let endtime = new Date().getTime() + 7000
  let room = { roomid, endtime, sa }
  bindingRoom.set(roomid, room)
  res.status(200).json({ roomid, url: 'http://localhost:8080/chatRoom/' + roomid})
})

app.get('/chatRoom/:roomid', (req, res) => {
  let room = bindingRoom.get(req.params.roomid)
  let code = req.query.code
  utils.getAccessToken(code, (err, data) => {
    if(err) return res.status(400)
    utils.getUserInfo(data.access_token, data.openid, (err, data) => {
      if(err) return res.status(400)
      Object.assign(data, { said: room.sa.sa_uuid})
      return res.status(200)
    })
  })
})

app.get('/', (req, res) => {
  res.status(200).json('hello world')
})


app.get('/123', (req, res) => {
  request
    .get('http://localhost:8888/123')
    .end((err, res2) => {
      res2.pipe(res)
    })
})
http.createServer(app).listen(8080, () => {
  console.log('cloud run at port 8080')
})