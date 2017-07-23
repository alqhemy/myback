const Joi = require('joi');
const MongoModels = require('mongo-models');

class CommentEntry extends MongoModels {}

// CommentEntry.collection = 'comments';

CommentEntry.schema = Joi.object().keys({
    id: Joi.string(),
    comment: Joi.string().required(),
    timeCreated: Joi.date().required(),
    name: Joi.string().lowercase().required(),
    title: Joi.string(),
    uid: Joi.string()
});

module.exports = CommentEntry;
