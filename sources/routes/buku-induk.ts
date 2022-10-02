import express, { Router } from "express";
import { Siswa } from "../models";

export const bukuIndukRouter = Router();
const headTitle = "Buku Induk";
const partialPath = "./../../..";

bukuIndukRouter.use(express.static("sources/public"));

bukuIndukRouter.get("/siswa", async (req, res) => {
    const siswaArray = await Siswa.find()
        .populate("id_tempat_lahir")
        .populate("id_jenis_kelamin")
        .populate("id_tahun_masuk")
        .populate("id_tingkat")
        .populate("id_jurusan")
        .populate("id_rombel");

    res.render("pages/buku-induk/siswa", {
        headTitle,
        partialPath,
        navActive: [1, 0],
        boxItemArray: [
            {
                id: 1,
                title: "Siswa",
                icon: "user",
                value: siswaArray.length,
            },
            {
                id: 2,
                title: "Laki-Laki & Perempuan",
                icon: "restroom",
                value: `${await Siswa.find({ id_jenis_kelamin: 1 }).count()} - ${await Siswa.find({ id_jenis_kelamin: 2 }).count()}`,
            },
            {
                id: 3,
                title: "Dibuat",
                icon: "circle-plus",
                value: (await Siswa.findOne().sort({ dibuat: -1 }))?.nisn,
            },
            {
                id: 4,
                title: "Diupdate",
                icon: "circle-exclamation",
                value: (await Siswa.findOne().sort({ diubah: -1 }))?.nisn,
            },
        ],
        siswaArray,
    });
});

bukuIndukRouter.get("/tempat-lahir", (req, res) => {
    res.render("pages/index", { headTitle, partialPath, navActive: [1, 1] });
});

bukuIndukRouter.get("/jenis-kelamin", (req, res) => {
    res.render("pages/index", { headTitle, partialPath, navActive: [1, 2] });
});

bukuIndukRouter.get("/tahun-masuk", (req, res) => {
    res.render("pages/index", { headTitle, partialPath, navActive: [1, 3] });
});

bukuIndukRouter.get("/tingkat", (req, res) => {
    res.render("pages/index", { headTitle, partialPath, navActive: [1, 4] });
});

bukuIndukRouter.get("/jurusan", (req, res) => {
    res.render("pages/index", { headTitle, partialPath, navActive: [1, 5] });
});

bukuIndukRouter.get("/rombel", (req, res) => {
    res.render("pages/index", { headTitle, partialPath, navActive: [1, 6] });
});
