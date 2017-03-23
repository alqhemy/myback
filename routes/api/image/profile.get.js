// const Boom = require('boom');
// const Joi = require('joi');
const fs = require('fs');
const path = require('path');
// const Async = require('async');

module.exports = {
    path: '/web/api/profile/{id}',
    method: 'GET',
    // config: {
    //     validate: {
    //         params: {
    //             id: Joi.string()
    //         }
    //     }
    // },
    handler: (request, reply) => {
        const UPLOAD_PATH = 'uploads/';
        const type = 'image/jpeg';
        reply(fs.createReadStream(path.join(UPLOAD_PATH, request.params.id)))
            .header('Content-Type', type);
    }
};
