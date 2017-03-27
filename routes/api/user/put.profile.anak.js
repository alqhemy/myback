const Joi = require('joi');
const Boom = require('boom');
// const config = require('../../config.js');

module.exports = {
    path: '/web/api/user/{id}/anak',
    method: 'PUT',
    config: {
        description: 'Get all childs of user by id',
        validate: {
            params: {
                id: Joi.string()
            },
            payload: {
                id_sekolah: Joi.string(),
                id_anak: Joi.string()
            }
        }
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].User;
        const id = request.params.id;
        const sekolah = request.payload.id_sekolah;
        const anak = request.payload.id_anak;
        const update = {
            $push: { anak: [{ id_anak: anak }, { id_sekolah: sekolah }] }
        };
        User.findByIdAndUpdate(id, update, (err, result) => {
            if(err) {
                reply(Boom.notFound('Document not found'));
            } else {
                reply(result);
            }
        });
    }
};
