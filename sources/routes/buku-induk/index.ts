import { Router } from "express";
import { JenisKelamin, Jurusan, Rombel, Siswa, TahunMasuk, TempatLahir, Tingkat } from "../../models";

import { bukuIndukSiswaRouter } from "./siswa";
import { bukuIndukTempatLahirRouter } from "./tempat-lahir";
import { bukuIndukJenisKelaminRouter } from "./jenis-kelamin";
import { bukuIndukTahunMasukRouter } from "./tahun-masuk";

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
                cardItemChild: [
                    {
                        id: 1,
                        title: "Siswa",
                        icon: "user",
                        value: await Siswa.countDocuments(),
                    },
                    {
                        id: 2,
                        title: "Laki-Laki & Perempuan",
                        icon: "restroom",
                        value: `${await Siswa.find({ id_jenis_kelamin: 1 }).count()} - ${await Siswa.find({ id_jenis_kelamin: 2 }).count()}`,
                    },
                    {
                        id: 3,
                        title: "Tempat Lahir",
                        icon: "city",
                        value: await TempatLahir.countDocuments(),
                    },
                    {
                        id: 4,
                        title: "Jenis Kelamin",
                        icon: "venus-mars",
                        value: await JenisKelamin.countDocuments(),
                    },
                ],
            },
            {
                id: 2,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Tahun Masuk",
                        icon: "calendar-days",
                        value: await TahunMasuk.countDocuments(),
                    },
                    {
                        id: 2,
                        title: "Tingkat",
                        icon: "layer-group",
                        value: await Tingkat.countDocuments(),
                    },
                    {
                        id: 3,
                        title: "Jurusan",
                        icon: "wrench",
                        value: await Jurusan.countDocuments(),
                    },
                    {
                        id: 4,
                        title: "Rombel",
                        icon: "sliders",
                        value: await Rombel.countDocuments(),
                    },
                ],
            },
        ],
    });
});

bukuIndukRouter.use("/siswa", bukuIndukSiswaRouter);
bukuIndukRouter.use("/tempat-lahir", bukuIndukTempatLahirRouter);
bukuIndukRouter.use("/jenis-kelamin", bukuIndukJenisKelaminRouter);
bukuIndukRouter.use("/tahun-masuk", bukuIndukTahunMasukRouter);
