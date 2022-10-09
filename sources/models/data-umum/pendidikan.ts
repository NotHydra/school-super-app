import mongoose from "mongoose";

export const pendidikanSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    pendidikan: {
        type: String,
        required: true,
    },
    singkatan: {
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
