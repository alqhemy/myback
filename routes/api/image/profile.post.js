const Boom = require('boom');
const fs = require('fs');
const uuid = require('uuid');
const config = require('../../../config.js');
const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/profile',
    method: 'POST',
    config: {
        description: 'Get all topic to stream',
        payload: {
            output: 'stream',
            allow: 'multipart/form-data'
        }
    },
    handler(request, reply) {
        const data = request.payload;
        const file = data.avatar;
        const location = 'uploads/avatar';
        if(!file) {
            reply(Boom.badData('no file'));
        } else {
            const original = file.hapi.filename;
            const filename = uuid.v1();
            const path = `${location}/${filename}`;
            const fileStream = fs.createWriteStream(path);
            
            const done = new Promise((resolve, reject) => {
                file.on('error', (err) => {
                    reject(err);
                });

                file.pipe(fileStream);

                file.on('end', (err) => {
                    const fileDetails = {
                        fieldname: file.hapi.name,
                        originalname: original,
                        filename,
                        mimetype: file.hapi.headers['content-type'],
                        destination: location
                    };
                    reply(fileDetails);
                });
            });

            // reply(fileDetails);
        }
        // const ActivityTopic = request.server.plugins['hapi-mongo-models'].ActivityTopic;
        // ActivityTopic.find({}, (err, res) => {
        //     if(err) {
        //         return reply(Boom.badRequest('Not found'));
        //     }
        //     reply(res);
        // });
    }
};

