const Boom = require('boom');
const Joi = require('joi');
const JWT = require('jsonwebtoken');
const config = require('../../../config.js');
const Async = require('async');

module.exports = {
    path: '/web/api/news',
    method: 'POST',
    config: {
        description: 'Post new stream topic',
        auth: 'jwt',
        validate: {
            payload: {
                title: Joi.string().required(),
                description: Joi.string().required(),
                topic: Joi.string().default('Public'),
                category: Joi.string(),
                publish: Joi.bool().default(false)
            }
        }
    },
    handler(request, reply) {
        const News = request.server.plugins['hapi-mongo-models'].NoteEntry;
        const User = request.server.plugins['hapi-mongo-models'].User;
        const Teacher = request.server.plugins['hapi-mongo-models'].Teacher;
        const decode = JWT.verify(request.auth.token, config.authKey);
        const id = decode.id;

        Async.auto({
            user(callback) {
                User.findById(id,(err, results) => {
                    callback(null, results);
                });
            },
            teacher: ['user', function (results, callback) {
                Teacher.findById(results.user.teacher, (err, res) => {
                    callback(null, res);
                });
            }]

        }, (err, results) => {
            const document = {
                sekolah: results.teacher.sekolah,
                title: request.payload.title,
                topic: request.payload.topic,
                description: request.payload.description,
                category: request.payload.category,
                publish: request.payload.publish,
                user: {
                    id: results.user.email,
                    name: results.teacher.nama,
                    title: results.teacher.jabatan
                },
                timeCreated: new Date()
            };
            News.insertOne(document, (er, news) => {
                if(err) {
                    reply(Boom.badData('Error, data not save'));
                } else {
                    reply(news);
                }
            });
        });
    }
};
