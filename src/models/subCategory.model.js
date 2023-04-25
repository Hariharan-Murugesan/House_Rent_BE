const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        categoryId: {
            type: String,
        },
        description: {
            type: String,
        },
        icon: {
            type: String,
        },
        isMain: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('SubCategory', subCategorySchema, 'SubCategory');
