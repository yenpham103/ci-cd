const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShopSchema = new Schema(
    {
        domain: { type: String, required: true, unique: true, index: true },
        access_token: { type: String, require: true },
        status: { type: Boolean, require: true, default: true },
        shopify_plan: { type: String },
        country: { type: String },
        email: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model('Shop', ShopSchema);
