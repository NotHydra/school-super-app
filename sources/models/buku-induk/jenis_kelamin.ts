import mongoose from "mongoose";

export const jenisKelaminSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    jenis_kelamin: {
        type: String,
        required: true,
    },
});
