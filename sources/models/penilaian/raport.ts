import mongoose from "mongoose";

const raportMataPelajaranSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    id_mata_pelajaran: {
        type: Number,
        required: true,
        ref: "mata_pelajaran",
    },
    pengetahuan: {
        type: Number,
        required: true,
    },
    keterampilan: {
        type: Number,
        required: true,
    },
});

const raportSemesterSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    mata_pelajaran: {
        type: Array,
        required: true,
        ref: "raportMataPelajaranSchema",
    },
});

export const raportSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    id_siswa: {
        type: Number,
        required: true,
        ref: "siswa",
    },
    semester: {
        type: Array,
        required: true,
        ref: "raportSemesterSchema",
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
