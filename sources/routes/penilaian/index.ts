import { Router } from "express";

import { instansiMataPelajaranRouter } from "./mata-pelajaran";

export const penilaianRouter = Router();
export const headTitle = "Penilaian";
const navActive = [4, 0];

penilaianRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
    });
});

penilaianRouter.use("/mata-pelajaran", instansiMataPelajaranRouter);
