import express, { Router } from "express";

import { headTitle } from ".";

import { Alumni, Guru, Pendidikan } from "../../models";

export const dataUmumPendidikanRouter = Router();

const navActive = [6, 4];
const tableAttributeArray = [
    {
        id: 1,
        label: "Pendidikan",
        value: ["pendidikan"],
        type: "text",
    },
    {
        id: 2,
        label: "Singkatan",
        value: ["singkatan"],
        type: "text",
    },
];

dataUmumPendidikanRouter.use(express.static("sources/public"));
dataUmumPendidikanRouter.use(express.urlencoded({ extended: false }));

dataUmumPendidikanRouter.route("/").get(async (req, res) => {
    const tableItemArray = await Pendidikan.find().sort({ pendidikan: 1 });

    res.render("pages/table", {
        headTitle,
        navActive,
        toastResponse: req.query.response,
        toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
        toastText: req.query.text,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Pendidikan",
                        icon: "school",
                        value: await Pendidikan.countDocuments(),
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
                        value: (await Pendidikan.findOne().sort({ dibuat: -1 })).pendidikan,
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
                        value: (await Pendidikan.findOne().sort({ diubah: -1 })).pendidikan,
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

dataUmumPendidikanRouter
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
                    name: "pendidikan",
                    display: "Pendidikan",
                    type: "text",
                    value: null,
                    placeholder: "Input pendidikan disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "singkatan",
                    display: "Singkatan",
                    type: "text",
                    value: null,
                    placeholder: "Input singkatan disini",
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
            const itemObject = new Pendidikan({
                _id: (await Pendidikan.findOne().sort({ _id: -1 }))._id + 1,

                ...attributeArray,

                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await itemObject.save();
                res.redirect("create?response=success");
            } catch (error) {
                res.redirect("create?response=error");
            }
        } else if (inputArray.includes(undefined)) {
            res.redirect("create?response=error&text=Data tidak lengkap");
        }
    });

dataUmumPendidikanRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Pendidikan.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await Pendidikan.findOne({ _id: id });

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
                        name: "pendidikan",
                        display: "Pendidikan",
                        type: "text",
                        value: itemObject.pendidikan,
                        placeholder: "Input pendidikan disini",
                        enable: true,
                    },
                    {
                        id: 2,
                        name: "singkatan",
                        display: "Singkatan",
                        type: "text",
                        value: itemObject.singkatan,
                        placeholder: "Input singkatan disini",
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
        const dataExist = await Pendidikan.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Pendidikan.updateOne(
                        { _id: id },
                        {
                            ...attributeArray,

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
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });

dataUmumPendidikanRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Pendidikan.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await Pendidikan.findOne({ _id: id });

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
                        name: "pendidikan",
                        display: "Pendidikan",
                        type: "text",
                        value: itemObject.pendidikan,
                        placeholder: "Input pendidikan kelamin disini",
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
        const dataExist = await Pendidikan.exists({ _id: id });

        if (dataExist != null) {
            const dataIsUsed = (await Alumni.exists({ id_pendidikan: id })) || (await Guru.exists({ id_pendidikan: id }));

            if (dataIsUsed == null) {
                try {
                    await Pendidikan.deleteOne({ _id: id });
                    res.redirect("./?response=success");
                } catch (error) {
                    res.redirect(`delete?id=${id}&response=error`);
                }
            } else if (dataIsUsed != null) {
                res.redirect(`delete?id=${id}&response=error&text=Data digunakan di data lain`);
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
