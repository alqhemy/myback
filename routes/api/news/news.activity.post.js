// const Boom = require('boom');
const Joi = require('joi');
// const Async = require('async');

module.exports = {
    path: 'web/api/sekolah/news/{id}/aktivitas',
    method: 'POST',
    config: {
        description: 'Post new stream topic',
        validate: {
            params: {
                id: Joi.string()
            },
            payload: {
                id_user: Joi.string().required(),
                id_topic: Joi.string().required(),
            }
        }
    },
    handler(request, reply) {
        const note = request.server.plugins['hapi-mongo-models'].NoteEntry;
        const id = request.params.id;
        const update = {
            students: {
                id_topic: request.payload.id_topic,
                id_user: request.payload.id_sekolah,
                timeCreated: new Date()
            }
        };

        note.findByIdAndUpdate(id, update, (err, res) => {
            if(err) {
                reply(err);
            } else {
                reply(res);
            }
        });
    }
};
