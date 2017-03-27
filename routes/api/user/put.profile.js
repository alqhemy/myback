const Boom = require('boom');
const Joi = require('joi');
// const Async = require('async');
const JWT = require('jsonwebtoken');
const config = require('../../../config.js');

// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/profiles',
    method: 'PUT',
    config: {
        description: 'Get all data from siswa',
        auth: 'jwt',
        validate: {
            payload: {
                avatar: Joi.object(),
                child: Joi.array().items(Joi.object().keys({
                    sekolah: Joi.string(),
                    nis: Joi.string()
                })),
                teacher: Joi.array().items(Joi.object().keys({
                    id: Joi.string()
                }))
            }
        }
    },
    handler(request, reply) {
        const decode = JWT.verify(request.auth.token, config.authKey);
        const User = request.server.plugins['hapi-mongo-models'].User;
        const id = decode.id;
        const update = {
            $push: {
                avatar: request.payload.avatar,
                child: request.payload.child,
                jabatan: request.payload.jabatan
            }
        }

        User.findIdAndUpdate(id, update, (err, res) => {
            if(err){
                reply(Boom.badData('data cannot be saved'));
            } else {
                reply(res);
            }
        });
    }
};
