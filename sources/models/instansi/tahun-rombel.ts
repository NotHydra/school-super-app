import mongoose from "mongoose";

export const tahunRombelSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    tahun_rombel: {
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
