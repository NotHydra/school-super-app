import mongoose from "mongoose";

export const mataPelajaranSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    mata_pelajaran: {
        type: String,
        required: true,
    },
    bobot_pengetahuan: {
        type: Number,
        required: true,
    },
    bobot_keterampilan: {
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
