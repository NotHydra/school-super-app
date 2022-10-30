import express, { Router } from "express";

import { headTitle } from ".";

import { Alumni, TahunLulus } from "../../models";

export const lulusanTahunLulusRouter = Router();

const navActive = [5, 3];
const tableAttributeArray = [
    {
        id: 1,
        label: "Tahun Lulus",
        value: ["tahun_lulus"],
        type: "text",
    },
];

lulusanTahunLulusRouter.use(express.static("sources/public"));
lulusanTahunLulusRouter.use(express.urlencoded({ extended: false }));

lulusanTahunLulusRouter.route("/").get(async (req, res) => {
    const tableItemArray = await TahunLulus.find().sort({ tahun_lulus: 1 }).lean();

    const documentCount = await TahunLulus.countDocuments().lean();
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
                        title: "Tahun Lulus",
                        icon: "calendar-days",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await TahunLulus.findOne().select("tahun_lulus").sort({ dibuat: -1 }).lean()).tahun_lulus : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await TahunLulus.findOne().select("tahun_lulus").sort({ diubah: -1 }).lean()).tahun_lulus : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [],
        tableAttributeArray,
        tableItemArray,
    });
});

lulusanTahunLulusRouter
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
                    name: "tahun_lulus",
                    display: "Tahun Lulus",
                    type: "text",
                    value: null,
                    placeholder: "Input tahun lulus disini",
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
            const itemObject = new TahunLulus({
                _id: (await TahunLulus.findOne().select("_id").sort({ _id: -1 }).lean())._id + 1 || 1,

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

lulusanTahunLulusRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TahunLulus.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await TahunLulus.findOne({ _id: id }).select("tahun_lulus").lean();

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
                        name: "tahun_lulus",
                        display: "Tahun Lulus",
                        type: "text",
                        value: itemObject.tahun_lulus,
                        placeholder: "Input tahun lulus disini",
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
        const dataExist = await TahunLulus.exists({ _id: id }).lean();

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await TahunLulus.updateOne(
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

lulusanTahunLulusRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await TahunLulus.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await TahunLulus.findOne({ _id: id }).select("tahun_lulus").lean();

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
                        name: "tahun_lulus",
                        display: "Tahun Lulus",
                        type: "text",
                        value: itemObject.tahun_lulus,
                        placeholder: "Input tahun lulus disini",
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
        const dataExist = await TahunLulus.exists({ _id: id }).lean();

        if (dataExist != null) {
            const dataIsUsed = await Alumni.exists({ id_tahun_lulus: id }).lean();
            if (dataIsUsed == null) {
                try {
                    await TahunLulus.deleteOne({ _id: id }).lean();
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
