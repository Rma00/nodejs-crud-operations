/**
* @description provides middleware to track the every request
* @author Rma
*/

'use strict'

// Custom Modules
const failureHandler = require('./failureHandler')

// Configurations
const { application } = require('../../config')

/**
 *
 * @description check CORS 
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {object} next express next request
 * @return {null}
 */
const enableCors = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    res.setHeader("Access-Control-Allow-Credentials", true)
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type")
    next()
}

/**
 *
 * @description track request body (payload) of every request
 * @param {object} err error object
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {object} next express next request
 * @return {object} sends error response/ next request
 */
const trackRequest = (err, req, res, next) => {
    console.error(`${err.type} - ${err.message}`)
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return failureHandler.manageError(req, res, 'Bad Request!(Requested payload is not valid JSON)', 'badRequest')
    next()
}

/**
 *
 * @description tracks maintenance activity on each request
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {object} next express next request
 * @return {object} sends error response/ next request
 */
const trackMaintenanceActivity = (req, res, next) => {
    if (application.isMaintenance) return failureHandler.manageError(req, res, application.maintenanceMessage, 'maintenance')
    else next()
}


module.exports.cors = enableCors
module.exports.trackRequest = trackRequest
module.exports.trackMaintenanceActivity = trackMaintenanceActivity