import mongoose from "mongoose";

export const anggotaSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    nomor_anggota: {
        type: String,
        required: true,
    },
    id_siswa: {
        type: Number,
        required: true,
        unique: true,
        ref: "siswa",
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
