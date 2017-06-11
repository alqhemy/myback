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
                topic: Joi.string().default('Umum'),
                category: Joi.string().default('Informasi'),
                publish: Joi.bool().default(false),
                aktifitas: Joi.array().items(Joi.object().keys({
                    nis: Joi.string().required(),
                    kelas: Joi.string().required(),
                    school: Joi.string().required(),
                    name: Joi.string().required(),
                    kegiatan: Joi.string(),
                    aktifitas: Joi.array().items(Joi.object().keys())
                }))
            }
        }
    },
    handler(request, reply) {
        const News = request.server.plugins['hapi-mongo-models'].NoteEntry;
        const User = request.server.plugins['hapi-mongo-models'].User;
        const Teacher = request.server.plugins['hapi-mongo-models'].Teacher;
        const Activity = request.server.plugins['hapi-mongo-models'].Activity;
        const Student = request.server.plugins['hapi-mongo-models'].Student;
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
                    publish: true,
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
                const data = request.payload.aktifitas;

                if(data.length > 0) {
                    const insert = [];
                    data.forEach((e) => {
                        const value = {
                            newsId: results.news[0]._id.toString(),
                            nis: e.nis,
                            name: e.name,
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
            }],
            parent:['aktifitas', function (results, callback) {
                const topik = results.news[0].topic;
                const sch = results.news[0].sekolah;

                if(topik === 'Umum') {
                    User.find({ 'child.sekolah': sch }, { _id: 0, uid: 1 }, (err, ress) => {
                        callback(null, ress);
                    });
                }
                else {
                    Student.find({ sekolah: sch, kelas: topik }, { _id: 0, nis: 1 }, (er, res) => {
                        const data = [];
                        res.forEach((e) => {
                            data.push(e.nis);
                        }, this);
                        User.find({ child: { $elemMatch: { sekolah: sch, nis: { $in: data } } } }, (err, sekelas) => {
                            callback(null, sekelas);
                        });
                    });
                }
            }]
        }, (err, results) => {
            reply(results);
        });
    }
};
