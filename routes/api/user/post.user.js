const Boom = require('boom');
const Joi = require('joi');

module.exports = {
    path: '/web/api/user',
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
        const User = request.server.plugins['hapi-mongo-models'].User;
        const filter = request.payload.filter;

        User.find(filter, {}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply({ total: res.length, data: res });
        });
    }
};

