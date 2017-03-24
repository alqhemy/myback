'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');

class CommentEntry extends MongoModels {}

CommentEntry.schema = Joi.object().keys({
    comment: Joi.string().required(),
    timeCreated: Joi.date().required(),
    name: Joi.string().lowercase().required(),
    title: Joi.string()
});


module.exports = CommentEntry;
