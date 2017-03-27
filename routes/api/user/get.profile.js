const Boom = require('boom');
const Joi = require('joi');
const Async = require('async');
const JWT = require('jsonwebtoken');
const config = require('../../../config.js');

// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/profiles',
    method: 'GET',
    config: {
        description: 'Get all data from siswa',
        auth: 'jwt'
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].User;
        const Student = request.server.plugins['hapi-mongo-models'].Student;
        const decode = JWT.verify(request.auth.token, config.authKey);
        const id = decode.id;

        Async.auto({
            user(callback) {
                User.findById(id, (err, results) => {
                    callback(null, results);
                });
            },
            child: ['user', function (results, callback) {
                const test = results.user.child;
                const sekolah = [];
                const nik = [];
                test.forEach((element) => {
                    sekolah.push(element.sekolah);
                    nik.push(element.nis);
                }, this);
                const find = {
                    sekolah: { $in: sekolah },
                    nis: { $in: nik }
                }

                Student.find(find, (err, res) => {
                    callback(null, res);
                });
            }]

        }, (err, results) => {
            reply(results);
        });
    }
};
