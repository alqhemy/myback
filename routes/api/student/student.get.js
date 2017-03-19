const Boom = require('boom');
const Joi = require('joi');

module.exports = {
    path: '/api/sekolah/{id}/siswa',
    method: 'GET',
    config: {
        description: 'Get all data abaout student',
        validate: {
            params: {
                id: Joi.string()
            }
        }
    },
    handler(request, reply) {
        const Student = request.server.plugins['hapi-mongo-models'].Student;
        const id = request.params.id.toString();
        Student.find({ id_sekolah: id }, {}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};

