import mongoose from "mongoose";

export const rombelMataPelajaranSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    id_mata_pelajaran: {
        type: Number,
        required: true,
        ref: "mata_pelajaran",
    },
    id_guru: {
        type: Number,
        required: true,
        ref: "guru",
    },
});

export const rombelSemesterSchema = new mongoose.Schema({
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
        ref: "rombel_mata_pelajaran",
    },
});

export const rombelSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    rombel: {
        type: String,
        required: true,
    },
    id_wali_kelas: {
        type: String,
        required: true,
        ref: "guru",
    },
    id_tingkat: {
        type: String,
        required: true,
        ref: "tingkat",
    },
    id_jurusan: {
        type: String,
        required: true,
        ref: "jurusan",
    },
    id_tahun_rombel: {
        type: String,
        required: true,
        ref: "tahun_rombel",
    },
    semester: {
        type: Array,
        ref: "rombel_semester",
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
