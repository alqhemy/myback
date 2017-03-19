const Joi = require('joi');
const MongoModels = require('mongo-models');

class ActivityTopic extends MongoModels {
    static create(kategori, callback) {
        const self = this;
        const document = {
            name: kategori.string()

        };
        self.insertOne(document, (err, results) => {
            if(err) {
                return callback(err)
            }
            return callback(null, results.newUser[0]);
        });
    }
}

ActivityTopic.collection = 'activityTopics';
ActivityTopic.schema = Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string().required()
});

module.exports = ActivityTopic;
