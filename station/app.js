const http = require('http')
const path = require('path')

const express = require('express')
const uuid = require('uuid')
const bodyParser = require('body-parser')
const logger = require('morgan')

const Initial = require('./lib/initial')
const Register = require('./lib/register')
const Connect = require('./lib/connect')

const app = express()

app.use(logger('dev', {
  skip: (req, res) => res.nolog === true
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', require('./route'))

let initial = new Initial()
initial.on('StationInitialDone', err => {
  if(err) console.log('STATION INIT: ', err)
  else
    Register((e, data) => {
      if(e) console.log(e)
      global.SA = data.data //TODO SA in global
      let connect = new Connect('http://localhost')
    })
  app.listen(8888, () => {
    console.log('Station run at port 8888')
  })
})