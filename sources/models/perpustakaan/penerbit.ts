import mongoose from "mongoose";

export const penerbitSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    penerbit: {
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
