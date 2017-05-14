const Boom = require('boom');
const Joi = require('joi');
const Async = require('async');

module.exports = {
    path: '/web/api/news/{id}/activity',
    method: 'POST',
    config: {
        description: 'Post new stream topic',
        auth: 'jwt',
        validate: {
            params: {
                id: Joi.string()
            },
            payload: {
                nis: Joi.string().required(),
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
        const decode = JWT.verify(request.auth.token, config.authKey);
        const id = decode.id;

        Async.auto({
            activity(callback) {
                const update = {
                    nis: request.payload.nis,
                    name: request.payload.name,
                    news: request.params.id,
                    activity: request.payload.activity,
                    read: false,
                    timeCreated: new Date()
                };
                Activity.insertOne(update, (err, res) => {
                    callback(null, res);
                });
            }
        }, (err, result) => {

            const activity = result.activity[0];
            const id = activity._id.toString();
            reply(result);
            const update = {
                $push: { activity: {
                    nis: activity.nis,
                    name: activity.name }
                }
            };

            News.findByIdAndUpdate(activity.news, update, (er, res) => {
                if(er) {
                    reply(Boom.badData(er));
                } else {
                    reply(res);
                }
            });
        });
    }
};
