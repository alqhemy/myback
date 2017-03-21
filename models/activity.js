const Joi = require('joi');
const MongoModels = require('mongo-models');
const CommentEntry = require('./comment');


class Activity extends MongoModels {}

Activity.collection = 'activities';

Activity.schema = Joi.object().keys({
    _id: Joi.object(),
    id_user: Joi.string().required(),
    id_topic: Joi.string().required(),
    read: Joi.bool().default(false),
    timeCreated: Joi.date().required(),
    activity: Joi.array().items(Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required()
    })),
    comment: Joi.array().items(CommentEntry.schema)
});


module.exports = Activity;
