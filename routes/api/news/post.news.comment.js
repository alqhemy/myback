const Boom = require('boom');
const Joi = require('joi');
// const Async = require('async');

module.exports = {
    path: '/web/api/news/{id}/comment',
    method: 'POST',
    config: {
        description: 'Post new stream topic',
        validate: {
            params: {
                id: Joi.string()
            },
            payload: {
                nis: Joi.string().required(),
                topic: Joi.string().required(),
                name: Joi.string().required(),
                activity: Joi.array().items(Joi.object().keys({
                    title: Joi.string(),
                    description: Joi.string()
                }))
            }
        }
    },
    handler(request, reply) {
        const Activity = request.server.plugins['hapi-mongo-models'].Activity;
        const News = request.server.plugins['hapi-mongo-models'].NoteEntry;

        const updateNews = new Promise((resolve, reject) => {
            const update = {
                nis: request.payload.nis,
                name: request.payload.name,
                news: request.params.id,
                activity: request.payload.activity,
                read: false,
                timeCreated: new Date()
            };
            Activity.insertOne(update, (err, res) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        }).then((result) => {
            const activity = result[0];
            const id = activity._id.toString();
            const update = {
                $push: { activity: {
                    activity_id: id,
                    nis: activity.nis,
                    name: activity.name }
                }

            };
            News.findByIdAndUpdate(activity.news, update, (err, res) => {
                if(err) {
                    reply(Boom.badData(err));
                } else {
                    reply(res);
                }
            });
        }).catch((err) => {
            reply(Boom.badData(err));
        });
    }
};
