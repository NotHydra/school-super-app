import { Router } from "express";

import { instansiJurusanRouter } from "./jurusan";
import { instansiTahunRombelRouter } from "./tahun-rombel";

export const instansiRouter = Router();
export const headTitle = "Instansi";
const navActive = [5, 0];

instansiRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
    });
});

instansiRouter.use("/jurusan", instansiJurusanRouter);
instansiRouter.use("/tahun-rombel", instansiTahunRombelRouter);
