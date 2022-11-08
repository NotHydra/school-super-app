import mongoose from "mongoose";

export const petugasSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    nama: {
        type: String,
        required: true,
    },
    id_tempat_lahir: {
        type: Number,
        required: true,
        ref: "tempat_lahir",
    },
    tanggal_lahir: {
        type: Date,
        required: true,
    },
    id_jenis_kelamin: {
        type: Number,
        required: true,
        ref: "jenis_kelamin",
    },
    jabatan: {
        type: String,
        required: true,
    },
    nomor_telepon: {
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
