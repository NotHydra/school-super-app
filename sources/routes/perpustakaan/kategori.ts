import express, { Router } from "express";

import { headTitle } from ".";

import { Buku, Kategori } from "../../models";

export const perpustakaanKategoriRouter = Router();

const navActive = [9, 5];
const tableAttributeArray = [
    {
        id: 1,
        label: "Kategori",
        value: ["kategori"],
        type: "text",
    },
];

perpustakaanKategoriRouter.use(express.static("sources/public"));
perpustakaanKategoriRouter.use(express.urlencoded({ extended: false }));

perpustakaanKategoriRouter.route("/").get(async (req, res) => {
    const tableItemArray = await Kategori.find().sort({ kategori: 1 }).lean();

    const documentCount = await Kategori.countDocuments().lean();
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
                        title: "Kategori",
                        icon: "tag",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await Kategori.findOne().select("kategori").sort({ dibuat: -1 }).lean()).kategori : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await Kategori.findOne().select("kategori").sort({ diubah: -1 }).lean()).kategori : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [],
        tableAttributeArray,
        tableItemArray,
    });
});

perpustakaanKategoriRouter
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
                    name: "kategori",
                    display: "Kategori",
                    type: "text",
                    value: null,
                    placeholder: "Input kategori disini",
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
            const itemObject = new Kategori({
                _id: (await Kategori.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

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

perpustakaanKategoriRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Kategori.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Kategori.findOne({ _id: id }).select("kategori").lean();

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
                        name: "kategori",
                        display: "Kategori",
                        type: "text",
                        value: itemObject.kategori,
                        placeholder: "Input kategori disini",
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
        const dataExist = await Kategori.exists({ _id: id }).lean();

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Kategori.updateOne(
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

perpustakaanKategoriRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Kategori.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Kategori.findOne({ _id: id }).select("kategori").lean();

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
                        name: "kategori",
                        display: "Kategori",
                        type: "text",
                        value: itemObject.kategori,
                        placeholder: "Input kategori disini",
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
        const dataExist = await Kategori.exists({ _id: id }).lean();

        if (dataExist != null) {
            const dataIsUsed = await Buku.exists({ id_kategori: id }).lean();

            if (dataIsUsed == null) {
                try {
                    await Kategori.deleteOne({ _id: id }).lean();
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
