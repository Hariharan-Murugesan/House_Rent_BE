const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema(
    {
        tenantId: {
            type: String,
        },
        houseId: {
            type: String,
        },
        favoriteType: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Favorite = mongoose.model('Favorite', favoriteSchema, 'Favorite');
module.exports = Favorite;
