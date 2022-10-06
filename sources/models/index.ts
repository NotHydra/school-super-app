import mongoose from "mongoose";
import { siswaSchema } from "./buku-induk/siswa";
import { tempatLahirSchema } from "./buku-induk/tempat-lahir";
import { jenisKelaminSchema } from "./buku-induk/jenis-kelamin";
import { tahunMasukSchema } from "./buku-induk/tahun-masuk";
import { tingkatSchema } from "./buku-induk/tingkat";
import { jurusanSchema } from "./buku-induk/jurusan";
import { rombelSchema } from "./buku-induk/rombel";
import { mataPelajaranSchema } from "./penilaian/mata-pelajaran";

export const Siswa = mongoose.model("siswa", siswaSchema, "siswa");
export const TempatLahir = mongoose.model("tempat_lahir", tempatLahirSchema, "tempat_lahir");
export const JenisKelamin = mongoose.model("jenis_kelamin", jenisKelaminSchema, "jenis_kelamin");
export const TahunMasuk = mongoose.model("tahun_masuk", tahunMasukSchema, "tahun_masuk");
export const Tingkat = mongoose.model("tingkat", tingkatSchema, "tingkat");
export const Jurusan = mongoose.model("jurusan", jurusanSchema, "jurusan");
export const Rombel = mongoose.model("rombel", rombelSchema, "rombel");

export const MataPelajaran = mongoose.model("mata_pelajaran", mataPelajaranSchema, "mata_pelajaran");
