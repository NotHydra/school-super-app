import express, { Router } from "express";

import { headTitle } from ".";

import { Anggota, Peminjaman, Rombel, Siswa, TahunMasuk, TahunRombel } from "../../models";

export const perpustakaanAnggotaRouter = Router();

const navActive = [6, 1];
const tableAttributeArray = [
    {
        id: 1,
        label: "Nomor Anggota",
        value: ["nomor_anggota"],
        type: "text",
    },
    {
        id: 2,
        label: "NISN",
        value: ["id_siswa", "nisn"],
        type: "text",
    },
    {
        id: 3,
        label: "Nama",
        value: ["id_siswa", "nama_lengkap"],
        type: "text",
    },
    {
        id: 4,
        label: "Rombel",
        value: ["id_siswa", "id_rombel", "rombel"],
        type: "text",
    },
    {
        id: 5,
        label: "Tahun Masuk",
        value: ["id_siswa", "id_tahun_masuk", "tahun_masuk"],
        type: "text",
    },
];

perpustakaanAnggotaRouter.use(express.static("sources/public"));
perpustakaanAnggotaRouter.use(express.urlencoded({ extended: false }));

perpustakaanAnggotaRouter.route("/").get(async (req, res) => {
    const rombelValue: any = req.query.rombel;
    const tahunMasukValue: any = req.query.tahunMasuk;
    let filterValue = {};

    if (rombelValue != undefined && !isNaN(rombelValue)) {
        filterValue = { ...filterValue, id_rombel: rombelValue };
    }

    if (tahunMasukValue != undefined && !isNaN(tahunMasukValue)) {
        filterValue = { ...filterValue, id_tahun_masuk: tahunMasukValue };
    }

    let tableItemArray = await Anggota.find()
        .populate({
            path: "id_siswa",
            select: "nisn nama_lengkap id_rombel id_tahun_masuk",
            populate: [
                { path: "id_rombel", select: "rombel", model: Rombel },
                { path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk },
            ],
            model: Siswa,
        })
        .sort({ nomor_anggota: 1 })
        .lean();

    if (rombelValue != undefined && !isNaN(rombelValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_siswa.id_rombel._id == rombelValue) {
                return tableItemObject;
            }
        });
    }

    if (tahunMasukValue != undefined && !isNaN(tahunMasukValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_siswa.id_tahun_masuk._id == tahunMasukValue) {
                return tableItemObject;
            }
        });
    }

    const documentCount = await Anggota.countDocuments().lean();
    res.render("pages/perpustakaan/anggota/table", {
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
                        title: "Anggota",
                        icon: "user",
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
                        value: documentCount >= 1 ? (await Anggota.findOne().select("nomor_anggota").sort({ dibuat: -1 }).lean()).nomor_anggota : "Tidak Ada",
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
                        value: documentCount >= 1 ? (await Anggota.findOne().select("nomor_anggota").sort({ diubah: -1 }).lean()).nomor_anggota : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [
            {
                id: 1,
                display: "Rombel",
                name: "rombel",
                query: "rombel",
                placeholder: "Pilih rombel",
                value: rombelValue,
                option: (
                    await Rombel.find()
                        .select("rombel id_tahun_rombel")
                        .populate({ path: "id_tahun_rombel", select: "tahun_rombel", model: TahunRombel })
                        .sort({ rombel: 1 })
                        .lean()
                )
                    .sort((a: any, b: any) => {
                        return b.id_tahun_rombel.tahun_rombel - a.id_tahun_rombel.tahun_rombel;
                    })
                    .map((itemObject: any) => {
                        return {
                            value: itemObject._id,
                            display: `${itemObject.rombel} - ${itemObject.id_tahun_rombel.tahun_rombel}`,
                        };
                    }),
            },
            {
                id: 2,
                display: "Tahun Masuk",
                name: "tahun_masuk",
                query: "tahunMasuk",
                placeholder: "Pilih tahun masuk",
                value: tahunMasukValue,
                option: (await TahunMasuk.find().select("tahun_masuk").sort({ tahun_masuk: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.tahun_masuk,
                    };
                }),
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

perpustakaanAnggotaRouter
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
                    name: "nomor_anggota",
                    display: "Nomor Anggota",
                    type: "text",
                    value: null,
                    placeholder: "Input nomor anggota disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "id_siswa",
                    display: "Siswa",
                    type: "select",
                    value: [
                        (
                            await Siswa.find()
                                .select("nisn nama_lengkap id_rombel id_tahun_masuk")
                                .populate({ path: "id_rombel", select: "rombel", model: Rombel })
                                .populate({ path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk })
                                .sort({ nisn: 1 })
                                .lean()
                        ).map((itemObject: any) => {
                            return [
                                itemObject._id,
                                `${itemObject.nisn} - ${itemObject.nama_lengkap} - ${itemObject.id_rombel.rombel} - ${itemObject.id_tahun_masuk.tahun_masuk}`,
                            ];
                        }),
                        null,
                        (await Anggota.find().select("id_siswa").lean()).map((itemObject: any) => {
                            return itemObject.id_siswa;
                        }),
                    ],
                    placeholder: "Input siswa disini",
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
            const itemObject = new Anggota({
                _id: (await Anggota.findOne().select("_id").sort({ _id: -1 }).lean())._id + 1 || 1,

                ...attributeArray,

                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await itemObject.save();
                res.redirect("create?response=success");
            } catch (error: any) {
                if (error.code == 11000) {
                    if (error.keyPattern.id_siswa) {
                        res.redirect("create?response=error&text=Siswa sudah digunakan");
                    }
                } else {
                    res.redirect("create?response=error");
                }
            }
        } else if (inputArray.includes(undefined)) {
            res.redirect("create?response=error&text=Data tidak lengkap");
        }
    });

perpustakaanAnggotaRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Anggota.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Anggota.findOne({ _id: id }).select("nomor_anggota id_siswa").lean();

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
                        name: "nomor_anggota",
                        display: "Nomor Anggota",
                        type: "text",
                        value: itemObject.nomor_anggota,
                        placeholder: "Input nomor anggota disini",
                        enable: true,
                    },
                    {
                        id: 2,
                        name: "id_siswa",
                        display: "Siswa",
                        type: "select",
                        value: [
                            (
                                await Siswa.find()
                                    .select("nisn nama_lengkap id_rombel id_tahun_masuk")
                                    .populate({ path: "id_rombel", select: "rombel", model: Rombel })
                                    .populate({ path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk })
                                    .sort({ nisn: 1 })
                                    .lean()
                            ).map((itemObject: any) => {
                                return [
                                    itemObject._id,
                                    `${itemObject.nisn} - ${itemObject.nama_lengkap} - ${itemObject.id_rombel.rombel} - ${itemObject.id_tahun_masuk.tahun_masuk}`,
                                ];
                            }),
                            itemObject.id_siswa,
                            (await Anggota.find().select("id_siswa").lean()).map((itemObject: any) => {
                                return itemObject.id_siswa;
                            }),
                        ],
                        placeholder: "Input siswa disini",
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
        const dataExist = await Anggota.exists({ _id: id }).lean();

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Anggota.updateOne(
                        { _id: id },
                        {
                            ...attributeArray,

                            diubah: new Date(),
                        }
                    ).lean();
                    res.redirect(`update?id=${id}&response=success`);
                } catch (error: any) {
                    if (error.code == 11000) {
                        if (error.keyPattern.id_siswa) {
                            res.redirect(`update?id=${id}&response=error&text=Siswa sudah digunakan`);
                        }
                    } else {
                        res.redirect(`update?id=${id}&response=error`);
                    }
                }
            } else if (inputArray.includes(undefined)) {
                res.redirect(`update?id=${id}&response=error&text=Data tidak lengkap`);
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });

perpustakaanAnggotaRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Anggota.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject: any = await Anggota.findOne({ _id: id })
                .select("nomor_anggota id_siswa")
                .populate({
                    path: "id_siswa",
                    select: "nisn nama_lengkap id_rombel id_tahun_masuk",
                    populate: [
                        { path: "id_rombel", select: "rombel", model: Rombel },
                        { path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk },
                    ],
                    model: Siswa,
                })
                .lean();

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
                        name: "nomor_anggota",
                        display: "Nomor Anggota",
                        type: "text",
                        value: itemObject.nomor_anggota,
                        placeholder: "Input nomor anggota disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "id_siswa",
                        display: "Siswa",
                        type: "select",
                        value: `${itemObject.id_siswa.nisn} - ${itemObject.id_siswa.nama_lengkap} - ${itemObject.id_siswa.id_rombel.rombel} - ${itemObject.id_siswa.id_tahun_masuk.tahun_masuk}`,
                        placeholder: "Input siswa disini",
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
        const dataExist = await Anggota.exists({ _id: id }).lean();

        if (dataExist != null) {
            const dataIsUsed = await Peminjaman.exists({ id_anggota: id }).lean();

            if (dataIsUsed == null) {
                try {
                    await Anggota.deleteOne({ _id: id }).lean();
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
