const Joi = require('joi');
const MongoModels = require('mongo-models');
const CommentEntry = require('./comment');


class NoteEntry extends MongoModels {}

NoteEntry.collection = 'news';

NoteEntry.schema = Joi.object().keys({
    _id: Joi.object(),
    sekolah: Joi.string().required(),
    topic: Joi.string().required(),
    category: Joi.string(),
    title: Joi.string(),
    description: Joi.string().required(),
    publish: Joi.bool().default(false),
    timeCreated: Joi.date().required(),
    user: Joi.object().keys({
        id: Joi.string(),
        name: Joi.string(),
        title: Joi.string()
    }),
    comments: Joi.array().items(CommentEntry.schema),
    activity: Joi.array().items(),
    photos: Joi.array().items(Joi.object().keys({
        image: Joi.string(),
        location: Joi.string()
    })),
    videos: Joi.array().items(Joi.object().keys({
        video: Joi.string(),
        location: Joi.string()
    }))

});

NoteEntry.indexes = [
    { key: { 'user.id': 1 } },
    { key: { 'user.name': 1 } }
];
module.exports = NoteEntry;
