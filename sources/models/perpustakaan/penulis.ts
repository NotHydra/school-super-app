import mongoose from "mongoose";

export const penulisSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    penulis: {
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
