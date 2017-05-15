const Joi = require('joi');
const JWT = require('jsonwebtoken');
const config = require('../../../config.js');

module.exports = {
    path: '/web/api/register',
    method: 'POST',
    config: {
        description: 'User registratrion',
        validate: {
            payload: {
                uid: Joi.string().min(3).max(80),
                email: Joi.string().email(),
                name: Joi.string()
            }
        }
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].User;
        const usermail = request.payload.email;
        const register = {
            isActive: true,
            email: request.payload.email,
            uid: request.payload.uid,
            name: request.payload.name,
            timeCreated: new Date()

        };
        User.find({ email: usermail }, (err, res) => {
            if(res.length > 0) {
                const session = {
                    active: true,
                    user: res[0].email,
                    id: res[0]._id
                };
                const auth = JWT.sign(session, config.authKey);
                const login = {
                    email: res[0].email,
                    uid: res[0].uid,
                    name: res[0].name,
                    token: auth
                };
                reply(login);
            } else {
                User.insertOne(register, (er, user) => {
                    if(err) {
                        reply(er);
                    } else {
                        const reg = {
                            active: true,
                            user: user[0].email,
                            id : user[0]._id
                        };
                        const auth = JWT.sign(reg, config.authKey);
                        const registered = {
                            email: user[0].email,
                            uid: request.payload.uid,
                            name: request.payload.name,
                            token: auth
                        };
                        reply(registered);
                        // reply(user);
                    }
                });
            }
        });
        
    }
};

