const Boom = require('boom');
const Joi = require('joi');
// const Async = require('async');
const JWT = require('jsonwebtoken');
const config = require('../../../config.js');

// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/profile/guru',
    method: 'PUT',
    config: {
        description: 'Get all data from siswa',
        auth: 'jwt',
        validate: {
            payload: {
                set: Joi.string().default('update'),
                teacher: Joi.object().keys({
                    id: Joi.string(),
                    sekolah: Joi.string()
                })
            }
        }
    },
    handler(request, reply) {
        const decode = JWT.verify(request.auth.token, config.authKey);
        const User = request.server.plugins['hapi-mongo-models'].User;
        const id = decode.id;
        const status = request.payload.set;
        if(status === 'delete'){
            const update = { $set: { teacher: request.payload.teacher } };
            User.findByIdAndUpdate(id, { id: '0' }, (err, res) => {
                if(err){
                    reply('{}');
                } else {
                    reply(res);
                }
            });
        }
        else {
            const ins = { $set: { teacher: request.payload.teacher } };
            User.findByIdAndUpdate(id, ins, (err, res) => {
                if(err){
                    reply('{}');
                } else {
                    reply(res);
                }
            });
        }
    }
};
