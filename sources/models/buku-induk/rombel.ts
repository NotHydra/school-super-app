import mongoose from "mongoose";

export const rombelSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    rombel: {
        type: String,
        required: true,
    },
});
