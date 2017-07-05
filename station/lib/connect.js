const EventEmitter = require('events').EventEmitter
const fs = require('fs')
const path = require('path')

const client = require('socket.io-client')
const ursa = require('ursa')

const { FILE } = require('./const')

class Connect extends EventEmitter{ 
  constructor(address){
    super()
    this.address = address
    this.connect(address)
  }

  connect(address){
    this.socket = client(address,{
      transports: ['websocket']
    })
    this.socket.on('connect', (() => {
      console.log('connent success')
      this.send('requestLogin',{ id: SA.id})
    }).bind(this))
    this.socket.on('event', ((data) => {
      this.dispatch(data.type, data)
    }).bind(this))
    this.socket.on('message', ((data) => {
      this.dispatch(data.type, data.data)
    }).bind(this))
    this.socket.on('disconnect', () => {
      console.log('connent disconnect')
    })
    this.socket.on('connect_error',console.error.bind(console, 'Connnect-Error: '))
  }

  dispatch(eventType, data){
    console.log('dispatch:', eventType, data)
    if(eventType === 'checkLogin'){
      let secretKey = ursa.createPrivateKey(fs.readFileSync(path.join(process.cwd(), FILE.PVKEY)))
      let seed = secretKey.decrypt(data.encryptData, 'base64', 'utf8')
      this.send('login', { seed })
    }
    if(eventType === 'login'){
      let success = data.success
      console.log(success)
    }
  }

  send(eventType, data){
    console.log(eventType, data)
    this.socket.emit('message', { type: eventType, data})
  }
}

module.exports = Connect