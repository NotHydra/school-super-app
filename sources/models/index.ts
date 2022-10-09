import mongoose from "mongoose";

import { tempatLahirSchema } from "./data-umum/tempat-lahir";
import { jenisKelaminSchema } from "./data-umum/jenis-kelamin";
import { universitasSchema } from "./data-umum/universitas";
import { pendidikanSchema } from "./data-umum/pendidikan";

const dataUmumDatabase = mongoose.connection.useDb("data-umum");
export const DataUmumTempatLahir = dataUmumDatabase.model("tempat_lahir", tempatLahirSchema, "tempat_lahir");
export const DataUmumJenisKelamin = dataUmumDatabase.model("jenis_kelamin", jenisKelaminSchema, "jenis_kelamin");
export const DataUmumUniversitas = dataUmumDatabase.model("universitas", universitasSchema, "universitas");
export const DataUmumPendidikan = dataUmumDatabase.model("pendidikan", pendidikanSchema, "pendidikan");
