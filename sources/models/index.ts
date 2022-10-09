import mongoose from "mongoose";

import { mataPelajaranSchema } from "./penilaian/mata-pelajaran";

import { rombelSchema } from "./instansi/rombel";
import { tingkatSchema } from "./instansi/tingkat";
import { jurusanSchema } from "./instansi/jurusan";
import { tahunRombelSchema } from "./instansi/tahun_rombel";

import { tempatLahirSchema } from "./data-umum/tempat-lahir";
import { jenisKelaminSchema } from "./data-umum/jenis-kelamin";
import { universitasSchema } from "./data-umum/universitas";
import { pendidikanSchema } from "./data-umum/pendidikan";

const penilaianDatabase = mongoose.connection.useDb("penilaian");
export const MataPelajaran = penilaianDatabase.model("mata_pelajaran", mataPelajaranSchema, "mata_pelajaran");

const instansiDatabase = mongoose.connection.useDb("instansi");
export const Rombel = instansiDatabase.model("rombel", rombelSchema, "rombel");
export const Tingkat = instansiDatabase.model("tingkat", tingkatSchema, "tingkat");
export const Jurusan = instansiDatabase.model("jurusan", jurusanSchema, "jurusan");
export const TahunRombel = instansiDatabase.model("tahun_rombel", tahunRombelSchema, "tahun_rombel");

const dataUmumDatabase = mongoose.connection.useDb("data-umum");
export const TempatLahir = dataUmumDatabase.model("tempat_lahir", tempatLahirSchema, "tempat_lahir");
export const JenisKelamin = dataUmumDatabase.model("jenis_kelamin", jenisKelaminSchema, "jenis_kelamin");
export const Universitas = dataUmumDatabase.model("universitas", universitasSchema, "universitas");
export const Pendidikan = dataUmumDatabase.model("pendidikan", pendidikanSchema, "pendidikan");
