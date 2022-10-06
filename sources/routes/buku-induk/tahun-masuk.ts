import express, { Router } from "express";

import { Siswa, TahunMasuk } from "../../models";

import { headTitle } from ".";

export const bukuIndukTahunMasukRouter = Router();
const navActive = [1, 4];
const tableAttributeArray = [
    {
        id: 1,
        label: "Tahun Masuk",
        value: ["tahun_masuk"],
        type: "text",
    },
];

bukuIndukTahunMasukRouter.use(express.static("sources/public"));
bukuIndukTahunMasukRouter.use(express.urlencoded({ extended: false }));

bukuIndukTahunMasukRouter.route("/").get(async (req, res) => {
    const tableItemArray = await TahunMasuk.find().sort({ tahun_masuk: 1 });

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
                        title: "Tahun Masuk",
                        icon: "calendar-days",
                        value: await TahunMasuk.countDocuments(),
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: (await TahunMasuk.findOne().sort({ dibuat: -1 })).tahun_masuk,
                    },
                    {
                        id: 3,
                        title: "Diupdate",
                        icon: "circle-exclamation",
                        value: (await TahunMasuk.findOne().sort({ diubah: -1 })).tahun_masuk,
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

bukuIndukTahunMasukRouter
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
                    name: "tahun_masuk",
                    display: "Tahun Masuk",
                    type: "number",
                    value: null,
                    placeholder: "Input tahun masuk disini",
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
            const itemObject = new TahunMasuk({
                _id: (await TahunMasuk.findOne().sort({ _id: -1 }))._id + 1,

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

bukuIndukTahunMasukRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TahunMasuk.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await TahunMasuk.findOne({ _id: id });

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
                        name: "tahun_masuk",
                        display: "Tahun Masuk",
                        type: "number",
                        value: itemObject.tahun_masuk,
                        placeholder: "Input tahun masuk disini",
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
        const dataExist = await TahunMasuk.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await TahunMasuk.updateOne(
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

bukuIndukTahunMasukRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TahunMasuk.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await TahunMasuk.findOne({ _id: id });

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
                        name: "tahun_masuk",
                        display: "Tahun Masuk",
                        type: "number",
                        value: itemObject.tahun_masuk,
                        placeholder: "Input tahun masuk disini",
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
        const dataExist = await TahunMasuk.exists({ _id: id });

        if (dataExist != null) {
            const dataIsUsed = await Siswa.exists({ id_tahun_masuk: id });

            if (dataIsUsed == null) {
                try {
                    await TahunMasuk.deleteOne({ _id: id });
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
