const Boom = require('boom');
const Joi = require('joi');
// const Async = require('async');
const JWT = require('jsonwebtoken');
const config = require('../../../config.js');

// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/profile/anak',
    method: 'PUT',
    config: {
        description: 'Get all data from siswa',
        auth: 'jwt',
        validate: {
            payload: {
                child: Joi.object().keys({
                    sekolah: Joi.string(),
                    nis: Joi.string()
                })
            }
        }
    },
    handler(request, reply) {
        const decode = JWT.verify(request.auth.token, config.authKey);
        const User = request.server.plugins['hapi-mongo-models'].User;
        const id = decode.id;
        const update = {
            $push: {
                child: request.payload.child
            }
        };

        User.findByIdAndUpdate(id, update, (err, res) => {
            if(err){
                reply(Boom.badData('data cannot be saved'));
            } else {
                reply(res);
            }
        });
    }
};
