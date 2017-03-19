'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');


class NoteEntry extends MongoModels {
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

NoteEntry.collection = 'notes';
NoteEntry.schema = Joi.object().keys({
    _id: Joi.string().required(),
    topic: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string(),
    timeCreated: Joi.date().required(),
    id_user: Joi.string(),
    class: Joi.string(),
    images: Joi.array().items(Joi.object().keys({
        image: Joi.string(),
        description: Joi.string()
    }))
});


module.exports = NoteEntry;
