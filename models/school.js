const Joi = require('joi');
const MongoModels = require('mongo-models');

class School extends MongoModels {
    static create(document, callback) {
        const self = this;
        self.insertOne(document, (err, results) => {
            if(err) {
                return callback(err);
            }
            return callback(null, results.newUser[0]);
        });
    }
}

School.collection = 'schools';
School.schema = Joi.object().keys({
    _id: Joi.string().required(),
    kategori: Joi.string().required(),
    nama: Joi.string().required(),
    alamat: Joi.string().required(),
    telp1: Joi.string(),
    telp2: Joi.string(),
    timeCreated: Joi.date().required()

});

module.exports = School;
