const Boom = require('boom');
const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/api/sekolah/{id}/guru',
    method: 'GET',
    config: {
        description: 'Get all data about teacher',
        validate: {
            params: {
                id: Joi.string()
            }
        }
    },
    handler(request, reply) {
        const Teacher = request.server.plugins['hapi-mongo-models'].Teacher;
        const id = request.params.id.toString();
        Teacher.find({ id_sekolah: id }, {}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};

