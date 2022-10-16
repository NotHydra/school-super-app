import { Router } from "express";

import { dataUmumTempatLahirRouter } from "./tempat-lahir";
import { dataUmumJenisKelaminRouter } from "./jenis-kelamin";
import { dataUmumUniversitasRouter } from "./universitas";
import { dataUmumPendidikanRouter } from "./pendidikan";

export const dataUmumRouter = Router();
export const headTitle = "Data Umum";
const navActive = [7, 0];

dataUmumRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
    });
});

dataUmumRouter.use("/tempat-lahir", dataUmumTempatLahirRouter);
dataUmumRouter.use("/jenis-kelamin", dataUmumJenisKelaminRouter);
dataUmumRouter.use("/universitas", dataUmumUniversitasRouter);
dataUmumRouter.use("/pendidikan", dataUmumPendidikanRouter);
