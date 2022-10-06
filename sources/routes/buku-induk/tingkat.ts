import express, { Router } from "express";

import { Siswa, Tingkat } from "../../models";

import { headTitle } from ".";

export const bukuIndukTingkatRouter = Router();
const navActive = [1, 5];
const tableAttributeArray = [
    {
        id: 1,
        label: "Tingkat",
        value: ["tingkat"],
        type: "text",
    },
];

bukuIndukTingkatRouter.use(express.static("sources/public"));
bukuIndukTingkatRouter.use(express.urlencoded({ extended: false }));

bukuIndukTingkatRouter.route("/").get(async (req, res) => {
    const tableItemArray = await Tingkat.find().sort({ tingkat: 1 });

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
                        title: "Tingkat",
                        icon: "layer-group",
                        value: await Tingkat.countDocuments(),
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: (await Tingkat.findOne().sort({ dibuat: -1 })).tingkat,
                    },
                    {
                        id: 3,
                        title: "Diupdate",
                        icon: "circle-exclamation",
                        value: (await Tingkat.findOne().sort({ diubah: -1 })).tingkat,
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

bukuIndukTingkatRouter
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
                    name: "tingkat",
                    display: "Tingkat",
                    type: "text",
                    value: null,
                    placeholder: "Input tingkat disini",
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
            const itemObject = new Tingkat({
                _id: (await Tingkat.findOne().sort({ _id: -1 }))._id + 1,

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

bukuIndukTingkatRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Tingkat.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await Tingkat.findOne({ _id: id });

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
                        name: "tingkat",
                        display: "Tingkat",
                        type: "text",
                        value: itemObject.tingkat,
                        placeholder: "Input tingkat disini",
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
        const dataExist = await Tingkat.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Tingkat.updateOne(
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

bukuIndukTingkatRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Tingkat.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await Tingkat.findOne({ _id: id });

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
                        name: "tingkat",
                        display: "Tingkat",
                        type: "text",
                        value: itemObject.tingkat,
                        placeholder: "Input tingkat disini",
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
        const dataExist = await Tingkat.exists({ _id: id });

        if (dataExist != null) {
            const dataIsUsed = await Siswa.exists({ id_tingkat: id });

            if (dataIsUsed == null) {
                try {
                    await Tingkat.deleteOne({ _id: id });
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
