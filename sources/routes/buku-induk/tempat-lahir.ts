import express, { Router } from "express";

import { TempatLahir } from "../../models";

import { headTitle } from ".";

export const bukuIndukTempatLahirRouter = Router();
const navActive = [1, 2];

bukuIndukTempatLahirRouter.use(express.static("sources/public"));
bukuIndukTempatLahirRouter.use(express.urlencoded({ extended: false }));

bukuIndukTempatLahirRouter.route("/").get(async (req, res) => {
    const tableItemArray = await TempatLahir.find();

    res.render("pages/table", {
        headTitle,
        extraTitle: "Utama",
        navActive,
        toastResponse: req.query.response,
        toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
        toastText: req.query.text,
        cardItemArray: [
            {
                id: 1,
                title: "Tempat Lahir",
                icon: "user",
                value: await TempatLahir.countDocuments(),
            },
            {
                id: 2,
                title: "Dibuat",
                icon: "circle-plus",
                value: (await TempatLahir.findOne().sort({ dibuat: -1 })).tempat_lahir,
            },
            {
                id: 3,
                title: "Diupdate",
                icon: "circle-exclamation",
                value: (await TempatLahir.findOne().sort({ diubah: -1 })).tempat_lahir,
            },
        ],
        tableAttributeArray: [
            {
                id: 1,
                label: "Tempat Lahir",
                value: ["tempat_lahir"],
                type: "text",
            },
        ],
        tableItemArray,
    });
});

bukuIndukTempatLahirRouter
    .route("/create")
    .get(async (req, res) => {
        res.render("pages/buku-induk/tempat-lahir/create", {
            headTitle,
            extraTitle: "Buat",
            navActive,
            toastResponse: req.query.response,
            toastTitle: req.query.response == "success" ? "Data Berhasil Dibuat" : "Data Gagal Dibuat",
            toastText: req.query.text,
            detailedInputArray: [
                {
                    id: 1,
                    name: "tempat_lahir",
                    display: "Tempat Lahir",
                    type: "text",
                    value: null,
                    placeholder: "Input tempat lahir disini",
                    enable: true,
                },
            ],
        });
    })
    .post(async (req, res) => {
        const inputArray = [req.body.tempat_lahir];

        if (!inputArray.includes(undefined)) {
            const tempatLahirObject: any = new TempatLahir({
                _id: (await TempatLahir.findOne().sort({ _id: -1 }))._id + 1,
                tempat_lahir: req.body.tempat_lahir,
                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await tempatLahirObject.save();
                res.redirect("create?response=success");
            } catch (error) {
                res.redirect("create?response=error");
            }
        } else if (inputArray.includes(undefined)) {
            res.redirect("create?response=error&text=Data tidak lengkap");
        }
    });

bukuIndukTempatLahirRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const tempatLahirExist = await TempatLahir.exists({ _id: id });

        if (tempatLahirExist) {
            const tempatLahirObject = await TempatLahir.findOne({ _id: id });

            res.render("pages/buku-induk/tempat-lahir/delete", {
                headTitle,
                extraTitle: "Hapus",
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
                toastText: req.query.text,
                id,
                detailedInputArray: [
                    {
                        id: 1,
                        name: "tempat_lahir",
                        display: "Tempat Lahir",
                        type: "text",
                        value: tempatLahirObject.tempat_lahir,
                        placeholder: "Input tempat lahir disini",
                        enable: false,
                    },
                ],
            });
        } else if (!tempatLahirExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const tempatLahirExist = await TempatLahir.exists({ _id: id });

        if (tempatLahirExist) {
            try {
                await TempatLahir.deleteOne({ _id: id });
                res.redirect("./?response=success");
            } catch (error) {
                res.redirect(`delete?id=${id}&response=error`);
            }
        } else if (!tempatLahirExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });

bukuIndukTempatLahirRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const tempatLahirExist = await TempatLahir.exists({ _id: id });

        if (tempatLahirExist) {
            const tempatLahirObject = await TempatLahir.findOne({ _id: id });

            res.render("pages/buku-induk/tempat-lahir/update", {
                headTitle,
                extraTitle: "Ubah",
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Diubah" : "Data Gagal Diubah",
                toastText: req.query.text,
                id,
                detailedInputArray: [
                    {
                        id: 1,
                        name: "tempat_lahir",
                        display: "Tempat Lahir",
                        type: "text",
                        value: tempatLahirObject.tempat_lahir,
                        placeholder: "Input tempat lahir disini",
                        enable: true,
                    },
                ],
            });
        } else if (!tempatLahirExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const tempatLahirExist = await TempatLahir.exists({ _id: id });

        if (tempatLahirExist != null) {
            const inputArray = [req.body.tempat_lahir];

            if (!inputArray.includes(undefined)) {
                try {
                    await TempatLahir.updateOne(
                        { _id: id },
                        {
                            tempat_lahir: req.body.tempat_lahir,
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
        } else if (tempatLahirExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
