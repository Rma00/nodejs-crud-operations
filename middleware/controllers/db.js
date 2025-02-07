/**
* @description mongo db interface
* @author Rma
*/

'use strict'

// NPM Modules
let mongo = require('mongodb').MongoClient

// Configurations
const { databases } = require('../../config').storage

// get mongo connection client
const client = new mongo(databases.mongo.writer)

let db = null

async function main() {
    try {
        await client.connect()
        db = client.db(databases.mongo.database)
        return `Connected to: ${databases.mongo.database}`
    } catch (error) {
        return error
    }

}
main().then(console.log).catch(console.error)


const objectId = require('mongodb').ObjectID

// MongoDB Operators
let operators = {
    $eq: '$eq',
    $ne: '$ne',
    $gt: '$gt',
    $lt: '$lt',
    $ge: '$gte',
    $gte: '$gte',
    $le: '$lte',
    $lte: '$lte',
    $in: '$in',
    $nin: '$nin',
    $sw: '$sw',
    $ew: '$ew',
    $so: '$so',
    $and: '$and'
}


/**
 * @description gets single document from a collection by ProductId
 * @param {string} collection collection name
 * @param {string} id
 * @return {Promise} document found
 */
let find = (collection, filterString) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            const productId = await parse(filterString)
            if (!productId) return resolve({ code: 400, message: "Invalid Product Id" })
            const result = await db.collection(lower).findOne(productId)
            return resolve(result)
        }
        catch (exception) {
            console.error("exception", exception)
            return reject(exception)
        }
    })
}

/**
 * @description gets single document from a collection by ProductId
 * @param {string} collection collection name
 * @param {string} id
 * @return {Promise} document found
 */
let findMany = (collection) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            const result = await db.collection(lower).find().toArray()
            return resolve(result)
        }
        catch (exception) {
            console.error("exception", exception)
            return reject(exception)
        }
    })
}


/**
 * @description inserts one or more documents into a collection
 * @param {string} collection collection name
 * @param {array} data array of objects to insert
 * @return {Promise} result
 */
let insert = (collection, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            const result = await db.collection(lower).insertMany(data)
            return resolve(result)
        }
        catch (exception) {
            return reject(exception)
        }
    })
}

/**
 * @description updates one document in a collection
 * @param {string} collection collection name
 * @param {string} id  
 * @param {object} data object to update
 * @return {Promise} result
 */
let updateDoc = (collection, filterString, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            const filters = await parse(filterString)
            const result = await db.collection(lower).updateOne(filters, { $set: data })
            return resolve(result)
        }
        catch (exception) {
            return reject(exception)
        }
    })
}


/**
 * @description deletes document from a collection provided the ID is known
 * @param {string} collection collection name
 * @param {string} id  
 * @return {Promise} result
 */
let deleteDoc = (collection, filterString) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            const productId = await parse(filterString)
            if (!productId) return resolve({ code: 400, message: "Invalid Product Id" })
            const result = await db.collection(lower).deleteOne(productId)
            console.log(result)
            return resolve(result)
        }
        catch (exception) {
            return reject(exception)
        }
    })
}


/**
 * PUBLIC Function
 * @param {String} string
 * @returns {Object/null} valid MongoDB filter object
 */
let parse = (string) => {
    return new Promise((resolve, reject) => {
        try {
            if (!string) return resolve(false)
            let result = eachSection(string.trim()) || false
            return resolve(result)
        }
        catch (e) {
            console.log(e)
            return resolve(false)
        }
    })
}

let eachSection = (string) => {
    let pattern = /\s+\$and\s+|\s+\$or\s+/i
    let array = string.split(pattern)
    let filters = array.map(elem => eachCondition(elem)).filter(x => x)
    if (!filters.length) return null
    if (filters.length > 1) {
        let conj = findConjunction(string)
        return { [conj]: filters }
    }
    else return filters[0]
}

/**
 * INTERNAL Function to parse each condition
 * @param {String} string 
 * @returns {Object/null} valid MongoDB filter Object for one condition only
 */
let eachCondition = (string) => {
    let pattern = /([^\$]+)\s+(\$[a-z]+)\s+([^\$]+)\s*/i
    let [, key, operator, value] = string.match(pattern) || []
    if (key) {
        operator = operators[operator.toLowerCase()]
        if (key === '_id') {
            if (operator.match(/\$nin|\$in/i)) value = value.split(/\s*,\s*/).map(each => objectId(each))
            else value = objectId(value)
        }
        else {
            if (operator.match(/\$nin|\$in/i)) value = value.split(/\s*,\s*/)
            else {
                try {
                    value = JSON.parse(value)
                }
                catch (e) { console.log('could not parse ' + value) }
            }
        }
        return { [key]: { [operator]: value } }
    }
    else return null
}

module.exports.find = find
module.exports.findMany = findMany
module.exports.insert = insert
module.exports.parse = parse
module.exports.update = updateDoc
module.exports.delete = deleteDoc