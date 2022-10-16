import mongoose from "mongoose";

export const kategoriSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    kategori: {
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
