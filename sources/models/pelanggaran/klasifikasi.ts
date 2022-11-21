import mongoose from "mongoose";

export const klasifikasiSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    id_tipe: {
        type: Number,
        required: true,
        ref: "tipe",
    },
    klasifikasi: {
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
