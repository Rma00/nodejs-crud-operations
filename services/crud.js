/**
* @description  This is Service we use for Create and Update operations:
* @author Rma
*/

'use strict'

// Custom Modules
const { failureHandler, db, validate } = require('../middleware/controllers')



/**
 * @description This function is used to inser data in mongoDB:
 * @auther - Rma 
 * @param {*} req
 * @param {*} res
 * @return {*}  
 */
const insertData = async (req, res) => {
    try {
        let requestBody = req.body;
        let payload = await validate.payload(requestBody, 'insertData');

        const findProductId = await db.find('products', `productId $eq "${payload.productId}"`);
        if (findProductId) return failureHandler.manageError(req, res, `Product Id Already Exist !`, 'validate')

        let dbPayload = payload;
        dbPayload.createdAt = new Date();
        await db.insert('products', [dbPayload]).then(result => console.log('Product Inserted !')).catch(err => console.log('Error: inserting products !', err));

        return res.status(200).json({ code: 200, message: "Success Product Inserted!", result: payload });
    } catch (exception) {
        console.error(exception)
        return failureHandler.manageError(req, res, exception.message ? 'ERROR: Forbidden' : exception, exception.message ? 'forbidden' : 'badRequest');
    }
}

/**
 * @description This function is used to update data based on product id:
 * @auther - Rma 
 * @param {*} req
 * @param {*} res
 * @return {*}  
 */
const updateData = async (req, res) => {
    try {
        let requestBody = req.body;
        let payload = await validate.payload(requestBody, 'updateData');

        const findProductId = await db.find('products', `productId $eq "${payload.productId}"`);
        if (!findProductId) return failureHandler.manageError(req, res, `Products Not Found !`, 'notFound');

        let dbPayload = findProductId;
        dbPayload.productCategory = payload.productCategory;
        dbPayload.productName = payload.productName;
        dbPayload.productDescription = payload.productDescription;
        dbPayload.updatedAt = new Date();
        await db.update('products', `productId $eq "${payload.productId}"`, dbPayload).then(result => console.log('Product Updated !')).catch(err => console.log('Error: updating products !', err));

        return res.status(200).json({ code: 200, message: "Success Product Updated!", result: payload });
    } catch (exception) {
        console.error(exception)
        return failureHandler.manageError(req, res, exception.message ? 'ERROR: Forbidden' : exception, exception.message ? 'forbidden' : 'badRequest');
    }
}

/**
 * @description This function is used to delete data based on product id:
 * @auther - Rma 
 * @param {*} req
 * @param {*} res
 * @return {*}  
 */
const deleteData = async (req, res) => {
    try {
        let productId = req.params.productId;
        if (!productId) return failureHandler.manageError(req, res, `Please Provide Valid Product Id !`, 'validate');

        const findProductId = await db.find('products', `productId $eq "${productId}"`);
        if (!findProductId) return failureHandler.manageError(req, res, `Products Not Found !`, 'notFound');

        const deleteProduct = await db.delete('products', `productId $eq "${productId}"`);
        console.log('deleteProduct', deleteProduct)

        return res.status(200).json({ code: 200, message: "Success Product Deleted!" });
    } catch (exception) {
        console.error(exception)
        return failureHandler.manageError(req, res, exception.message ? 'ERROR: Forbidden' : exception, exception.message ? 'forbidden' : 'badRequest');
    }
}

/**
 * @description This function is used to fetch all data from collection:
 * @auther - Rma 
 * @param {*} req
 * @param {*} res
 * @return {*}  
 */
const gettAllProducts = async (req, res) => {
    try {
        const findProductId = await db.findMany('products');
        console.log(findProductId)
        if (!findProductId) return failureHandler.manageError(req, res, `Products Not Found !`, 'notFound');
        return res.status(200).json({ code: 200, message: "Success Product Fetched!", result: findProductId });
    } catch (exception) {
        console.error(exception)
        return failureHandler.manageError(req, res, exception.message ? 'ERROR: Forbidden' : exception, exception.message ? 'forbidden' : 'badRequest');
    }
}



module.exports.insertData = insertData
module.exports.updateData = updateData
module.exports.gettAllProducts = gettAllProducts
module.exports.deleteData = deleteData