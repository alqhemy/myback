const Boom = require('boom');
const Joi = require('joi');

module.exports = {
    path: '/api/sekolah/siswa',
    method: 'POST',
    config: {
        description: 'Get all data abaout student',
        validate: {
            payload: {
                id: Joi.string()
            }
        }
    },
    handler(request, reply) {
        const Student = request.server.plugins['hapi-mongo-models'].Student;
        const id = request.payload.id.toString();
        Student.find({ id_sekolah: id }, {}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};

