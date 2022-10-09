import mongoose from "mongoose";

export const guruSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    nip: {
        type: String,
        required: true,
        unique: true,
    },
    nama_lengkap: {
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
    id_jabatan: {
        type: Number,
        required: true,
        ref: "jabatan",
    },
    id_universitas: {
        type: Number,
        required: true,
        ref: "universitas",
    },
    id_pendidikan: {
        type: Number,
        required: true,
        ref: "pendidikan",
    },
    nomor_telepon: {
        type: String,
        required: true,
        unique: true,
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
