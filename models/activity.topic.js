const Joi = require('joi');
const MongoModels = require('mongo-models');

class ActivityTopic extends MongoModels {}

ActivityTopic.collection = 'activityTopics';
ActivityTopic.schema = Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string().required()
});

module.exports = ActivityTopic;
