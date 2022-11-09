import express, { Router } from "express";

import { headTitle } from ".";

import { Alumni, Guru, Universitas } from "../../models";

export const dataUmumUniversitasRouter = Router();

const navActive = [10, 4];
const tableAttributeArray = [
    {
        id: 1,
        label: "Universitas",
        value: ["universitas"],
        type: "text",
    },
];

dataUmumUniversitasRouter.use(express.static("sources/public"));
dataUmumUniversitasRouter.use(express.urlencoded({ extended: false }));

dataUmumUniversitasRouter.route("/").get(async (req, res) => {
    const tableItemArray = await Universitas.find().sort({ universitas: 1 }).lean();

    const documentCount = await Universitas.countDocuments().lean();
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
                        title: "Universitas",
                        icon: "school",
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
                        value: documentCount >= 1 ? (await Universitas.findOne().select("universitas").sort({ dibuat: -1 }).lean()).universitas : "Tidak Ada",
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
                        value: documentCount >= 1 ? (await Universitas.findOne().select("universitas").sort({ diubah: -1 }).lean()).universitas : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [],
        tableAttributeArray,
        tableItemArray,
    });
});

dataUmumUniversitasRouter
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
                    name: "universitas",
                    display: "Universitas",
                    type: "text",
                    value: null,
                    placeholder: "Input universitas disini",
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
            const itemObject = new Universitas({
                _id: (await Universitas.findOne().select("_id").sort({ _id: -1 })?.lean())._id + 1 || 1,

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

dataUmumUniversitasRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Universitas.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Universitas.findOne({ _id: id }).select("universitas").lean();

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
                        name: "universitas",
                        display: "Universitas",
                        type: "text",
                        value: itemObject.universitas,
                        placeholder: "Input universitas disini",
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
        const dataExist = await Universitas.exists({ _id: id }).lean();

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Universitas.updateOne(
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

dataUmumUniversitasRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Universitas.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Universitas.findOne({ _id: id }).select("universitas").lean();

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
                        name: "universitas",
                        display: "Universitas",
                        type: "text",
                        value: itemObject.universitas,
                        placeholder: "Input universitas kelamin disini",
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
        const dataExist = await Universitas.exists({ _id: id }).lean();

        if (dataExist != null) {
            const dataIsUsed = (await Alumni.exists({ id_universitas: id }).lean()) || (await Guru.exists({ id_universitas: id }).lean());

            if (dataIsUsed == null) {
                try {
                    await Universitas.deleteOne({ _id: id }).lean();
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
