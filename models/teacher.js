const Joi = require('joi');
const MongoModels = require('mongo-models');

class Teacher extends MongoModels {
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

Teacher.collection = 'teachers';
Teacher.schema = Joi.object().keys({
    _id: Joi.string().required(),
    nama: Joi.string().required(),
    kota: Joi.string().required(),
    lahir: Joi.date(),
    jabatan: Joi.string(),
    telp: Joi.string(),
    id_sekolah: Joi.string(),
    timeCreated: Joi.date().required()

});

module.exports = Teacher;
