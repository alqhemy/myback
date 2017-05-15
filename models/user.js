// const Async = require('async');
const Joi = require('joi');
const MongoModels = require('mongo-models');


class Account extends MongoModels {}

Account.collection = 'accounts';

Account.schema = Joi.object().keys({
    _id: Joi.object(),
    isActive: Joi.boolean().default(true),
    email: Joi.string().email().lowercase().required(),
    name: Joi.string(),
    uid: Joi.string().token(),
    avatar: Joi.object(),
    child: Joi.array().items(Joi.object().keys({
        sekolah: Joi.string(),
        nis: Joi.string()
    })),
    teacher: Joi.object().keys({
        id: Joi.string(),
        sekolah: Joi.string()
    }),
    timeCreated: Joi.date().timestamp()
});


Account.indexes = [
    { key: { email: 1, unique: true } }
];


module.exports = Account;
