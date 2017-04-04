const Boom = require('boom');
const Joi = require('joi');
const Async = require('async');
const Jwt = require('jsonwebtoken');
const config = require('../../../config.js');


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
                comment: Joi.string().required()
               
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
                Teacher.findById(results.user.teacher, (err, res) => {
                    if(!res){
                        const update = {
                            $push: { comments: {
                                comment: request.payload.comment,
                                user: results.user.name,
                                title: 'Orang Tua',
                                timeCreated: new Date()
                            } }
                        };
                        callback(null, update);
                    } else {
                        const update = {
                            $push: { comments: {
                                comment: request.payload.comment,
                                user: res.nama,
                                title: res.jabatan,
                                timeCreated: new Date()
                            } }
                        };
                        callback(null, update);
                    }
                });
            }]
        }, (err, results) => {
            News.findByIdAndUpdate(request.params.id, results.comment, (er, res) => {
                reply(res);
            });
            // reply(results.comment);
        });
    }
};
