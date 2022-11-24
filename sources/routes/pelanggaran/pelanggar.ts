import express, { Router } from "express";

import { headTitle } from ".";

import { Keterangan, Klasifikasi, Pelanggar, Rombel, Siswa, TahunAjaran, TahunMasuk, Tipe } from "../../models";

export const pelanggaranPelanggarRouter = Router();

const navActive = [12, 2];
const tableAttributeArray = [
    {
        id: 1,
        label: "NISN",
        value: ["id_siswa", "nisn"],
        type: "text",
    },
    {
        id: 2,
        label: "Nama Lengkap",
        value: ["id_siswa", "nama_lengkap"],
        type: "text",
    },
    {
        id: 3,
        label: "Rombel",
        value: ["id_siswa", "id_rombel", "rombelFull"],
        type: "text",
    },
    {
        id: 4,
        label: "Tahun Ajaran",
        value: ["id_siswa", "id_tahun_ajaran", "tahun_ajaran"],
        type: "text",
    },
    {
        id: 5,
        label: "Tahun Masuk",
        value: ["id_siswa", "id_tahun_masuk", "tahun_masuk"],
        type: "text",
    },
    {
        id: 6,
        label: "Status",
        value: ["id_siswa", "aktifStatus"],
        type: "text",
    },
    {
        id: 7,
        label: "Keterangan",
        value: ["id_siswa", "id_keterangan", "keterangan"],
        type: "text",
    },
    {
        id: 8,
        label: "Tipe",
        value: ["id_klasifikasi", "id_tipe", "tipe"],
        type: "text",
    },
    {
        id: 9,
        label: "Klasifikasi",
        value: ["id_klasifikasi", "klasifikasi"],
        type: "text",
    },
];

pelanggaranPelanggarRouter.use(express.static("sources/public"));
pelanggaranPelanggarRouter.use(express.urlencoded({ extended: false }));

