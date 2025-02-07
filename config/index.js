/**
* @description manages application configurations
* @author Rma 
*/

'use strict'

require('dotenv').config()

const env = process.env.NODE_ENV || "development"
console.log('ENVIRONMENT:', env)

module.exports = require(`./${env}`)


