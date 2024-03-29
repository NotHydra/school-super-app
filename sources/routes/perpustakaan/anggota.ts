import express, { Router } from "express";

import { headTitle } from ".";

import { Anggota, Keterangan, Peminjaman, Rombel, Siswa, TahunAjaran, TahunMasuk } from "../../models";

export const perpustakaanAnggotaRouter = Router();

const navActive = [9, 2];
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
        value: ["id_siswa", "id_rombel", "rombelFull"],
        type: "text",
    },
    {
        id: 5,
        label: "Tahun Ajaran",
        value: ["id_siswa", "id_tahun_ajaran", "tahun_ajaran"],
        type: "text",
    },
    {
        id: 6,
        label: "Tahun Masuk",
        value: ["id_siswa", "id_tahun_masuk", "tahun_masuk"],
        type: "text",
    },
    {
        id: 7,
        label: "Status",
        value: ["id_siswa", "aktifStatus"],
        type: "text",
    },
    {
        id: 8,
        label: "Keterangan",
        value: ["id_siswa", "id_keterangan", "keterangan"],
        type: "text",
    },
];

perpustakaanAnggotaRouter.use(express.static("sources/public"));
perpustakaanAnggotaRouter.use(express.urlencoded({ extended: false }));

perpustakaanAnggotaRouter.route("/").get(async (req, res) => {
    const typeValue: any = req.query.type;
    const anggotaValue: any = req.query.anggota;

    const rombelValue: any = req.query.rombel;
    const tahunAjaranValue: any = req.query.tahunAjaran;
    const tahunMasukValue: any = req.query.tahunMasuk;
    const aktifValue: any = req.query.aktif;
    const keteranganValue: any = req.query.keterangan;
    let filterValue = {};

    if (anggotaValue != undefined && !isNaN(anggotaValue)) {
        filterValue = { ...filterValue, _id: anggotaValue };
    }

    let tableItemArray = await Anggota.find(filterValue)
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
        .sort({ nomor_anggota: 1 })
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

    tableItemArray = tableItemArray.map((tableItemObject: any) => {
        tableItemObject.id_siswa.id_rombel.rombelFull = `${tableItemObject.id_siswa.id_rombel.rombel} ${tableItemObject.id_siswa.id_rombel.id_tahun_ajaran.tahun_ajaran}`;
        tableItemObject.id_siswa.aktifStatus = tableItemObject.id_siswa.aktif == true ? "Aktif" : "Tidak Aktif";

        return tableItemObject;
    });

    const documentCount = await Anggota.countDocuments().lean();
    res.render("pages/perpustakaan/anggota/table", {
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
                        .select("rombel id_tahun_ajaran")
                        .populate({ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran })
                        .sort({ rombel: 1 })
                        .lean()
                )
                    .sort((a: any, b: any) => {
                        return b.id_tahun_ajaran.tahun_ajaran - a.id_tahun_ajaran.tahun_ajaran;
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
        ],
        tableAttributeArray,
        tableItemArray,
        typeValue,
        anggotaValue,
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
                                .select("nisn nama_lengkap id_rombel id_tahun_masuk aktif id_keterangan")
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
                                return b.id_rombel.id_tahun_ajaran.tahun_ajaran.localeCompare(a.id_rombel.id_tahun_ajaran.tahun_ajaran);
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
                _id: (await Anggota.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

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

        const typeValue: any = req.query.type;
        const anggotaValue: any = req.query.anggota;

        let queryString = "";

        if (typeValue == "peminjaman") {
            queryString = `&type=${typeValue}&anggota=${anggotaValue}`;
        }

        const dataExist = await Anggota.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Anggota.findOne({ _id: id }).select("nomor_anggota id_siswa").lean();

            res.render("pages/perpustakaan/anggota/update", {
                headTitle,
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Diubah" : "Data Gagal Diubah",
                toastText: req.query.text,
                id,
                typeValue,
                anggotaValue,
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
                                    .select("nisn nama_lengkap id_rombel id_tahun_masuk aktif id_keterangan")
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
                                    return b.id_rombel.id_tahun_ajaran.tahun_ajaran.localeCompare(a.id_rombel.id_tahun_ajaran.tahun_ajaran);
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
            res.redirect(`./?response=error&text=Data tidak valid${queryString}`);
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Anggota.exists({ _id: id }).lean();

        const typeValue: any = req.query.type;
        const anggotaValue: any = req.query.anggota;

        let queryString = "";

        if (typeValue == "peminjaman") {
            queryString = `&type=${typeValue}&anggota=${anggotaValue}`;
        }

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
                    res.redirect(`update?id=${id}&response=success${queryString}`);
                } catch (error: any) {
                    if (error.code == 11000) {
                        if (error.keyPattern.id_siswa) {
                            res.redirect(`update?id=${id}&response=error&text=Siswa sudah digunakan${queryString}`);
                        }
                    } else {
                        res.redirect(`update?id=${id}&response=error${queryString}`);
                    }
                }
            } else if (inputArray.includes(undefined)) {
                res.redirect(`update?id=${id}&response=error&text=Data tidak lengkap${queryString}`);
            }
        } else if (dataExist == null) {
            res.redirect(`./?response=error&text=Data tidak valid${queryString}`);
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
                        value: `${itemObject.id_siswa.nisn} - ${itemObject.id_siswa.nama_lengkap} - ${itemObject.id_siswa.id_rombel.rombel} ${
                            itemObject.id_siswa.id_rombel.id_tahun_ajaran.tahun_ajaran
                        } - Tahun Ajaran ${itemObject.id_siswa.id_tahun_ajaran.tahun_ajaran} - Tahun Masuk ${itemObject.id_siswa.id_tahun_masuk.tahun_masuk} - ${
                            itemObject.id_siswa.aktif == true
                                ? "Aktif"
                                : "Tidak Aktif" + (itemObject.id_siswa.id_keterangan.keterangan == "-" ? "" : " - " + itemObject.id_siswa.id_keterangan.keterangan)
                        }`,
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