pelanggaranPelanggarRouter.route("/").get(async (req, res) => {
    const rombelValue: any = req.query.rombel;
    const tahunAjaranValue: any = req.query.tahunAjaran;
    const tahunMasukValue: any = req.query.tahunMasuk;
    const aktifValue: any = req.query.aktif;
    const keteranganValue: any = req.query.keterangan;
    const tipeValue: any = req.query.tipe;
    const klasifikasiValue: any = req.query.klasifikasi;
    let filterValue = {};

    let tableItemArray = await Pelanggar.find(filterValue)
        .populate({
            path: "id_siswa",
            select: "nisn nama_lengkap id_rombel id_tahun_ajaran id_tahun_masuk aktif id_keterangan",
            populate: [
                {
                    path: "id_rombel",
                    select: "rombel id_tahun_ajaran",
                    populate: [{ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran }],
                    model: Rombel,
                },
                { path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran },
                { path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk },
                { path: "id_keterangan", select: "keterangan", model: Keterangan },
            ],
            model: Siswa,
        })
        .populate({
            path: "id_klasifikasi",
            select: "id_tipe klasifikasi",
            populate: [{ path: "id_tipe", select: "tipe", model: Tipe }],
            model: Klasifikasi,
        })
        .sort({ dibuat: -1 })
        .lean();

    if (rombelValue != undefined && !isNaN(rombelValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_siswa.id_rombel._id == rombelValue) {
                return tableItemObject;
            }
        });
    }

    if (tahunAjaranValue != undefined && !isNaN(tahunAjaranValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_siswa.id_tahun_ajaran._id == tahunAjaranValue) {
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

    if (aktifValue != undefined) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (`${tableItemObject.id_siswa.aktif}` == aktifValue) {
                return tableItemObject;
            }
        });
    }

    if (keteranganValue != undefined && !isNaN(keteranganValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_siswa.id_keterangan._id == keteranganValue) {
                return tableItemObject;
            }
        });
    }

    if (tipeValue != undefined && !isNaN(tipeValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_klasifikasi.id_tipe._id == tipeValue) {
                return tableItemObject;
            }
        });
    }

    if (klasifikasiValue != undefined && !isNaN(klasifikasiValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_klasifikasi._id == klasifikasiValue) {
                return tableItemObject;
            }
        });
    }

    tableItemArray = tableItemArray.map((tableItemObject: any) => {
        tableItemObject.id_siswa.id_rombel.rombelFull = `${tableItemObject.id_siswa.id_rombel.rombel} ${tableItemObject.id_siswa.id_rombel.id_tahun_ajaran.tahun_ajaran}`;
        tableItemObject.id_siswa.aktifStatus = tableItemObject.id_siswa.aktif == true ? "Aktif" : "Tidak Aktif";

        return tableItemObject;
    });

    const documentCount = await Pelanggar.countDocuments().lean();
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
                        title: "Pelanggar",
                        icon: "user-slash",
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
                        value:
                            documentCount >= 1
                                ? (
                                      (await Pelanggar.findOne()
                                          .select("id_siswa")
                                          .populate({ path: "id_siswa", select: "nama_lengkap", model: Siswa })
                                          .sort({ dibuat: -1 })
                                          .lean()) as any
                                  ).id_siswa.nama_lengkap
                                : "Tidak Ada",
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
                        value:
                            documentCount >= 1
                                ? (
                                      (await Pelanggar.findOne()
                                          .select("id_siswa")
                                          .populate({ path: "id_siswa", select: "nama_lengkap", model: Siswa })
                                          .sort({ diubah: -1 })
                                          .lean()) as any
                                  ).id_siswa.nama_lengkap
                                : "Tidak Ada",
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
                        .select("rombel id_tahun_ajaran")
                        .populate({ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran })
                        .sort({ rombel: 1 })
                        .lean()
                )
                    .sort((a: any, b: any) => {
                        return b.id_tahun_ajaran.tahun_ajaran.localeCompare(a.id_tahun_ajaran.tahun_ajaran);
                    })
                    .map((itemObject: any) => {
                        return {
                            value: itemObject._id,
                            display: `${itemObject.rombel} ${itemObject.id_tahun_ajaran.tahun_ajaran}`,
                        };
                    }),
            },
            {
                id: 2,
                display: "Tahun Ajaran",
                name: "tahun_ajaran",
                query: "tahunAjaran",
                placeholder: "Pilih tahun ajaran",
                value: tahunAjaranValue,
                option: (await TahunAjaran.find().select("tahun_ajaran").sort({ tahun_ajaran: -1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.tahun_ajaran,
                    };
                }),
            },
            {
                id: 3,
                display: "Tahun Masuk",
                name: "tahun_masuk",
                query: "tahunMasuk",
                placeholder: "Pilih tahun masuk",
                value: tahunMasukValue,
                option: (await TahunMasuk.find().select("tahun_masuk").sort({ tahun_masuk: -1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.tahun_masuk,
                    };
                }),
            },
            {
                id: 4,
                display: "Status",
                name: "aktif",
                query: "aktif",
                placeholder: "Pilih status",
                value: aktifValue,
                option: [
                    {
                        value: "true",
                        display: "Aktif",
                    },
                    {
                        value: "false",
                        display: "Tidak Aktif",
                    },
                ],
            },
            {
                id: 5,
                display: "Keterangan",
                name: "keterangan",
                query: "keterangan",
                placeholder: "Pilih keterangan",
                value: keteranganValue,
                option: (await Keterangan.find().select("keterangan").sort({ keterangan: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.keterangan,
                    };
                }),
            },
            {
                id: 6,
                display: "Tipe",
                name: "tipe",
                query: "tipe",
                placeholder: "Pilih tipe",
                value: tipeValue,
                option: (await Tipe.find().select("tipe").sort({ tipe: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.tipe,
                    };
                }),
            },
            {
                id: 7,
                display: "Klasifikasi",
                name: "klasifikasi",
                query: "klasifikasi",
                placeholder: "Pilih klasifikasi",
                value: klasifikasiValue,
                option: (
                    await Klasifikasi.find(tipeValue != undefined && !isNaN(tipeValue) ? { id_tipe: tipeValue } : {})
                        .select("id_tipe klasifikasi")
                        .populate({ path: "id_tipe", select: "tipe", model: Tipe })
                        .sort({ klasifikasi: 1 })
                        .lean()
                )
                    .sort((a: any, b: any) => {
                        return a.id_tipe.tipe.localeCompare(b.id_tipe.tipe);
                    })
                    .map((itemObject: any) => {
                        return {
                            value: itemObject._id,
                            display: `Tipe ${itemObject.id_tipe.tipe} - ${itemObject.klasifikasi}`,
                        };
                    }),
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

pelanggaranPelanggarRouter
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
                    name: "id_siswa",
                    display: "Siswa",
                    type: "select",
                    value: [
                        (
                            await Siswa.find()
                                .select("nisn nama_lengkap id_rombel id_tahun_ajaran id_tahun_masuk aktif id_keterangan")
                                .populate({
                                    path: "id_rombel",
                                    select: "rombel id_tahun_ajaran",
                                    populate: [{ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran }],
                                    model: Rombel,
                                })
                                .populate({ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran })
                                .populate({ path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk })
                                .populate({ path: "id_keterangan", select: "keterangan", model: Keterangan })
                                .sort({ nisn: 1 })
                                .lean()
                        )
                            .sort((a: any, b: any) => {
                                return b.id_tahun_ajaran.tahun_ajaran.localeCompare(a.id_tahun_ajaran.tahun_ajaran);
                            })
                            .map((itemObject: any) => {
                                return [
                                    itemObject._id,
                                    `${itemObject.nisn} - ${itemObject.nama_lengkap} - ${itemObject.id_rombel.rombel} ${
                                        itemObject.id_rombel.id_tahun_ajaran.tahun_ajaran
                                    } - Tahun Ajaran ${itemObject.id_tahun_ajaran.tahun_ajaran} - Tahun Masuk ${itemObject.id_tahun_masuk.tahun_masuk} - ${
                                        itemObject.aktif == true
                                            ? "Aktif"
                                            : "Tidak Aktif" + (itemObject.id_keterangan.keterangan == "-" ? "" : " - " + itemObject.id_keterangan.keterangan)
                                    }`,
                                ];
                            }),
                        null,
                    ],
                    placeholder: "Input siswa disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "id_klasifikasi",
                    display: "Klasifikasi",
                    type: "select",
                    value: [
                        (
                            await Klasifikasi.find()
                                .select("id_tipe klasifikasi")
                                .populate({ path: "id_tipe", select: "tipe", model: Tipe })
                                .sort({ klasifikasi: 1 })
                                .lean()
                        )
                            .sort((a: any, b: any) => {
                                return a.id_tipe.tipe.localeCompare(b.id_tipe.tipe);
                            })
                            .map((itemObject: any) => {
                                return [itemObject._id, `Tipe ${itemObject.id_tipe.tipe} - ${itemObject.klasifikasi}`];
                            }),
                        null,
                    ],
                    placeholder: "Input klasifikasi disini",
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
            const itemObject = new Pelanggar({
                _id: (await Pelanggar.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

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

pelanggaranPelanggarRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Pelanggar.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Pelanggar.findOne({ _id: id }).select("id_siswa id_klasifikasi").lean();

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
                        name: "id_siswa",
                        display: "Siswa",
                        type: "select",
                        value: [
                            (
                                await Siswa.find()
                                    .select("nisn nama_lengkap id_rombel id_tahun_ajaran id_tahun_masuk aktif id_keterangan")
                                    .populate({
                                        path: "id_rombel",
                                        select: "rombel id_tahun_ajaran",
                                        populate: [{ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran }],
                                        model: Rombel,
                                    })
                                    .populate({ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran })
                                    .populate({ path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk })
                                    .populate({ path: "id_keterangan", select: "keterangan", model: Keterangan })
                                    .sort({ nisn: 1 })
                                    .lean()
                            )
                                .sort((a: any, b: any) => {
                                    return b.id_tahun_ajaran.tahun_ajaran.localeCompare(a.id_tahun_ajaran.tahun_ajaran);
                                })
                                .map((itemObject: any) => {
                                    return [
                                        itemObject._id,
                                        `${itemObject.nisn} - ${itemObject.nama_lengkap} - ${itemObject.id_rombel.rombel} ${
                                            itemObject.id_rombel.id_tahun_ajaran.tahun_ajaran
                                        } - Tahun Ajaran ${itemObject.id_tahun_ajaran.tahun_ajaran} - Tahun Masuk ${itemObject.id_tahun_masuk.tahun_masuk} - ${
                                            itemObject.aktif == true
                                                ? "Aktif"
                                                : "Tidak Aktif" + (itemObject.id_keterangan.keterangan == "-" ? "" : " - " + itemObject.id_keterangan.keterangan)
                                        }`,
                                    ];
                                }),
                            itemObject.id_siswa,
                        ],
                        placeholder: "Input siswa disini",
                        enable: true,
                    },
                    {
                        id: 2,
                        name: "id_klasifikasi",
                        display: "Klasifikasi",
                        type: "select",
                        value: [
                            (
                                await Klasifikasi.find()
                                    .select("id_tipe klasifikasi")
                                    .populate({ path: "id_tipe", select: "tipe", model: Tipe })
                                    .sort({ klasifikasi: 1 })
                                    .lean()
                            )
                                .sort((a: any, b: any) => {
                                    return a.id_tipe.tipe.localeCompare(b.id_tipe.tipe);
                                })
                                .map((itemObject: any) => {
                                    return [itemObject._id, `Tipe ${itemObject.id_tipe.tipe} - ${itemObject.klasifikasi}`];
                                }),
                            itemObject.id_klasifikasi,
                        ],
                        placeholder: "Input klasifikasi disini",
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
        const dataExist = await Pelanggar.exists({ _id: id }).lean();

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Pelanggar.updateOne(
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

pelanggaranPelanggarRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Pelanggar.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject: any = await Pelanggar.findOne({ _id: id })
                .select("id_siswa id_klasifikasi")
                .populate({
                    path: "id_siswa",
                    select: "nisn nama_lengkap id_rombel id_tahun_ajaran id_tahun_masuk aktif id_keterangan",
                    populate: [
                        {
                            path: "id_rombel",
                            select: "rombel id_tahun_ajaran",
                            populate: [{ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran }],
                            model: Rombel,
                        },
                        { path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran },
                        { path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk },
                        { path: "id_keterangan", select: "keterangan", model: Keterangan },
                    ],
                    model: Siswa,
                })
                .populate({
                    path: "id_klasifikasi",
                    select: "id_tipe klasifikasi",
                    populate: [{ path: "id_tipe", select: "tipe", model: Tipe }],
                    model: Klasifikasi,
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
                        name: "id_siswa",
                        display: "Siswa",
                        type: "text",
                        value: `${itemObject.id_siswa.nisn} - ${itemObject.id_siswa.nama_lengkap} - ${itemObject.id_siswa.id_rombel.rombel} ${
                            itemObject.id_siswa.id_rombel.id_tahun_ajaran.tahun_ajaran
                        } - Tahun Ajaran ${itemObject.id_siswa.id_tahun_ajaran.tahun_ajaran} - Tahun Masuk ${itemObject.id_siswa.id_tahun_masuk.tahun_masuk}  - ${
                            itemObject.id_siswa.aktif == true
                                ? "Aktif"
                                : "Tidak Aktif" + (itemObject.id_siswa.id_keterangan.keterangan == "-" ? "" : " - " + itemObject.id_siswa.id_keterangan.keterangan)
                        }`,
                        placeholder: "Input siswa disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "id_klasifikasi",
                        display: "Klasifikasi",
                        type: "text",
                        value: `Tipe ${itemObject.id_klasifikasi.id_tipe.tipe} - ${itemObject.id_klasifikasi.klasifikasi}`,
                        placeholder: "Input klasifikasi disini",
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
        const dataExist = await Pelanggar.exists({ _id: id }).lean();

        if (dataExist != null) {
            try {
                await Pelanggar.deleteOne({ _id: id }).lean();
                res.redirect("./?response=success");
            } catch (error: any) {
                res.redirect(`delete?id=${id}&response=error`);
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
