import mongoose from "mongoose";

export const tingkatSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    tingkat: {
        type: String,
        required: true,
    },
});
