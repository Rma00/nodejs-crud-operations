/**
* @description defined all the application level endpoints
* @author Rma
*/

'use strict'

/**
 * @description routes handler
 * @param {object} accepts express app initialization
 */

// Custom Modules
const { middleware, failureHandler } = require('../middleware/controllers')
const { crud } = require('../services');


const handler = (app) => {

    app.all('*', (req, res, next) => {
        middleware.trackMaintenanceActivity(req, res, next)
    })

    app.get('/getHealth', (req, res) => {
        return res.status(200).json({ code: 200, message: 'Online' })
    })

    app.post('/insertProduct', (req, res) => {
        crud.insertData(req, res)
    })
    
    app.put('/updateProduct', (req, res) => {
        crud.updateData(req, res)
    })

    app.delete('/deleteProduct/:productId', (req, res) => {
        crud.deleteData(req, res)
    })

    app.get('/gettAllProducts', (req, res) => {
        crud.gettAllProducts(req, res)
    })


    app.all('*', (req, res) => {
        return failureHandler.manageError(req, res, `Endpoint - ${req.url} not found`, 'notFound')
    })
}

module.exports.handler = handler