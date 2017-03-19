const Boom = require('boom');
const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/api/sekolah/guru',
    method: 'POST',
    config: {
        description: 'Get all data about teacher',
        validate: {
            payload: {
                id: Joi.string()
            }
        }
    },
    handler(request, reply) {
        const Teacher = request.server.plugins['hapi-mongo-models'].Teacher;
        const id = request.payload.id.toString();
        Teacher.find({ id_sekolah: id }, {}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};

