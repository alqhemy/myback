'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');


class Student extends MongoModels {
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

Student.collection = 'students';

Student.schema = Joi.object().keys({
    _id: Joi.string().required(),
    nama: Joi.string().required(),
    nis: Joi.string().required(),
    kelas: Joi.string().required(),
    kelamin: Joi.string().required(),
    tempat: Joi.string(),
    tanggal: Joi.date(),
    alamat: Joi.string(),
    ayah: Joi.string(),
    ibu: Joi.string(),
    telp1: Joi.string(),
    telp2: Joi.string(),
    telp3: Joi.string(),
    id_sekolah: Joi.string(),
    timeCreated: Joi.date().required()
});


module.exports = Student;
