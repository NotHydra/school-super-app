import express, { Router } from "express";

import { JenisKelamin } from "../../models";

import { headTitle } from ".";

export const bukuIndukJenisKelaminRouter = Router();
const partialPath = "./../../..";
const navActive = [1, 3];

bukuIndukJenisKelaminRouter.use(express.static("sources/public"));
bukuIndukJenisKelaminRouter.use(express.urlencoded({ extended: false }));

bukuIndukJenisKelaminRouter.route("/").get(async (req, res) => {
    const jenisKelaminArray = await JenisKelamin.find();

    res.render("pages/buku-induk/jenis-kelamin/index", {
        headTitle,
        extraTitle: "Utama",
        partialPath,
        navActive,
        toastResponse: req.query.response,
        toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
        toastText: req.query.text,
        boxItemArray: [
            {
                id: 1,
                title: "Jenis Kelamin",
                icon: "user",
                value: await JenisKelamin.countDocuments(),
            },
            {
                id: 2,
                title: "Dibuat",
                icon: "circle-plus",
                value: (await JenisKelamin.findOne().sort({ dibuat: -1 })).jenis_kelamin,
            },
            {
                id: 3,
                title: "Diupdate",
                icon: "circle-exclamation",
                value: (await JenisKelamin.findOne().sort({ diubah: -1 })).jenis_kelamin,
            },
        ],
        jenisKelaminArray: jenisKelaminArray,
    });
});

bukuIndukJenisKelaminRouter
    .route("/create")
    .get(async (req, res) => {
        res.render("pages/buku-induk/jenis-kelamin/create", {
            headTitle,
            extraTitle: "Buat",
            partialPath,
            navActive,
            toastResponse: req.query.response,
            toastTitle: req.query.response == "success" ? "Data Berhasil Dibuat" : "Data Gagal Dibuat",
            toastText: req.query.text,
            detailedInputArray: [
                {
                    id: 1,
                    name: "jenis_kelamin",
                    display: "Jenis Kelamin",
                    type: "text",
                    value: null,
                    placeholder: "Input jenis kelamin disini",
                    enable: true,
                },
            ],
        });
    })
    .post(async (req, res) => {
        const inputArray = [req.body.jenis_kelamin];

        if (!inputArray.includes(undefined)) {
            const jenisKelaminObject: any = new JenisKelamin({
                _id: (await JenisKelamin.findOne().sort({ _id: -1 }))._id + 1,
                jenis_kelamin: req.body.jenis_kelamin,
                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await jenisKelaminObject.save();
                res.redirect("create?response=success");
            } catch (error) {
                res.redirect("create?response=error");
            }
        } else if (inputArray.includes(undefined)) {
            res.redirect("create?response=error&text=Data tidak lengkap");
        }
    });

bukuIndukJenisKelaminRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const jenisKelaminExist = await JenisKelamin.exists({ _id: id });

        if (jenisKelaminExist) {
            const jenisKelaminObject = await JenisKelamin.findOne({ _id: id });

            res.render("pages/buku-induk/jenis-kelamin/delete", {
                headTitle,
                extraTitle: "Hapus",
                partialPath,
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
                toastText: req.query.text,
                id,
                detailedInputArray: [
                    {
                        id: 1,
                        name: "jenis_kelamin",
                        display: "Jenis Kelamin",
                        type: "text",
                        value: jenisKelaminObject.jenis_kelamin,
                        placeholder: "Input jenis kelamin disini",
                        enable: false,
                    },
                ],
            });
        } else if (!jenisKelaminExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const jenisKelaminExist = await JenisKelamin.exists({ _id: id });

        if (jenisKelaminExist) {
            try {
                await JenisKelamin.deleteOne({ _id: id });
                res.redirect("./?response=success");
            } catch (error) {
                res.redirect(`delete?id=${id}&response=error`);
            }
        } else if (!jenisKelaminExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });

bukuIndukJenisKelaminRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const jenisKelaminExist = await JenisKelamin.exists({ _id: id });

        if (jenisKelaminExist) {
            const jenisKelaminObject = await JenisKelamin.findOne({ _id: id });

            res.render("pages/buku-induk/jenis-kelamin/update", {
                headTitle,
                extraTitle: "Ubah",
                partialPath,
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Diubah" : "Data Gagal Diubah",
                toastText: req.query.text,
                id,
                detailedInputArray: [
                    {
                        id: 1,
                        name: "jenis_kelamin",
                        display: "Jenis Kelamin",
                        type: "text",
                        value: jenisKelaminObject.jenis_kelamin,
                        placeholder: "Input jenis kelamin disini",
                        enable: true,
                    },
                ],
            });
        } else if (!jenisKelaminExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const jenisKelaminExist = await JenisKelamin.exists({ _id: id });

        if (jenisKelaminExist != null) {
            const inputArray = [req.body.jenis_kelamin];

            if (!inputArray.includes(undefined)) {
                try {
                    await JenisKelamin.updateOne(
                        { _id: id },
                        {
                            jenis_kelamin: req.body.jenis_kelamin,
                            diubah: new Date(),
                        }
                    );
                    res.redirect(`update?id=${id}&response=success`);
                } catch {
                    res.redirect(`update?id=${id}&response=error`);
                }
            } else if (inputArray.includes(undefined)) {
                res.redirect(`update?id=${id}&response=error&text=Data tidak lengkap`);
            }
        } else if (jenisKelaminExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
