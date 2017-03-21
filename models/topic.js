const Joi = require('joi');
const MongoModels = require('mongo-models');

class Topic extends MongoModels {}

Topic.collection = 'topics';
Topic.schema = Joi.object().keys({
    _id: Joi.string().required(),
    kategori: Joi.string().required()
});

module.exports = Topic;
