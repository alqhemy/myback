const Boom = require('boom');
// const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/referensi/activity',
    method: 'GET',
    config: {
        description: 'Get all topic to stream'
    },
    handler(request, reply) {
        const ActivityTopic = request.server.plugins['hapi-mongo-models'].ActivityTopic;
        ActivityTopic.find({}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};

