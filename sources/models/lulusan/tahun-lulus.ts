import mongoose from "mongoose";

export const tahunLulusSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    tahun_lulus: {
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
