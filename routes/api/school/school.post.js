const Boom = require('boom');
// const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: 'web/api/sekolah',
    method: 'POST',
    config: {
        description: 'Get all data about sekolah'
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
