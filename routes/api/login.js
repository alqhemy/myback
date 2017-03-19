const Joi = require('joi');
// const config = require('../../config.js');

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
        const username = request.payload.username;
        const password = request.payload.password;

        User.findByCredentials(username, password, (err, user) => {
            if(err) {
                return reply(err);
            }
            if(user) {
                reply({ status: 'ok', data: user });
            } else {
                reply({ status: 'user not found' });
            }
        });
    }
};
