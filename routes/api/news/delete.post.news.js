const Joi = require('joi');
const JWT = require('jsonwebtoken');
const config = require('../../../config.js');

module.exports = {
    path: '/web/api/news/{id}',
    method: 'DELETE',
    config: {
        description: 'Post new stream topic',
        auth: 'jwt',
        validate: {
            params: {
                id: Joi.string()
            }
        }
    },
    handler(request, reply) {
        const News = request.server.plugins['hapi-mongo-models'].NoteEntry;
        const Activity = request.server.plugins['hapi-mongo-models'].Activity;
        const decode = JWT.verify(request.auth.token, config.authKey);
        const id = decode.id;
        const newsId = request.params.id;

        Activity.find({ newsId }, (err, results) => {
            results.forEach((element) => {
                const idActivity = element._id.toString();
                Activity.findByIdAndDelete(idActivity, (er, rs) => {});
            }, this);
        });

        News.findByIdAndDelete(newsId, (err ,rslt) => {
            if(err){
                reply({status: 'failed to delete' });
            } else {
                reply(rslt);
            }
        });

    }
};
