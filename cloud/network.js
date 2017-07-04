const request = require('superagent')

let appid = 'wx99b54eb728323fe8'
let appSecret = '0a997d6d0a5484f295fd590aeeba95d5'
let access_token_api = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx99b54eb728323fe8&secret=' + appSecret

let getAccessToken = (code, callback) => {
  request
    .get(access_token_api + '&code=' + code + '&grant_type=authorization_code')
    .set('Accept', 'application/json')
    .end((err, res) => {
      if(err) return callback(err)
      if(res.status !== 200) return callback(res.error)
      console.log(res.body)
      console.log(res.text)
      return callback(null, res.body)
    })
}

module.exports.getAccessToken = getAccessToken

let getUserInfo = (accessToken, openid, callback) => {
  request
    .get('https://api.weixin.qq.com/sns/auth?access_token=' + accessToken +　'&openid=' + openid)
    .set('Accept', 'application/j-on')
    .end((err, res) => {
      if(err) return callback(err)
      if(res.status !== 200) return callback(res.error)
      console.log(res.body)
      console.log(res.text)
      return callback(null, res.body)
    })
}

module.exports.getUserInfo = getUserInfo
