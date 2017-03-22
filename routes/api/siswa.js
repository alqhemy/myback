const Boom = require('boom');
// const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/test/siswa',
    method: 'GET',
    config: {
        description: 'Get all data from siswa',
        auth: 'jwt'
    },
    handler(request, reply) {
        const token = request.auth.credentials;
        const User = request.server.plugins['hapi-mongo-models'].User;
        User.find({}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};
