const Joi = require('joi');
const Boom = require('boom');
// const config = require('../../config.js');

module.exports = {
    path: '/web/api/user/{id}',
    method: 'GET',
    config: {
        description: 'Get data user by id',
        validate: {
            params: {
                id: Joi.string()
            }
        }
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].User;
        const id = request.params.id.toString();
        User.findById(id, (err, result) => {
            if(err) {
                reply(Boom.badData(err));
            } else {
                reply(result);
            }
        });
    }
};
