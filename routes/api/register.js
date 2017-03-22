const Joi = require('joi');
const JWT = require('jsonwebtoken');
const config = require('../../config.js');

module.exports = {
    path: '/web/api/register',
    method: 'POST',
    config: {
        description: 'User registratrion',
        validate: {
            payload: {
                username: Joi.string().required().lowercase(),
                password: Joi.string().min(6).max(80),
                uid: Joi.string().min(3).max(80),
                email: Joi.string().email()
            }
        }
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].User;
        const username = request.payload.username;
        const password = request.payload.password;
        const email = request.payload.email;

        User.create(username, password, email);
        const session = {
            id: 1,
            role: 'user',
            username: request.payload.username
        };
        const auth = JWT.sign(session, config.authKey);
        reply({ token: auth });
    }
};

