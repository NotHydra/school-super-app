import { Router } from "express";

import { perpustakaanAnggotaRouter } from "./anggota";
import { perpustakaanPetugasRouter } from "./petugas";
import { perpustakaanBukuRouter } from "./buku";
import { perpustakaanKategoriRouter } from "./kategori";
import { perpustakaanPenulisRouter } from "./penulis";
import { perpustakaanPenerbitRouter } from "./penerbit";
import { perpustakaanPeminjamanRouter } from "./peminjaman";
import { perpustakaanPengembalianRouter } from "./pengembalian";

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
perpustakaanRouter.use("/buku", perpustakaanBukuRouter);
perpustakaanRouter.use("/kategori", perpustakaanKategoriRouter);
perpustakaanRouter.use("/penulis", perpustakaanPenulisRouter);
perpustakaanRouter.use("/penerbit", perpustakaanPenerbitRouter);
perpustakaanRouter.use("/peminjaman", perpustakaanPeminjamanRouter);
perpustakaanRouter.use("/pengembalian", perpustakaanPengembalianRouter);
