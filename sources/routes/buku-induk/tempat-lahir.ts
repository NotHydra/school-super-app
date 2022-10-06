import express, { Router } from "express";

import { Siswa, TempatLahir } from "../../models";

import { headTitle } from ".";

export const bukuIndukTempatLahirRouter = Router();
const navActive = [1, 2];
const tableAttributeArray = [
    {
        id: 1,
        label: "Tempat Lahir",
        value: ["tempat_lahir"],
        type: "text",
    },
];

bukuIndukTempatLahirRouter.use(express.static("sources/public"));
bukuIndukTempatLahirRouter.use(express.urlencoded({ extended: false }));

bukuIndukTempatLahirRouter.route("/").get(async (req, res) => {
    const tableItemArray = await TempatLahir.find().sort({ tempat_lahir: 1 });

    res.render("pages/table", {
        headTitle,
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
        tableAttributeArray,
        tableItemArray,
    });
});

bukuIndukTempatLahirRouter
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
                _id: (await TempatLahir.findOne().sort({ _id: -1 }))._id + 1,

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

bukuIndukTempatLahirRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TempatLahir.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await TempatLahir.findOne({ _id: id });

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
                        placeholder: "Input tempat lahir disini",
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
        const dataExist = await TempatLahir.exists({ _id: id });

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

bukuIndukTempatLahirRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TempatLahir.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await TempatLahir.findOne({ _id: id });

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
        const dataExist = await TempatLahir.exists({ _id: id });

        if (dataExist != null) {
            const dataIsUsed = await Siswa.exists({ id_tempat_lahir: id });

            if (dataIsUsed == null) {
                try {
                    await TempatLahir.deleteOne({ _id: id });
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
