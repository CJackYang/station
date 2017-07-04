const client = require('socket.io-client')

class Connect {
  constructor(address){
    this.address = address
    this.connect(address)
  }

  connect(address){
    this.socket = client(address,{
      transports: ['websocket']
    })
    this.socket.on('connect', function(){});
    this.socket.on('event', function(data){});
    this.socket.on('disconnect', function(){});
    this.socket.on('connect_error',console.error.bind(console, 'Connnect-Error: '))
  }
}

module.exports = Connect