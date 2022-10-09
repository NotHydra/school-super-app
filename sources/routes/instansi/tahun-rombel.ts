import express, { Router } from "express";

import { headTitle } from ".";

import { Rombel, TahunRombel } from "../../models";

export const instansiTahunRombelRouter = Router();

const navActive = [5, 4];
const tableAttributeArray = [
    {
        id: 1,
        label: "Tahun Rombel",
        value: ["tahun_rombel"],
        type: "text",
    },
];

instansiTahunRombelRouter.use(express.static("sources/public"));
instansiTahunRombelRouter.use(express.urlencoded({ extended: false }));

instansiTahunRombelRouter.route("/").get(async (req, res) => {
    const tableItemArray = await TahunRombel.find().sort({ tahun_rombel: 1 });

    const documentCount = await TahunRombel.countDocuments();
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
                        title: "Tahun Rombel",
                        icon: "calendar-days",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await TahunRombel.findOne().sort({ dibuat: -1 })).tahun_rombel : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await TahunRombel.findOne().sort({ diubah: -1 })).tahun_rombel : "Tidak Ada",
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

instansiTahunRombelRouter
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
                    name: "tahun_rombel",
                    display: "Tahun Rombel",
                    type: "text",
                    value: null,
                    placeholder: "Input tahun rombel disini",
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
            const itemObject = new TahunRombel({
                _id: (await TahunRombel.findOne().sort({ _id: -1 }))._id + 1,

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

instansiTahunRombelRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TahunRombel.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await TahunRombel.findOne({ _id: id });

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
                        name: "tahun_rombel",
                        display: "Tahun Rombel",
                        type: "text",
                        value: itemObject.tahun_rombel,
                        placeholder: "Input tahun rombel disini",
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
        const dataExist = await TahunRombel.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await TahunRombel.updateOne(
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

instansiTahunRombelRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TahunRombel.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await TahunRombel.findOne({ _id: id });

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
                        name: "tahun_rombel",
                        display: "Tahun Rombel",
                        type: "text",
                        value: itemObject.tahun_rombel,
                        placeholder: "Input tahun rombel disini",
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
        const dataExist = await TahunRombel.exists({ _id: id });

        if (dataExist != null) {
            const dataIsUsed = await Rombel.exists({ id_tahun_rombel: id });

            if (dataIsUsed == null) {
                try {
                    await TahunRombel.deleteOne({ _id: id });
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
