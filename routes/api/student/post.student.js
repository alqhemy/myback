const Boom = require('boom');
const Joi = require('joi');

module.exports = {
    path: '/web/api/sekolah/siswa',
    method: 'POST',
    config: {
        description: 'Get all data abaout student',
        validate: {
            payload: {
                filter: Joi.object()
            }
        }
    },
    handler(request, reply) {
        const Student = request.server.plugins['hapi-mongo-models'].Student;
        const filter = request.payload.filter;

        Student.find(filter, {}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply({ total: res.length, data: res });
        });
    }
};

