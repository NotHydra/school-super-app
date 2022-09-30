import mongoose, { Document } from "mongoose";

export type siswaDocument = typeof Siswa & Document;

const siswaSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    nisn: {
        type: Number,
        required: true,
    },
    nama_lengkap: {
        type: String,
        required: true,
    },
    id_tempat_lahir: {
        type: Number,
        required: true,
    },
    tanggal_lahir: {
        type: Date,
        required: true,
    },
    id_jenis_kelamin: {
        type: Number,
        required: true,
    },
    id_tahun_masuk: {
        type: Number,
        required: true,
    },
    id_tingkat: {
        type: Number,
        required: true,
    },
    id_jurusan: {
        type: Number,
        required: true,
    },
    id_rombel: {
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

export const Siswa = mongoose.model("siswa", siswaSchema, "siswa");
