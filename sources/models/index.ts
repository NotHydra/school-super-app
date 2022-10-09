import mongoose from "mongoose";

import { rombelSchema } from "./instansi/rombel";
import { tingkatSchema } from "./instansi/tingkat";

import { tempatLahirSchema } from "./data-umum/tempat-lahir";
import { jenisKelaminSchema } from "./data-umum/jenis-kelamin";
import { universitasSchema } from "./data-umum/universitas";
import { pendidikanSchema } from "./data-umum/pendidikan";

const instansiDatabase = mongoose.connection.useDb("instansi");
export const Rombel = instansiDatabase.model("rombel", rombelSchema, "rombel");
export const Tingkat = instansiDatabase.model("tingkat", tingkatSchema, "tingkat");

const dataUmumDatabase = mongoose.connection.useDb("data-umum");
export const TempatLahir = dataUmumDatabase.model("tempat_lahir", tempatLahirSchema, "tempat_lahir");
export const JenisKelamin = dataUmumDatabase.model("jenis_kelamin", jenisKelaminSchema, "jenis_kelamin");
export const Universitas = dataUmumDatabase.model("universitas", universitasSchema, "universitas");
export const Pendidikan = dataUmumDatabase.model("pendidikan", pendidikanSchema, "pendidikan");
