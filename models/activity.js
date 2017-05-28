const Joi = require('joi');
const MongoModels = require('mongo-models');
const CommentEntry = require('./comment');


class Activity extends MongoModels {}

Activity.collection = 'activities';

Activity.schema = Joi.object().keys({
    _id: Joi.object(),
    newsId: Joi.string().required(),
    nis: Joi.string().required(),
    kelas: Joi.string().required(),
    school: Joi.string().required(),
    name: Joi.string().required(),
    kegiatan: Joi.string().required(),
    read: Joi.bool().default(false),
    timeCreated: Joi.date().required(),
    aktifitas: Joi.array().items(Joi.object().keys({
        title: Joi.string(),
        description: Joi.string()
    })),
    comments: Joi.array().items(CommentEntry.schema)
});

Activity.indexes = [
    { key: { email: 1, unique: true } }
];
module.exports = Activity;
