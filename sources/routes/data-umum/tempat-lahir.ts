import express, { Router } from "express";

import { headTitle } from ".";

import { Guru, Petugas, Siswa, TempatLahir } from "../../models";

export const dataUmumTempatLahirRouter = Router();

const navActive = [10, 2];
const tableAttributeArray = [
    {
        id: 1,
        label: "Tempat Lahir",
        value: ["tempat_lahir"],
        type: "text",
    },
];

dataUmumTempatLahirRouter.use(express.static("sources/public"));
dataUmumTempatLahirRouter.use(express.urlencoded({ extended: false }));

dataUmumTempatLahirRouter.route("/").get(async (req, res) => {
    const tableItemArray = await TempatLahir.find().sort({ tempat_lahir: 1 }).lean();

    const documentCount = await TempatLahir.countDocuments().lean();
    res.render("pages/table", {
        headTitle,
        navActive,
        toastResponse: req.query.response,
        toastTitle: req.query.response == "success" ? "Berhasil" : "Gagal",
        toastText: req.query.text,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Tempat Lahir",
                        icon: "city",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await TempatLahir.findOne().select("tempat_lahir").sort({ dibuat: -1 }).lean()).tempat_lahir : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await TempatLahir.findOne().select("tempat_lahir").sort({ diubah: -1 }).lean()).tempat_lahir : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [],
        tableAttributeArray,
        tableItemArray,
    });
});

dataUmumTempatLahirRouter
    .route("/create")
    .get(async (req, res) => {
        res.render("pages/create", {
            headTitle,
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
        const attributeArray: any = {};
        const inputArray = tableAttributeArray.map((tableAttributeObject) => {
            const attributeCurrent = tableAttributeObject.value[0];

            attributeArray[attributeCurrent] = req.body[attributeCurrent];

            return req.body[attributeCurrent];
        });

        if (!inputArray.includes(undefined)) {
            const itemObject = new TempatLahir({
                _id: (await TempatLahir.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

                ...attributeArray,

                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await itemObject.save();
                res.redirect("create?response=success");
            } catch (error: any) {
                res.redirect("create?response=error");
            }
        } else if (inputArray.includes(undefined)) {
            res.redirect("create?response=error&text=Data tidak lengkap");
        }
    });

dataUmumTempatLahirRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TempatLahir.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await TempatLahir.findOne({ _id: id }).select("tempat_lahir").lean();

            res.render("pages/update", {
                headTitle,
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
                        value: itemObject.tempat_lahir,
                        placeholder: "Input tempat_lahir disini",
                        enable: true,
                    },
                ],
            });
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TempatLahir.exists({ _id: id }).lean();

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await TempatLahir.updateOne(
                        { _id: id },
                        {
                            ...attributeArray,

                            diubah: new Date(),
                        }
                    ).lean();
                    res.redirect(`update?id=${id}&response=success`);
                } catch (error: any) {
                    res.redirect(`update?id=${id}&response=error`);
                }
            } else if (inputArray.includes(undefined)) {
                res.redirect(`update?id=${id}&response=error&text=Data tidak lengkap`);
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });

dataUmumTempatLahirRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TempatLahir.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await TempatLahir.findOne({ _id: id }).select("tempat_lahir").lean();

            res.render("pages/delete", {
                headTitle,
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
                        value: itemObject.tempat_lahir,
                        placeholder: "Input tempat lahir disini",
                        enable: false,
                    },
                ],
            });
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TempatLahir.exists({ _id: id }).lean();

        if (dataExist != null) {
            const dataIsUsed =
                (await Siswa.exists({ id_tempat_lahir: id }).lean()) ||
                (await Guru.exists({ id_tempat_lahir: id }).lean()) ||
                (await Petugas.exists({ id_tempat_lahir: id }).lean());

            if (dataIsUsed == null) {
                try {
                    await TempatLahir.deleteOne({ _id: id }).lean();
                    res.redirect("./?response=success");
                } catch (error: any) {
                    res.redirect(`delete?id=${id}&response=error`);
                }
            } else if (dataIsUsed != null) {
                res.redirect(`delete?id=${id}&response=error&text=Data digunakan di data lain`);
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
