const Boom = require('boom');
const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/sekolah/guru',
    method: 'POST',
    config: {
        description: 'Get all data about teacher',
        validate: {
            payload: {
                filter: Joi.object()
            }
        }
    },
    handler(request, reply) {
        const Teacher = request.server.plugins['hapi-mongo-models'].Teacher;
        const filter = request.payload.id;
        Teacher.find(filter, {}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply({ data: res });
        });
    }
};

