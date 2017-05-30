const Boom = require('boom');
const Joi = require("joi");
const JWT = require('jsonwebtoken');
const config = require('../../../config.js');
const Async = require('async');

module.exports = {
    path: '/web/api/news/{id}',
    method: 'GET',
    config: {
        description: 'Post new stream topic',
        validate: {
            params: {
                id: Joi.string()
            }
        }
    },
    handler(request, reply) {
        const News = request.server.plugins['hapi-mongo-models'].NoteEntry;
        const Activity = request.server.plugins['hapi-mongo-models'].Activity;
        const newsId = request.params.id;

        Async.auto({
            news(callback) {
                News.findById(newsId, (err, results) => {
                    callback(null, results);
                });
            },
            aktifitas: ['news', function (results, callback) {

                Activity.find({ newsId }, (err, results) => {
                    callback(null, results);
                });
            }]

        }, (err, results) => {
            reply(results);
        });
    }
};
