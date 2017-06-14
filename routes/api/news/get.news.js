const Boom = require('boom');
const JWT = require('jsonwebtoken');
const config = require('../../../config.js');
const Async = require('async');

module.exports = {
    path: '/web/api/news',
    method: 'GET',
    config: {
        description: 'Post new stream topic',
        auth: 'jwt'
    },
    handler(request, reply) {
        const News = request.server.plugins['hapi-mongo-models'].NoteEntry;
        const User = request.server.plugins['hapi-mongo-models'].User;
        const decode = JWT.verify(request.auth.token, config.authKey);
        const id = decode.id;

        Async.auto({
            user(callback) {
                User.findById(id, (err, results) => {
                    callback(null, results);
                });
            },
            sekolah: ['user', function (results, callback) {
                const test = results.user.child;
                const sekolah = [];
                if(test){
                    test.forEach((element) => {
                        sekolah.push(element.sekolah);
                    }, this);
                }
                if(results.user.teacher) {
                    if(results.user.teacher.id !== '0'){
                        const guru = results.user.teacher;
                        sekolah.push(guru.sekolah);
                    }
                }
                callback(null, sekolah);
            }]

        }, (err, results) => {
            const find = {
                sekolah: { $in: results.sekolah },
                publish: true,
                timeCreated: {
                    $gte: (new Date((new Date()).getTime() - (90 * 24 * 60 * 60 * 1000)))
                }
            };
            if(results.sekolah.length > 0) {
                News.find(find, (er, res) => {
                    if(err) {
                        reply({});
                    } else {
                        reply({ news: res });
                    }
                });
            } else {
                reply({ news: [] });
            }
        });
    }
};
