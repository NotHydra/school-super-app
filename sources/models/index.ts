import mongoose from "mongoose";

import { userSchema } from "./pengguna/user";
import { aktivitasSchema } from "./pengguna/aktivitas";

import { indentitasSchema } from "./sekolah/indentitas";
import { tahunAjaranSchema } from "./sekolah/tahun-ajaran";

import { guruSchema } from "./pengajar/guru";
import { jabatanSchema } from "./pengajar/jabatan";

import { siswaSchema } from "./pelajar/siswa";
import { tahunMasukSchema } from "./pelajar/tahun-masuk";
import { keteranganSchema } from "./pelajar/keterangan";

import { alumniSchema } from "./lulusan/alumni";
import { tahunLulusSchema } from "./lulusan/tahun-lulus";

import { mataPelajaranSchema } from "./penilaian/mata-pelajaran";

import { rombelMataPelajaranSchema, rombelSchema, rombelSemesterSchema } from "./instansi/rombel";
import { tingkatSchema } from "./instansi/tingkat";
import { jurusanSchema } from "./instansi/jurusan";
import { tahunRombelSchema } from "./instansi/tahun-rombel";

import { anggotaSchema } from "./perpustakaan/anggota";
import { petugasSchema } from "./perpustakaan/petugas";
import { bukuSchema } from "./perpustakaan/buku";
import { kategoriSchema } from "./perpustakaan/kategori";
import { penulisSchema } from "./perpustakaan/penulis";
import { penerbitSchema } from "./perpustakaan/penerbit";
import { peminjamanBukuSchema, peminjamanSchema } from "./perpustakaan/peminjaman";
import { pengembalianSchema } from "./perpustakaan/pengembalian";

import { tempatLahirSchema } from "./data-umum/tempat-lahir";
import { jenisKelaminSchema } from "./data-umum/jenis-kelamin";
import { universitasSchema } from "./data-umum/universitas";
import { pendidikanSchema } from "./data-umum/pendidikan";

const penggunaDatabase = mongoose.connection.useDb("pengguna");
export const User = penggunaDatabase.model("user", userSchema, "user");
export const Aktivitas = penggunaDatabase.model("aktivitas", aktivitasSchema, "aktivitas");

const sekolahDatabase = mongoose.connection.useDb("sekolah");
export const Indentitas = sekolahDatabase.model("indentitas", indentitasSchema, "indentitas");
export const TahunAjaran = sekolahDatabase.model("tahun_ajaran", tahunAjaranSchema, "tahun_ajaran");

const pengajarDatabase = mongoose.connection.useDb("pengajar");
export const Guru = pengajarDatabase.model("guru", guruSchema, "guru");
export const Jabatan = pengajarDatabase.model("jabatan", jabatanSchema, "jabatan");

const pelajarDatabase = mongoose.connection.useDb("pelajar");
export const Siswa = pelajarDatabase.model("siswa", siswaSchema, "siswa");
export const TahunMasuk = pelajarDatabase.model("tahun_masuk", tahunMasukSchema, "tahun_masuk");
export const Keterangan = pelajarDatabase.model("keterangan", keteranganSchema, "keterangan");

const lulusanDatabase = mongoose.connection.useDb("lulusan");
export const Alumni = lulusanDatabase.model("alumni", alumniSchema, "alumni");
export const TahunLulus = lulusanDatabase.model("tahun_lulus", tahunLulusSchema, "tahun_lulus");

const penilaianDatabase = mongoose.connection.useDb("penilaian");
export const MataPelajaran = penilaianDatabase.model("mata_pelajaran", mataPelajaranSchema, "mata_pelajaran");

const instansiDatabase = mongoose.connection.useDb("instansi");
export const Rombel = instansiDatabase.model("rombel", rombelSchema, "rombel");
export const RombelSemester = instansiDatabase.model("rombel_semester", rombelSemesterSchema, "rombel_semester");
export const RombelMataPelajaran = instansiDatabase.model("rombel_mata_pelajaran", rombelMataPelajaranSchema, "rombel_mata_pelajaran");
export const Tingkat = instansiDatabase.model("tingkat", tingkatSchema, "tingkat");
export const Jurusan = instansiDatabase.model("jurusan", jurusanSchema, "jurusan");
export const TahunRombel = instansiDatabase.model("tahun_rombel", tahunRombelSchema, "tahun_rombel");

const perpustakaanDatabase = mongoose.connection.useDb("perpustakaan");
export const Anggota = perpustakaanDatabase.model("anggota", anggotaSchema, "anggota");
export const Petugas = perpustakaanDatabase.model("petugas", petugasSchema, "petugas");
export const Buku = perpustakaanDatabase.model("buku", bukuSchema, "buku");
export const Kategori = perpustakaanDatabase.model("kategori", kategoriSchema, "kategori");
export const Penulis = perpustakaanDatabase.model("penulis", penulisSchema, "penulis");
export const Penerbit = perpustakaanDatabase.model("penerbit", penerbitSchema, "penerbit");
export const Peminjaman = perpustakaanDatabase.model("peminjaman", peminjamanSchema, "peminjaman");
export const PeminjamanBuku = perpustakaanDatabase.model("peminjaman_buku", peminjamanBukuSchema, "peminjaman_buku");
export const Pengembalian = perpustakaanDatabase.model("pengembalian", pengembalianSchema, "pengembalian");

const dataUmumDatabase = mongoose.connection.useDb("data-umum");
export const TempatLahir = dataUmumDatabase.model("tempat_lahir", tempatLahirSchema, "tempat_lahir");
export const JenisKelamin = dataUmumDatabase.model("jenis_kelamin", jenisKelaminSchema, "jenis_kelamin");
export const Universitas = dataUmumDatabase.model("universitas", universitasSchema, "universitas");
export const Pendidikan = dataUmumDatabase.model("pendidikan", pendidikanSchema, "pendidikan");
