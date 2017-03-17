const Boom = require('boom');
const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/api/siswa',
    method: 'GET',
    config: {
        tag: ['api'],
        description: 'Get all data from siswa'
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].User;
        User.find({}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};
module.exports = {
    path: '/api/siswa/{id}',
    method: 'GET',
    config:{
        tags: ['api'],
        description: 'Get singgle data from siswa',
        notes: 'id data',
        validate: {
            payload: {
                id: Joi.string().min(6).max(80).allow(null)
            }
        }
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].User;
        User.find({}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};
