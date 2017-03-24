const fs = require('fs');
const path = require('path');

module.exports = {
    path: '/web/api/photo/{id}',
    method: 'GET',
    handler: (request, reply) => {
        const UPLOAD_PATH = 'uploads/photos';
        const type = 'image/jpeg';
        reply(fs.createReadStream(path.join(UPLOAD_PATH, request.params.id)))
            .header('Content-Type', type);
    }
};
