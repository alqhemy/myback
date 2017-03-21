const Joi = require('joi');
const JWT = require('jsonwebtoken');
const config = require('../../config.js');

const TOKEN_TTL = '30m';

module.exports = {
    path: '/api/login',
    method: 'POST',
    config: {
        description: 'User Login',
        validate: {
            payload: {
                username: Joi.string().required().lowercase(),
                password: Joi.string().min(6).max(80)
            }
        }
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].User;
        const user = request.payload.username;
        const password = request.payload.password;

        const options = {
            expiresIn: TOKEN_TTL
        };
        User.findByCredentials(user, password, (err, result) => {
            if(err) {
                return reply(err);
            }
            if(result) {
                const session = {
                    id: result.email,
                    role: 'user',
                    username: result.username
                };
                const token = JWT.sign(session, config.authKey, options);

                const res = {
                    token,
                    username: request.payload.username
                };
                reply(res);
            } else {
                reply({ status: 'user not found' });
            }
        });
    }
};
