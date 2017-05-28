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
                publish: Joi.bool().default(false),
                aktifitas: Joi.array().items(Joi.object().keys({
                    nis: Joi.string().required(),
                    kelas: Joi.string().required(),
                    school: Joi.string().required(),
                    name: Joi.string().required(),
                    kegiatan: Joi.string().required(),
                    aktifitas: Joi.array().items(Joi.object().keys({
                        title: Joi.string(),
                        description: Joi.string()
                    }))
                }))
            }
        }
    },
    handler(request, reply) {
        const News = request.server.plugins['hapi-mongo-models'].NoteEntry;
        const User = request.server.plugins['hapi-mongo-models'].User;
        const Teacher = request.server.plugins['hapi-mongo-models'].Teacher;
        const Activity = request.server.plugins['hapi-mongo-models'].Activity;
        const decode = JWT.verify(request.auth.token, config.authKey);
        const id = decode.id;

        Async.auto({
            user(callback) {
                User.findById(id, (err, results) => {
                    callback(null, results);
                });
            },
            teacher: ['user', function (results, callback) {
                Teacher.findById(results.user.teacher.id, (err, res) => {
                    callback(null, res);
                });
            }],
            news: ['teacher', function (results, callback) {
                const document = {
                    sekolah: results.teacher.sekolah,
                    title: request.payload.title,
                    topic: request.payload.topic,
                    description: request.payload.description,
                    category: request.payload.category,
                    publish: request.payload.publish,
                    userId: results.user.email,
                    userName: results.teacher.nama,
                    userTitle: results.teacher.jabatan,
                    timeCreated: new Date()
                };
                News.insertOne(document, (er, news) => {
                    callback(null, news);
                });
            }],
            aktifitas: ['news', function (results, callback) {
                let data = request.payload.aktifitas;
                if(data.length > 0 ) {
                    const insert = [];
                    data.forEach(function(e) {
                        let value = {
                            newsId: results.news[0]._id.toString(),
                            nis: e.nis,
                            kelas: e.kelas,
                            school: e.school,
                            kegiatan: e.kegiatan,
                            timeCreated: new Date(),
                            read: false,
                            aktifitas: e.aktifitas
                        };
                        insert.push(value);
                    }, this);
                    Activity.insertMany(insert, callback, (err, res) => {
                        callback(null, res);
                    });

                } else {
                    callback(null, []);
                }
            }]
        }, (err, results) => {
            reply(results);
        });
    }
};
