import mongoose from "mongoose";

export const tahunMasukSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    tahun_masuk: {
        type: Number,
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
