import mongoose from "mongoose";

export const bukuSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    kode: {
        type: String,
        required: true,
    },
    judul: {
        type: String,
        required: true,
    },
    id_kategori: {
        type: Number,
        required: true,
        ref: "kategori",
    },
    id_penulis: {
        type: Number,
        required: true,
        ref: "penulis",
    },
    id_penerbit: {
        type: Number,
        required: true,
        ref: "penerbit",
    },
    tahun_terbit: {
        type: Number,
        required: true,
    },
    halaman: {
        type: Number,
        required: true,
    },
    stok: {
        type: Number,
        required: true,
    },
    sinopsis: {
        type: Text,
        required: true,
    },
});
