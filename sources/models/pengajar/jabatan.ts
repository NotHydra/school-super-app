import mongoose from "mongoose";

export const jabatanSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    jabatan: {
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
