const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
        unique: true,
        uniqueCaseInsensitive: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        /*
        El hecho de que sea un array [], indica que soporta varios user id, es decir la logica seria
        que una categoria tiene o podria tener varios usuarios creadores, aunque este no es el modelo de negocio
        en nuestro caso lo dejo asi de ejemplo.
        */
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

categorySchema.plugin(uniqueValidator);
categorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Category', categorySchema);