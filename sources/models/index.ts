import mongoose from "mongoose";
import { siswaSchema } from "./buku-induk/siswa";
import { tempatLahirSchema } from "./buku-induk/tempat_lahir";
import { jenisKelaminSchema } from "./buku-induk/jenis_kelamin";
import { tahunMasukSchema } from "./buku-induk/tahun_masuk";
import { tingkatSchema } from "./buku-induk/tingkat";
import { jurusanSchema } from "./buku-induk/jurusan";
import { rombelSchema } from "./buku-induk/rombel";

export const Siswa = mongoose.model("siswa", siswaSchema, "siswa");
export const TempatLahir = mongoose.model("tempat_lahir", tempatLahirSchema, "tempat_lahir");
export const JenisKelamin = mongoose.model("jenis_kelamin", jenisKelaminSchema, "jenis_kelamin");
export const TahunMasuk = mongoose.model("tahun_masuk", tahunMasukSchema, "tahun_masuk");
export const Tingkat = mongoose.model("tingkat", tingkatSchema, "tingkat");
export const Jurusan = mongoose.model("jurusan", jurusanSchema, "jurusan");
export const Rombel = mongoose.model("rombel", rombelSchema, "rombel");
