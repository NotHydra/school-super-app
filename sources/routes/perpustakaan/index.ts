import { Router } from "express";

import { perpustakaanAnggotaRouter } from "./anggota";

export const perpustakaanRouter = Router();
export const headTitle = "Perpustakaan";
const navActive = [6, 0];

perpustakaanRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
    });
});

perpustakaanRouter.use("/anggota", perpustakaanAnggotaRouter);
