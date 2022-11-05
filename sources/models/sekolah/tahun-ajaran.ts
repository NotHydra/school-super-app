import mongoose from "mongoose";

export const tahunAjaranSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    tahun_ajaran: {
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
