import mongoose from "mongoose";

export const tipeSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    tipe: {
        type: String,
        required: true,
    },
    skor: {
        type: Number,
        required: true,
    },
    sanksi: {
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
