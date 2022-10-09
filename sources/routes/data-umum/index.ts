import { Router } from "express";

import { dataUmumJenisKelaminRouter } from "./jenis-kelamin";

export const dataUmumRouter = Router();
export const headTitle = "Data Umum";
const navActive = [6, 0];

dataUmumRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
    });
});

dataUmumRouter.use("/jenis-kelamin", dataUmumJenisKelaminRouter);
