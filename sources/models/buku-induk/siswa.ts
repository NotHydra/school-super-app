import mongoose from "mongoose";

export const siswaSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    nisn: {
        type: Number,
        unique: true,
        required: true,
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
    id_tahun_masuk: {
        type: Number,
        required: true,
        ref: "tahun_masuk",
    },
    id_tingkat: {
        type: Number,
        required: true,
        ref: "tingkat",
    },
    id_jurusan: {
        type: Number,
        required: true,
        ref: "jurusan",
    },
    id_rombel: {
        type: Number,
        required: true,
        ref: "rombel",
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
