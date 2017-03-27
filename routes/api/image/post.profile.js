const Boom = require('boom');
const fs = require('fs');
const uuid = require('uuid');
const config = require('../../../config.js');
const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/profile/{id}',
    method: 'PUT',
    config: {
        description: 'Get all topic to stream',
        validate: {
            params: {
                id: Joi.string()
            },
            payload: {
                output: 'stream',
                allow: 'multipart/form-data'
            }
        }
    },
    handler(request, reply) {
        const User = request.server.plugins['hapi-mongo-models'].Account;
        const idUser = request.params.id.toString();
        const data = request.payload;
        const file = data.avatar;
        const location = 'uploads/avatar';
        if(!file) {
            reply(Boom.badData('no file'));
        } else {
            const filename = uuid.v1();
            const path = `${location}/${filename}`;
            const fileStream = fs.createWriteStream(path);
            
            const done = new Promise((resolve, reject) => {
                file.on('error', (err) => {
                    reject(err);
                });

                file.pipe(fileStream);

                file.on('end', () => {
                    const fileDetails = {
                        filename,
                        location
                    };
                    resolve(fileDetails);
                });
            });
            done.then((result) => {
                const update = {
                    $set: { avatar: { filename: result.filename, location: result.location } }
                };
                User.findByIdAndUpdate(idUser, update, (err, res) => {
                    if(err) {
                        reply(err);
                    } else {
                        reply(res);
                    }
                });
            });
        }
    }
};

