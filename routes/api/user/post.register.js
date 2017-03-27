const Joi = require('joi');
const JWT = require('jsonwebtoken');
const config = require('../../../config.js');

module.exports = {
    path: '/web/api/register',
    method: 'POST',
    config: {
        description: 'User registratrion',
        validate: {
            payload: {
                uid: Joi.string().min(3).max(80),
                email: Joi.string().email()
            }
        }
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].User;
        const register = {
            isActive: true,
            email: request.payload.email,
            uid: request.payload.uid,
            timeCreated: new Date()
        };
        User.insertOne(register, (err, user) => {
            if(err) {
                reply(err);
            } else {
                const id = user._id.toString();
                const session = {
                    active: true,
                    user: user.email,
                    id
                };
                const auth = JWT.sign(session, config.authKey);
                reply({ token: auth });
            }
        });
    }
};

