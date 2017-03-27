const Boom = require('boom');
// const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/sekolah',
    method: 'GET',
    config: {
        description: 'Get all data about sekolah',
        tags: ['api', 'students']
    },
    handler(request, reply) {
        const School = request.server.plugins['hapi-mongo-models'].School;
        School.find({}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};

