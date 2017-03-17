const Joi = require('joi');
const Boom = require('boom');

module.exports = {
    path: '/users',
    method: 'POST',
    handler(request, reply) {
        if(request.payload.password1 !== request.payload.password2) {
            reply(Boom.notAcceptable('Passwords have to match'));
        } else {
            const post = {
                name: request.payload.username,
                user: request.payload.email,
                password: request.payload.password2
            };
            request.app.db.query('Insert Into Users Set ? ', post, (err) => {
                if(err) {
                    request.log(['error'], err);
                    reply(Boom.badImplementation('No time'));
                } else {
                    reply({ status: 'ok' });
                }
            });
            // reply(Boom.notImplemented());
        }
    },
    config: {
        description: 'Register',
        validate: {
            payload: {
                username: Joi.string().required().lowercase(),
                // firstName: Joi.string().min(3).max(80),
                // lastName: Joi.string().min(3).max(80),
                password1: Joi.string().min(6).max(80),
                password2: Joi.string().min(6).max(80),
                // personalCode: Joi.string().min(3).max(80),
                email: Joi.string().email()
            }
        }
    }
};
