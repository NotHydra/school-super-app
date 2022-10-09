import mongoose from "mongoose";

export const alumniSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    id_siswa: {
        type: Number,
        required: true,
        unique: true,
        ref: "siswa",
    },
    id_tahun_lulus: {
        type: Number,
        required: true,
        ref: "tahun_lulus",
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
    pekerjaan: {
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
