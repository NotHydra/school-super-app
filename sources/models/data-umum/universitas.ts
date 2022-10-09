import mongoose from "mongoose";

export const universitasSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    universitas: {
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
