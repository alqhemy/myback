// const Boom = require('boom');
const Joi = require('joi');
// const Async = require('async');

module.exports = {
    path: '/web/api/sekolah/news',
    method: 'POST',
    config: {
        description: 'Post new stream topic',
        validate: {
            payload: {
                topic: Joi.string().required(),
                description: Joi.string().required(),
                category: Joi.string(),
                tag: Joi.string(),
                username: Joi.string(),
                id_user: Joi.string(),
                id_sekolah: Joi.string(),
                publish: Joi.bool().default(false)
            }
        }
    },
    handler(request, reply) {
        const note = request.server.plugins['hapi-mongo-models'].NoteEntry;

        const document = {
            topic: request.payload.topic,
            description: request.payload.description,
            category: request.payload.category,
            id_user: request.payload.id_user,
            id_sekolah: request.payload.id_sekolah,
            username: request.payload.username,
            publish: request.payload.publish,
            timeCreated: new Date()
        };

        note.insertOne(document, (err, res) => {
            if(err) {
                reply(err);
            } else {
                reply(res);
            }
        });
    }
};
