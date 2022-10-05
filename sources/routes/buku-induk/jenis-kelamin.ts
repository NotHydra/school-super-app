import express, { Router } from "express";

import { JenisKelamin } from "../../models";

import { headTitle } from ".";

export const bukuIndukJenisKelaminRouter = Router();
const navActive = [1, 3];
const tableAttributeArray = [
    {
        id: 1,
        label: "Jenis Kelamin",
        value: ["jenis_kelamin"],
        type: "text",
    },
];

bukuIndukJenisKelaminRouter.use(express.static("sources/public"));
bukuIndukJenisKelaminRouter.use(express.urlencoded({ extended: false }));

bukuIndukJenisKelaminRouter.route("/").get(async (req, res) => {
    const tableItemArray = await JenisKelamin.find();

    res.render("pages/table", {
        headTitle,
        navActive,
        toastResponse: req.query.response,
        toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
        toastText: req.query.text,
        cardItemArray: [
            {
                id: 1,
                title: "Jenis Kelamin",
                icon: "user",
                value: await JenisKelamin.countDocuments(),
            },
            {
                id: 2,
                title: "Dibuat",
                icon: "circle-plus",
                value: (await JenisKelamin.findOne().sort({ dibuat: -1 })).jenis_kelamin,
            },
            {
                id: 3,
                title: "Diupdate",
                icon: "circle-exclamation",
                value: (await JenisKelamin.findOne().sort({ diubah: -1 })).jenis_kelamin,
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

bukuIndukJenisKelaminRouter
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
                    name: "jenis_kelamin",
                    display: "Jenis Kelamin",
                    type: "text",
                    value: null,
                    placeholder: "Input jenis kelamin disini",
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
            const itemObject = new JenisKelamin({
                _id: (await JenisKelamin.findOne().sort({ _id: -1 }))._id + 1,

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

bukuIndukJenisKelaminRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await JenisKelamin.exists({ _id: id });

        if (dataExist) {
            const itemObject = await JenisKelamin.findOne({ _id: id });

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
                        name: "jenis_kelamin",
                        display: "Jenis Kelamin",
                        type: "text",
                        value: itemObject.jenis_kelamin,
                        placeholder: "Input jenis kelamin disini",
                        enable: true,
                    },
                ],
            });
        } else if (!dataExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const dataExist = await JenisKelamin.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await JenisKelamin.updateOne(
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

bukuIndukJenisKelaminRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const jenisKelaminExist = await JenisKelamin.exists({ _id: id });

        if (jenisKelaminExist) {
            const jenisKelaminObject = await JenisKelamin.findOne({ _id: id });

            res.render("pages/buku-induk/jenis-kelamin/delete", {
                headTitle,
                extraTitle: "Hapus",
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
                toastText: req.query.text,
                id,
                detailedInputArray: [
                    {
                        id: 1,
                        name: "jenis_kelamin",
                        display: "Jenis Kelamin",
                        type: "text",
                        value: jenisKelaminObject.jenis_kelamin,
                        placeholder: "Input jenis kelamin disini",
                        enable: false,
                    },
                ],
            });
        } else if (!jenisKelaminExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const jenisKelaminExist = await JenisKelamin.exists({ _id: id });

        if (jenisKelaminExist) {
            try {
                await JenisKelamin.deleteOne({ _id: id });
                res.redirect("./?response=success");
            } catch (error) {
                res.redirect(`delete?id=${id}&response=error`);
            }
        } else if (!jenisKelaminExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
