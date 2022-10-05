import mongoose from "mongoose";

export const tempatLahirSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    tempat_lahir: {
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
