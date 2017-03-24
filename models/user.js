const Async = require('async');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const MongoModels = require('mongo-models');


class User extends MongoModels {
    static generatePasswordHash(password, callback) {
        Async.auto({
            salt: function (done) {
                Bcrypt.genSalt(10, done);
            },
            hash: ['salt', function (results, done) {
                Bcrypt.hash(password, results.salt, done);
            }]
        }, (err, results) => {
            if(err) {
                return callback(err);
            }

            callback(null, {
                password,
                hash: results.hash
            });
        });
    }

    static create(email, password, callback) {
        const self = this;

        Async.auto({
            passwordHash: this.generatePasswordHash.bind(this, password),
            newUser: ['passwordHash', function (results, done) {

                const document = {
                    isActive: true,
                    password: results.passwordHash.hash,
                    email: email.toLowerCase(),
                    timeCreated: new Date()
                };

                self.insertOne(document, done);
            }]
        }, (err, results) => {
            if(err) {
                return callback(err);
            }
            results.newUser[0].password = results.passwordHash.password;

            return callback(null, results.newUser[0]);
        });
        
    }

    static findByCredentials(username, password, callback) {

        const self = this;

        Async.auto({
            user: function (done) {
                const query = {
                    isActive: true
                };
                if(username.indexOf('@') > -1) {
                    query.email = username.toLowerCase();
                } else {
                    query.username = username.toLowerCase();
                }

                self.findOne(query, done);
            },
            passwordMatch: ['user', function (results, done) {

                if(!results.user) {
                    return done(null, false);
                }

                const source = results.user.password;
                Bcrypt.compare(password, source, done);
            }]
        }, (err, results) => {
            if(err) {
                return callback(err);
            }

            if(results.passwordMatch) {
                return callback(null, results.user);
            }

            callback();
        });
    }

    static findByUsername(username, callback) {

        const query = { username: username.toLowerCase() };

        this.findOne(query, callback);
    }

}


User.collection = 'users';


User.schema = Joi.object().keys({
    _id: Joi.object(),
    isActive: Joi.boolean().default(true),
    password: Joi.string(),
    email: Joi.string().email().lowercase().required(),
    name: Joi.string(),
    uid: Joi.string().token(),
    avatar: Joi.object(),
    child: Joi.array().items(Joi.object().keys({
        sekolah: Joi.string(),
        anak: Joi.string(),
        nis: Joi.string()
    })),
    school: Joi.array().items(Joi.object().keys({
        sekolah: Joi.string(),
        nama: Joi.string(),
        id: Joi.string()
    })),
    timeCreated: Joi.date().timestamp()

});


User.indexes = [
    { key: { username: 1, unique: true } },
    { key: { email: 1, unique: true } }
];


module.exports = User;
