import mongoose from "mongoose";

export const peminjamanBukuSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    id_buku: {
        type: Number,
        required: true,
        ref: "buku",
    },
    kuantitas: {
        type: Number,
        required: true,
    },
});

export const peminjamanSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    id_anggota: {
        type: Number,
        required: true,
        ref: "anggota",
    },
    id_petugas: {
        type: Number,
        required: true,
        ref: "petugas",
    },
    buku: {
        type: Array,
        required: true,
        ref: "peminjaman_buku",
    },
    tanggal_peminjaman: {
        type: Date,
        required: true,
    },
    durasi_peminjaman: {
        type: Date,
        required: true,
    },
    tanggal_pengembalian: {
        type: Date || null,
        required: true,
    },
    denda: {
        type: Number || null,
        required: true,
    },
    keterangan: {
        type: String || null,
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
