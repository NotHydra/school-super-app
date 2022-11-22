import express, { Router } from "express";

import { headTitle } from ".";

import { Klasifikasi, Tipe } from "../../models";

export const pelanggaranTipeRouter = Router();

const navActive = [12, 3];
const tableAttributeArray = [
    {
        id: 1,
        label: "Tipe",
        value: ["tipe"],
        type: "text",
    },
    {
        id: 2,
        label: "Skor",
        value: ["skor"],
        type: "text",
    },
    {
        id: 3,
        label: "Sanksi",
        value: ["sanksi"],
        type: "textarea",
    },
];

pelanggaranTipeRouter.use(express.static("sources/public"));
pelanggaranTipeRouter.use(express.urlencoded({ extended: false }));

pelanggaranTipeRouter.route("/").get(async (req, res) => {
    const tableItemArray = await Tipe.find().sort({ tipe: 1 }).lean();

    const documentCount = await Tipe.countDocuments().lean();
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
                        title: "Tipe",
                        icon: "clipboard",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await Tipe.findOne().select("tipe").sort({ dibuat: -1 }).lean()).tipe : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await Tipe.findOne().select("tipe").sort({ diubah: -1 }).lean()).tipe : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [],
        tableAttributeArray,
        tableItemArray,
    });
});

pelanggaranTipeRouter
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
                    name: "tipe",
                    display: "Tipe",
                    type: "text",
                    value: null,
                    placeholder: "Input tipe disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "skor",
                    display: "Skor",
                    type: "number",
                    value: null,
                    placeholder: "Input skor disini",
                    enable: true,
                },
                {
                    id: 3,
                    name: "sanksi",
                    display: "Sanksi",
                    type: "textarea",
                    value: null,
                    placeholder: "Input sanksi disini",
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
            const itemObject = new Tipe({
                _id: (await Tipe.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

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

pelanggaranTipeRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Tipe.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Tipe.findOne({ _id: id }).select("tipe skor sanksi").lean();

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
                        name: "tipe",
                        display: "Tipe",
                        type: "text",
                        value: itemObject.tipe,
                        placeholder: "Input tipe disini",
                        enable: true,
                    },
                    {
                        id: 2,
                        name: "skor",
                        display: "Skor",
                        type: "number",
                        value: itemObject.skor,
                        placeholder: "Input skor disini",
                        enable: true,
                    },
                    {
                        id: 3,
                        name: "sanksi",
                        display: "Sanksi",
                        type: "textarea",
                        value: itemObject.sanksi,
                        placeholder: "Input sanksi disini",
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
        const dataExist = await Tipe.exists({ _id: id }).lean();

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Tipe.updateOne(
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

pelanggaranTipeRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Tipe.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Tipe.findOne({ _id: id }).select("tipe skor sanksi").lean();

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
                        name: "tipe",
                        display: "Tipe",
                        type: "text",
                        value: itemObject.tipe,
                        placeholder: "Input tipe disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "skor",
                        display: "Skor",
                        type: "number",
                        value: itemObject.skor,
                        placeholder: "Input skor disini",
                        enable: false,
                    },
                    {
                        id: 3,
                        name: "sanksi",
                        display: "Sanksi",
                        type: "textarea",
                        value: itemObject.sanksi,
                        placeholder: "Input sanksi disini",
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
        const dataExist = await Tipe.exists({ _id: id }).lean();

        if (dataExist != null) {
            const dataIsUsed = await Klasifikasi.exists({ id_tipe: id }).lean();
            if (dataIsUsed == null) {
                try {
                    await Tipe.deleteOne({ _id: id }).lean();
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
