import express, { Router } from "express";

import { headTitle } from ".";

import { Rombel, Siswa, TahunAjaran } from "../../models";

export const sekolahTahunAjaranRouter = Router();

const navActive = [3, 3];
const tableAttributeArray = [
    {
        id: 1,
        label: "Tahun Ajaran",
        value: ["tahun_ajaran"],
        type: "text",
    },
];

sekolahTahunAjaranRouter.use(express.static("sources/public"));
sekolahTahunAjaranRouter.use(express.urlencoded({ extended: false }));

sekolahTahunAjaranRouter.route("/").get(async (req, res) => {
    const tableItemArray = await TahunAjaran.find().sort({ tahun_ajaran: 1 }).lean();

    const documentCount = await TahunAjaran.countDocuments().lean();
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
                        title: "Tahun Ajaran",
                        icon: "calendar-days",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await TahunAjaran.findOne().select("tahun_ajaran").sort({ dibuat: -1 }).lean()).tahun_ajaran : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await TahunAjaran.findOne().select("tahun_ajaran").sort({ diubah: -1 }).lean()).tahun_ajaran : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [],
        tableAttributeArray,
        tableItemArray,
    });
});

sekolahTahunAjaranRouter
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
                    name: "tahun_ajaran",
                    display: "Tahun Ajaran",
                    type: "text",
                    value: null,
                    placeholder: "Input tahun ajaran disini",
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
            const itemObject = new TahunAjaran({
                _id: (await TahunAjaran.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

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

sekolahTahunAjaranRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TahunAjaran.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await TahunAjaran.findOne({ _id: id }).select("tahun_ajaran").lean();

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
                        name: "tahun_ajaran",
                        display: "Tahun Ajaran",
                        type: "text",
                        value: itemObject.tahun_ajaran,
                        placeholder: "Input tahun ajaran disini",
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
        const dataExist = await TahunAjaran.exists({ _id: id }).lean();

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await TahunAjaran.updateOne(
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

sekolahTahunAjaranRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TahunAjaran.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await TahunAjaran.findOne({ _id: id }).select("tahun_ajaran").lean();

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
                        name: "tahun_ajaran",
                        display: "Tahun Ajaran",
                        type: "text",
                        value: itemObject.tahun_ajaran,
                        placeholder: "Input tahun ajaran disini",
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
        const dataExist = await TahunAjaran.exists({ _id: id }).lean();

        if (dataExist != null) {
            const dataIsUsed = (await Siswa.exists({ id_tahun_ajaran: id }).lean()) || (await Rombel.exists({ id_tahun_ajaran: id }).lean());
            if (dataIsUsed == null) {
                try {
                    await TahunAjaran.deleteOne({ _id: id }).lean();
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
