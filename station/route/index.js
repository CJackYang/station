const Router = require('express').Router

let router = Router()

router.use('/tickets',require('./tickets'))

module.exports = router
