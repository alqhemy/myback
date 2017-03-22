const Boom = require('boom');
// const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: 'web/api/referensi/topic',
    method: 'GET',
    config: {
        description: 'Get all topic to stream'
    },
    handler(request, reply) {
        const Topic = request.server.plugins['hapi-mongo-models'].Topic;
        Topic.find({}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};

