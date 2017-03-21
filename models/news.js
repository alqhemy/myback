const Joi = require('joi');
const MongoModels = require('mongo-models');
const CommentEntry = require('./comment');


class NoteEntry extends MongoModels {}

NoteEntry.collection = 'notes';

NoteEntry.schema = Joi.object().keys({
    _id: Joi.object(),
    topic: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string(),
    tag: Joi.string(),
    publish: Joi.bool().default(false),
    timeCreated: Joi.date().required(),
    username: Joi.string(),
    id_user: Joi.string().required(),
    id_sekolah: Joi.string().required(),
    // students: Joi.array().items(Activity.schema),
    comment: Joi.array().items(CommentEntry.schema),
    images: Joi.array().items(Joi.object().keys({
        image: Joi.string(),
        title: Joi.string(),
        description: Joi.string()
    })),
    video: Joi.array().items(Joi.object().keys({
        image: Joi.string(),
        title: Joi.string(),
        description: Joi.string()
    }))

});

NoteEntry.indexes = [
    { key: { name: 1 } },
    { key: { email: -1 } }
];
module.exports = NoteEntry;
