/**
* @description API payloads to validate against incoming request body
* @author Rma
*/

'use strict'

//NPM Modules
let joi = require('joi')


const insertData = joi.object().keys({
    productId: joi.string().trim().min(4).max(6).pattern(/^[0-9]+$/, { invert: false }).message('Other characters are not allowed !').required(),
    productName: joi.string().trim().optional().regex(/[/~!@#$%^&*_+,-.:;"{}=[-`(\)<>?]/, { invert: true }).message('Special characters are not allowed !'),
    productCategory: joi.string().trim().optional().regex(/[/~!@#$%^&*_+,-.:;"{}=[-`(\)<>?]/, { invert: true }).message('Special characters are not allowed !'),
    productDescription: joi.string().trim().optional().regex(/[/~!@#$%^&*_+,-.:;"{}=[-`<>?]/, { invert: true }).message('Special characters are not allowed !')
})

const updateData = joi.object().keys({
    productId: joi.string().trim().min(4).max(6).pattern(/^[0-9]+$/, { invert: false }).message('Other characters are not allowed !').required(),
    productName: joi.string().trim().optional().regex(/[/~!@#$%^&*_+,-.:;"{}=[-`(\)<>?]/, { invert: true }).message('Special characters are not allowed !'),
    productCategory: joi.string().trim().optional().regex(/[/~!@#$%^&*_+,-.:;"{}=[-`(\)<>?]/, { invert: true }).message('Special characters are not allowed !'),
    productDescription: joi.string().trim().optional().regex(/[/~!@#$%^&*_+,-.:;"{}=[-`<>?]/, { invert: true }).message('Special characters are not allowed !')
})


module.exports.insertData = insertData
module.exports.updateData = updateData