import mongoose from "mongoose";

export const pelanggarSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    id_siswa: {
        type: Number,
        required: true,
        ref: "siswa",
    },
    id_klasifikasi: {
        type: Number,
        required: true,
        ref: "klasifikasi",
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
