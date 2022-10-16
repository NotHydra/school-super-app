import { Router } from "express";

import { perpustakaanAnggotaRouter } from "./anggota";
import { perpustakaanPetugasRouter } from "./petugas";
import { perpustakaanKategoriRouter } from "./kategori";
import { perpustakaanPenulisRouter } from "./penulis";
import { perpustakaanPenerbitRouter } from "./penerbit";

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
perpustakaanRouter.use("/petugas", perpustakaanPetugasRouter);
perpustakaanRouter.use("/kategori", perpustakaanKategoriRouter);
perpustakaanRouter.use("/penulis", perpustakaanPenulisRouter);
perpustakaanRouter.use("/penerbit", perpustakaanPenerbitRouter);
