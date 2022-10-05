import { Router } from "express";
import { Siswa } from "../../models";

import { bukuIndukSiswaRouter } from "./siswa";
import { bukuIndukTempatLahirRouter } from "./tempat-lahir";
import { bukuIndukJenisKelaminRouter } from "./jenis-kelamin";

export const bukuIndukRouter = Router();
export const headTitle = "Buku Induk";
const navActive = [1, 0];

bukuIndukRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                title: "Siswa",
                icon: "user",
                value: await Siswa.countDocuments(),
            },
        ],
    });
});

bukuIndukRouter.use("/siswa", bukuIndukSiswaRouter);
bukuIndukRouter.use("/tempat-lahir", bukuIndukTempatLahirRouter);
bukuIndukRouter.use("/jenis-kelamin", bukuIndukJenisKelaminRouter);
