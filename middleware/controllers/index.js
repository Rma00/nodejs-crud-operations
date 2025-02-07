
/**
* @description exports controllers folder
* @author Rma
*/

'use strict'

module.exports.middleware = require('./middlewares')
module.exports.failureHandler = require('./failureHandler')
module.exports.validate = require('./validate')
module.exports.db = require('./db')