import mongoose from "mongoose";

export const pengembalianSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    id_peminjaman: {
        type: Number,
        required: true,
        unique: true,
        ref: "peminjaman",
    },
    tanggal_pengembalian: {
        type: Date,
        required: true
    },
    denda: {
        type: Number,
        required: true
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
