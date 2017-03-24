const Boom = require('boom');
const fs = require('fs');
const uuid = require('uuid');

module.exports = {
    path: '/web/api/photo/{id}',
    method: 'PUT',
    config: {
        description: 'Get all topic to stream',
        payload: {
            output: 'stream',
            allow: 'multipart/form-data'
        }
    },
    handler(request, reply) {
        const note = request.server.plugins['hapi-mongo-models'].NoteEntry;
        const data = request.payload;
        const file = data.photo;
        const location = 'uploads/photos';
        if(!file) {
            reply(Boom.badData('no file'));
        } else {
            const idPost = request.params.id.toString();
            const filename = uuid.v1();
            const path = `${location}/${filename}`;
            const fileStream = fs.createWriteStream(path);

            const done = new Promise((resolve, reject) => {
                file.on('error', (err) => {
                    reject(err);
                });

                file.pipe(fileStream);

                file.on('end', () => {
                    const fileDetails = {
                        filename,
                        location
                    };
                    resolve(fileDetails);
                });
            });
            done.then((result) => {
                const update = {
                    $push: { photo: { filename: result.filename, location: result.location } }
                };
                note.findByIdAndUpdate(idPost, update, (err, res) => {
                    if(err) {
                        reply(err);
                    } else {
                        reply(res);
                    }
                });
            });
        }

    }
};

