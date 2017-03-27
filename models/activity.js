const Joi = require('joi');
const MongoModels = require('mongo-models');
const CommentEntry = require('./comment');


class Activity extends MongoModels {}

Activity.collection = 'activities';

Activity.schema = Joi.object().keys({
    _id: Joi.object(),
    news_id: Joi.string().required(),
    nis: Joi.string().required(),
    name: Joi.string().required(),
    read: Joi.bool().default(false),
    timeCreated: Joi.date().required(),
    activity: Joi.array().items(Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required()
    })),
    comments: Joi.array().items(CommentEntry.schema)
});

Activity.indexes = [
    { key: { email: 1, unique: true } }
];
module.exports = Activity;
