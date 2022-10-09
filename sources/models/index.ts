import mongoose from "mongoose";

import { tempatLahirSchema } from "./data-umum/tempat-lahir";
import { jenisKelaminSchema } from "./data-umum/jenis-kelamin";

const dataUmumDatabase = mongoose.connection.useDb("data-umum");
export const DataUmumTempatLahir = dataUmumDatabase.model("tempat_lahir", tempatLahirSchema, "tempat_lahir");
export const DataUmumJenisKelamin = dataUmumDatabase.model("jenis_kelamin", jenisKelaminSchema, "jenis_kelamin");
