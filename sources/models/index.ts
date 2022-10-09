import mongoose from "mongoose";

import { tempatLahirSchema } from "./data-umum/tempat-lahir";

const dataUmumDatabase = mongoose.connection.useDb("data-umum");
export const DataUmumTempatLahir = dataUmumDatabase.model("tempat_lahir", tempatLahirSchema, "tempat_lahir");
