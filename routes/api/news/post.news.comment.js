const Boom = require('boom');
const Joi = require('joi');
const Async = require('async');
const Jwt = require('jsonwebtoken');
const config = require('../../../config.js');
const uuid = require('uuid/v1');


module.exports = {
    path: '/web/api/news/{id}/comment',
    method: 'PUT',
    config: {
        description: 'Post comment to news topic',
        auth: 'jwt',
        validate: {
            params: {
                id: Joi.string()
            },
            payload: {
                comment: Joi.string().required(),
                id: Joi.string().default('0')
            }
        }
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].User;
        const Teacher = request.server.plugins['hapi-mongo-models'].Teacher;
        const News = request.server.plugins['hapi-mongo-models'].NoteEntry;
        const decode = Jwt.verify(request.auth.token, config.authKey);

        Async.auto({
            user(callback){
                User.findById(decode.id, (err, results) => {
                    callback(null, results);
                });
            },
            comment: ['user', (results, callback) => {
                Teacher.findById(results.user.teacher.id, (err, res) => {
                    if(!res) {
                        const update = {
                            $push: { comments: {
                                id: uuid(),
                                comment: request.payload.comment,
                                user: results.user.name,
                                uid: results.user.email,
                                title: 'Orang Tua',
                                timeCreated: new Date()
                            } }
                        };
                        callback(null, update);
                    } else {
                        const update = {
                            $push: { comments: {
                                id: uuid(),
                                comment: request.payload.comment,
                                user: results.user.name,
                                uid: results.user.email,
                                title: res.jabatan,
                                timeCreated: new Date()
                            } }
                        };
                        callback(null, update);
                    }
                });
            }]
        }, (err, results) => {

            if(request.payload.id === '0') {
                News.findByIdAndUpdate(request.params.id, results.comment, (er, res) => {
                    reply(res);
                });
            } else {
                News.findById(request.params.id, (e, ress) => {
                    // reply(ress);
                    if(ress.comments != null) {
                        const comments = ress.comments;
                        comments.forEach((element) => {
                            if(element.id === request.payload.id) {
                                News.findByIdAndUpdate(request.params.id, { $pull: { comments: element } }, (er, respull) => {
                                    reply(respull);
                                });
                            }
                        }, this);
                    }
                });
            }
        });
    }
};
