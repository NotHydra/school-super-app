import express, { Router } from "express";

import { MataPelajaran, Raport } from "../../models";

import { headTitle } from ".";

export const penilaianMataPelajaranRouter = Router();
const navActive = [2, 2];
const tableAttributeArray = [
    {
        id: 1,
        label: "Mata Pelajaran",
        value: ["mata_pelajaran"],
        type: "text",
    },
    {
        id: 1,
        label: "Bobot Pengetahuan",
        value: ["bobot_pengetahuan"],
        type: "text",
    },
    {
        id: 1,
        label: "Bobot Keterampilan",
        value: ["bobot_keterampilan"],
        type: "text",
    },
];

penilaianMataPelajaranRouter.use(express.static("sources/public"));
penilaianMataPelajaranRouter.use(express.urlencoded({ extended: false }));

penilaianMataPelajaranRouter.route("/").get(async (req, res) => {
    const tableItemArray = await MataPelajaran.find().sort({ mata_pelajaran: 1 });

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
                        title: "Mata Pelajaran",
                        icon: "book-bookmark",
                        value: await MataPelajaran.countDocuments(),
                    },
                ],
            },
            {
                id: 2,
                cardItemChild: [
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: (await MataPelajaran.findOne().sort({ dibuat: -1 })).mata_pelajaran,
                    },
                ],
            },
            {
                id: 3,
                cardItemChild: [
                    {
                        id: 3,
                        title: "Diupdate",
                        icon: "circle-exclamation",
                        value: (await MataPelajaran.findOne().sort({ diubah: -1 })).mata_pelajaran,
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

penilaianMataPelajaranRouter
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
                    name: "mata_pelajaran",
                    display: "Mata Pelajaran",
                    type: "text",
                    value: null,
                    placeholder: "Input mata pelajaran disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "bobot_pengetahuan",
                    display: "Bobot Pengetahuan",
                    type: "number",
                    value: null,
                    placeholder: "Input bobot pengetahuan disini",
                    enable: true,
                },
                {
                    id: 3,
                    name: "bobot_keterampilan",
                    display: "Bobot Keterampilan",
                    type: "number",
                    value: null,
                    placeholder: "Input bobot keterampilan disini",
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
            const itemObject = new MataPelajaran({
                _id: (await MataPelajaran.findOne().sort({ _id: -1 }))._id + 1,

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

penilaianMataPelajaranRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await MataPelajaran.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await MataPelajaran.findOne({ _id: id });

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
                        name: "mata_pelajaran",
                        display: "Mata Pelajaran",
                        type: "text",
                        value: itemObject.mata_pelajaran,
                        placeholder: "Input mata pelajaran disini",
                        enable: true,
                    },
                    {
                        id: 2,
                        name: "bobot_pengetahuan",
                        display: "Bobot Pengetahuan",
                        type: "number",
                        value: itemObject.bobot_pengetahuan,
                        placeholder: "Input bobot pengetahuan disini",
                        enable: true,
                    },
                    {
                        id: 3,
                        name: "bobot_keterampilan",
                        display: "Bobot Keterampilan",
                        type: "number",
                        value: itemObject.bobot_keterampilan,
                        placeholder: "Input bobot keterampilan disini",
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
        const dataExist = await MataPelajaran.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await MataPelajaran.updateOne(
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

penilaianMataPelajaranRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await MataPelajaran.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await MataPelajaran.findOne({ _id: id });

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
                        name: "mata_pelajaran",
                        display: "Mata Pelajaran",
                        type: "text",
                        value: itemObject.mata_pelajaran,
                        placeholder: "Input mata pelajaran disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "bobot_pengetahuan",
                        display: "Bobot Pengetahuan",
                        type: "number",
                        value: itemObject.bobot_pengetahuan,
                        placeholder: "Input bobot pengetahuan disini",
                        enable: false,
                    },
                    {
                        id: 3,
                        name: "bobot_keterampilan",
                        display: "Bobot Keterampilan",
                        type: "number",
                        value: itemObject.bobot_keterampilan,
                        placeholder: "Input bobot keterampilan disini",
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
        const dataExist = await MataPelajaran.exists({ _id: id });

        if (dataExist != null) {
            let dataIsUsed: boolean = false;

            (await Raport.find()).forEach((raportObject) => {
                raportObject.semester.forEach((raportSemesterObject) => {
                    raportSemesterObject.mata_pelajaran.forEach((raportMataPelajaranObject: any) => {
                        if (raportMataPelajaranObject.id_mata_pelajaran == id) {
                            dataIsUsed = true;
                        }
                    });
                });
            });

            if (!dataIsUsed) {
                try {
                    await MataPelajaran.deleteOne({ _id: id });
                    res.redirect("./?response=success");
                } catch (error) {
                    res.redirect(`delete?id=${id}&response=error`);
                }
            } else if (dataIsUsed) {
                res.redirect(`delete?id=${id}&response=error&text=Data digunakan di data lain`);
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
