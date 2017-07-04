const fs = require('fs')
const path = require('path')
const EventEmitter = require('events').EventEmitter

const ursa = require('ursa')
const Promise = require('bluebird')

const { FILE, CONFIG } = require('./const')

Promise.promisifyAll(fs)

class StationInitial extends EventEmitter{
  constructor() {
    super()
    this.initAsync()
      .then((err, data) => {
        this.emit('StationInitialDone',null)
      })
      .catch(e => {
        this.emit('StationInitialDone', e)
      })
  }

  async initAsync() {
    try{
      let pbStat = await fs.lstatAsync(path.join(process.cwd(), FILE.PUBKEY))
      let pvStat = await fs.lstatAsync(path.join(process.cwd(), FILE.PVKEY))
      if(pbStat.isFile() && pvStat.isFile())
        return
      return await this.createKeysAsync()
      
    }catch(e){
      if(e.code === 'ENOENT')
        return await this.createKeysAsync()
      throw e
    }
  }

  async createKeysAsync() {
    let pbkPath = path.join(process.cwd(), FILE.PUBKEY)
    let pvkPath = path.join(process.cwd(), FILE.PVKEY)

    //remove keys 
    try{
      await fs.unlinkAsync(pbkPath)
      await fs.unlinkAsync(pvkPath)
    }catch(e){

    }

    let modulusBit = 512 

    let key  = ursa.generatePrivateKey(modulusBit, 65537)

    let privatePem = ursa.createPrivateKey(key.toPrivatePem()) //生成私钥
    let privateKey = privatePem.toPrivatePem('utf8')
    await fs.writeFileAsync(pvkPath, privateKey, 'utf8')


    let publicPem = ursa.createPublicKey(key.toPublicPem())   //生成公钥
    let publicKey = publicPem.toPublicPem('utf8')
    await fs.writeFileAsync(pbkPath, publicKey, 'utf8')
    return 
  }
}

module.exports = StationInitial