import mongoose from "mongoose";

export const jurusanSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    jurusan: {
        type: String,
        required: true,
    },
});
