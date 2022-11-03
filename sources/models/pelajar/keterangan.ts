import mongoose from "mongoose";

export const keteranganSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    keterangan: {
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
