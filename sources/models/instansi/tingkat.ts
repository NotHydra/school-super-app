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
    dibuat: {
        type: Date,
        required: true,
    },
    diubah: {
        type: Date,
        required: true,
    },
});
