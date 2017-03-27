const Boom = require('boom');
const Joi = require('joi');

module.exports = {
    path: '/web/api/sekolah/{id}/siswa/{room}',
    method: 'GET',
    config: {
        description: 'Get all data by school and class',
        validate: {
            params: {
                id: Joi.string(),
                room: Joi.string()
            }
        }
    },
    handler(request, reply) {
        const Student = request.server.plugins['hapi-mongo-models'].Student;
        const id = request.params.id.toString();
        const room = request.params.room.toString();
        Student.find({ id_sekolah: id, kelas: room }, {}, (err, res) => {
            if(err) {
                return reply(Boom.badRequest('Not found'));
            }
            reply(res);
        });
    }
};

