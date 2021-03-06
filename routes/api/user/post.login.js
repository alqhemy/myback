const Joi = require('joi');
const Boom = require('boom');
const JWT = require('jsonwebtoken');
const config = require('../../../config.js');

// const TOKEN_TTL = '30m';

module.exports = {
    path: '/web/api/login',
    method: 'POST',
    config: {
        description: 'User Login',
        validate: {
            payload: {
                password: Joi.string().min(6).max(80)
            }
        }
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].User;
        const uid = request.payload.password;

        User.find({ uid }, (err, result) => {
            if(err) {
                reply(err);
            }
            if(result) {
                if(result.length < 1) {
                    return reply(Boom.badData('User not found'));
                }
                const id = result[0]._id.toString();
                const session = {
                    active: result.isActive,
                    user: result.email,
                    id
                };
                const token = JWT.sign(session, config.authKey);

                const res = {
                    active: result[0].isActive,
                    user: result[0].email,
                    id,
                    token
                };
                reply(res);
            } else {
                reply({ status: 'User account is not active' });
            }
        });
    }
};
