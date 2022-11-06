import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    nama_lengkap: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    nomor_telepon: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["operator", "admin", "superadmin"],
        required: true,
    },
    aktif: {
        type: Boolean,
        required: true,
    },
    akses: {
        type: Array,
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
