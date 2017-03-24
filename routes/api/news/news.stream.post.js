const Boom = require('boom');
const Joi = require('joi');
// const User = server.plugins['hapi-mongo-models'].User;
module.exports = {
    path: '/web/api/news/',
    method: 'POST',
    config: {
        description: 'Get all data from Stream by school',
        validate: {
            payload: {
                filter: Joi.object()
            }
        }
    },
    handler(request, reply) {
        const news = request.server.plugins['hapi-mongo-models'].NoteEntry;
        const filter = request.payload.filter;
        news.find(filter, {}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};

