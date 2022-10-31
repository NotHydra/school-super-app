import mongoose from "mongoose";

export const aktivitasSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    id_user: {
        type: Number,
        required: true,
        ref: "user",
    },
    aktivitas: {
        type: String,
        required: true,
    },
    method: {
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
