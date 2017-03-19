'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');
const CommentEntry = require('./comment');


class Activity extends MongoModels {
    static create(topic, description, category, user, callback) {
        const self = this;
        const document = {
            topic: topic.string(),
            description: description.string(),
            id_user: user.string(),
            timeCreated: new Date()
        };
        self.insertOne(document, (err, results) => {
            if(err) {
                return callback(err);
            }
            return callback(null, results.newUser[0]);
        });
    }
}

Activity.collection = 'note';
Activity.schema = Joi.object().keys({
    _id: Joi.string().required(),
    id_note: Joi.string().required(),
    timeCreated: Joi.date().required(),
    activity: Joi.array().items(Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required()
    })),
    student: Joi.object().keys({
        id_sekolah: Joi.string().required(),
        id_nis: Joi.string().required()
    }),
    comment: Joi.array().items(CommentEntry.schema)
});


module.exports = Activity;
