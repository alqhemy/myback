const Joi = require('joi');
const MongoModels = require('mongo-models');

class Topic extends MongoModels {
    static create(kategori, callback) {
        const self = this;
        const document = {
            topic: kategori.string()
           
        };
        self.insertOne(document, (err, results) => {
            if(err) {
                return callback(err);
            }
            return callback(null, results.newUser[0]);
        });
    }
}

Topic.collection = 'topics';
Topic.schema = Joi.object().keys({
    _id: Joi.string().required(),
    kategori: Joi.string().required()
});

module.exports = Topic;
