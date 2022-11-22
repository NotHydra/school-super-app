import express, { Router } from "express";

import { headTitle } from ".";

import { Klasifikasi, Pelanggar, Tipe } from "../../models";

export const pelanggaranKlasifikasiRouter = Router();

const navActive = [12, 4];
const tableAttributeArray = [
    {
        id: 1,
        label: "Tipe",
        value: ["id_tipe", "tipe"],
        type: "text",
    },
    {
        id: 2,
        label: "Klasifikasi",
        value: ["klasifikasi"],
        type: "text",
    },
];

pelanggaranKlasifikasiRouter.use(express.static("sources/public"));
pelanggaranKlasifikasiRouter.use(express.urlencoded({ extended: false }));

pelanggaranKlasifikasiRouter.route("/").get(async (req, res) => {
    const tableItemArray = (await Klasifikasi.find().populate({ path: "id_tipe", select: "tipe", model: Tipe }).sort({ klasifikasi: 1 }).lean()).sort(
        (a: any, b: any) => {
            return a.id_tipe.tipe.localeCompare(b.id_tipe.tipe);
        }
    );

    const documentCount = await Klasifikasi.countDocuments().lean();
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
                        title: "Klasifikasi",
                        icon: "ban",
                        value: documentCount,
                    },
                ],
            },
            {
                id: 2,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await Klasifikasi.findOne().select("klasifikasi").sort({ dibuat: -1 }).lean()).klasifikasi : "Tidak Ada",
                    },
                ],
            },
            {
                id: 3,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await Klasifikasi.findOne().select("klasifikasi").sort({ diubah: -1 }).lean()).klasifikasi : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [],
        tableAttributeArray,
        tableItemArray,
    });
});

pelanggaranKlasifikasiRouter
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
                    name: "id_tipe",
                    display: "Tipe",
                    type: "select",
                    value: [
                        (await Tipe.find().select("tipe").sort({ tipe: 1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.tipe];
                        }),
                        null,
                    ],
                    placeholder: "Input tipe disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "klasifikasi",
                    display: "Klasifikasi",
                    type: "text",
                    value: null,
                    placeholder: "Input klasifikasi disini",
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
            const itemObject = new Klasifikasi({
                _id: (await Klasifikasi.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

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

pelanggaranKlasifikasiRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Klasifikasi.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Klasifikasi.findOne({ _id: id }).select("id_tipe klasifikasi").lean();

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
                        name: "id_tipe",
                        display: "Tipe",
                        type: "select",
                        value: [
                            (await Tipe.find().select("tipe").sort({ tipe: 1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.tipe];
                            }),
                            itemObject.id_tipe,
                        ],
                        placeholder: "Input tipe disini",
                        enable: true,
                    },
                    {
                        id: 2,
                        name: "klasifikasi",
                        display: "Klasifikasi",
                        type: "text",
                        value: itemObject.klasifikasi,
                        placeholder: "Input klasifikasi disini",
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
        const dataExist = await Klasifikasi.exists({ _id: id }).lean();

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Klasifikasi.updateOne(
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

pelanggaranKlasifikasiRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Klasifikasi.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject: any = await Klasifikasi.findOne({ _id: id })
                .select("id_tipe klasifikasi")
                .populate({ path: "id_tipe", select: "tipe", model: Tipe })
                .lean();

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
                        name: "id_tipe",
                        display: "Tipe",
                        type: "select",
                        value: itemObject.id_tipe.tipe,
                        placeholder: "Input tipe disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "klasifikasi",
                        display: "Klasifikasi",
                        type: "text",
                        value: itemObject.klasifikasi,
                        placeholder: "Input klasifikasi disini",
                        enable: false,
                    },
                ],
            });
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id: any = req.query.id;
        const dataExist = await Klasifikasi.exists({ _id: id }).lean();

        if (dataExist != null) {
            const dataIsUsed = await Pelanggar.exists({ id_klasifikasi: id }).lean();
            if (dataIsUsed == null) {
                try {
                    await Klasifikasi.deleteOne({ _id: id }).lean();
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
