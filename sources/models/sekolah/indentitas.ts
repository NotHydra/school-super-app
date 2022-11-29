import mongoose from "mongoose";

export const indentitasSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    nama_aplikasi: {
        type: String,
        required: true,
    },
    nama_sekolah: {
        type: String,
        required: true,
    },
    nama_kepala_sekolah: {
        type: String,
        required: true,
    },
    alamat: {
        type: String,
        required: true,
    },
    provinsi: {
        type: String,
        required: true,
    },
    kabupaten: {
        type: String,
        required: true,
    },
    kecamatan: {
        type: String,
        required: true,
    },
    kelurahan: {
        type: String,
        required: true,
    },
    aktif: { type: Boolean, required: true },
    dibuat: {
        type: Date,
        required: true,
    },
    diubah: {
        type: Date,
        required: true,
    },
});
