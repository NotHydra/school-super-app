import { Router } from "express";

import { pelajarSiswaRouter } from "./siswa";
import { pelajarTahunMasukRouter } from "./tahun-masuk";

export const pelajarRouter = Router();
export const headTitle = "Pelajar";
const navActive = [2, 0];

pelajarRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
    });
});

pelajarRouter.use("/siswa", pelajarSiswaRouter);
pelajarRouter.use("/tahun-masuk", pelajarTahunMasukRouter);