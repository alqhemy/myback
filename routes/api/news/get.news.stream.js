const Async = require('async');
const Boom = require('boom');
const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/news/{id}',
    method: 'GET',
    config: {
        description: 'Get all data about sekolah',
        validate: {
            params: {
                id: Joi.string()
            }
        }
    },
    handler(request, reply) {
        const News = request.server.plugins['hapi-mongo-models'].NoteEntry;
        const School = request.server.plugins['hapi-mongo-models'].School;

        const school = new Promise((resolve, reject) => {
            const id = request.params.id;
            School.findById(id, (err, res) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

        school.then((result) => {
            const name = result.nama;
            News.find({ sekolah: name }, (err, news) => {
                if(err) {
                    reply(err);
                } else {
                    reply(news);
                }
            });
        });
    }
};

