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
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }]
}, { timestamps: true });

categorySchema.plugin(uniqueValidator);
categorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Category', categorySchema);