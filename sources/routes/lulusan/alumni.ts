import express, { Router } from "express";

import { headTitle } from ".";

import { Alumni, Keterangan, Pendidikan, Rombel, Siswa, TahunAjaran, TahunLulus, TahunMasuk, Universitas } from "../../models";

export const lulusanAlumniRouter = Router();

const navActive = [6, 2];
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
        label: "Tahun Lulus",
        value: ["id_tahun_lulus", "tahun_lulus"],
        type: "text",
    },
    {
        id: 7,
        label: "Universitas",
        value: ["id_universitas", "universitas"],
        type: "text",
    },
    {
        id: 8,
        label: "Pendidikan",
        value: ["id_pendidikan", "singkatan"],
        type: "text",
    },
    {
        id: 9,
        label: "Pekerjaan",
        value: ["pekerjaan"],
        type: "text",
    },
];

lulusanAlumniRouter.use(express.static("sources/public"));
lulusanAlumniRouter.use(express.urlencoded({ extended: false }));

lulusanAlumniRouter.route("/").get(async (req, res) => {
    const rombelValue: any = req.query.rombel;
    const tahunAjaranValue: any = req.query.tahunAjaran;
    const tahunMasukValue: any = req.query.tahunMasuk;
    const tahunLulusValue: any = req.query.tahunLulus;
    const universitasValue: any = req.query.universitas;
    const pendidikanValue: any = req.query.pendidikan;
    let filterValue = {};

    if (tahunLulusValue != undefined && !isNaN(tahunLulusValue)) {
        filterValue = { ...filterValue, id_tahun_lulus: tahunLulusValue };
    }

    if (universitasValue != undefined && !isNaN(universitasValue)) {
        filterValue = { ...filterValue, id_universitas: universitasValue };
    }

    if (pendidikanValue != undefined && !isNaN(pendidikanValue)) {
        filterValue = { ...filterValue, id_pendidikan: pendidikanValue };
    }

    let tableItemArray: any = (
        await Alumni.find(filterValue)
            .populate({
                path: "id_siswa",
                select: "nisn nama_lengkap id_rombel id_tahun_ajaran id_tahun_masuk",
                populate: [
                    {
                        path: "id_rombel",
                        select: "rombel id_tahun_ajaran",
                        populate: [{ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran }],
                        model: Rombel,
                    },
                    { path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran },
                    { path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk },
                ],
                model: Siswa,
            })
            .populate({
                path: "id_tahun_lulus",
                select: "tahun_lulus",
                model: TahunLulus,
            })
            .populate({
                path: "id_universitas",
                select: "universitas",
                model: Universitas,
            })
            .populate({
                path: "id_pendidikan",
                select: "singkatan",
                model: Pendidikan,
            })
            .lean()
    )
        .sort((a: any, b: any) => {
            return a.id_siswa.nisn - b.id_siswa.nisn;
        })
        .sort((a: any, b: any) => {
            return b.id_siswa.id_rombel.id_tahun_ajaran.tahun_ajaran.localeCompare(a.id_siswa.id_rombel.id_tahun_ajaran.tahun_ajaran);
        });

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

    tableItemArray = tableItemArray.map((tableItemObject: any) => {
        tableItemObject.id_siswa.id_rombel.rombelFull = `${tableItemObject.id_siswa.id_rombel.rombel} ${tableItemObject.id_siswa.id_rombel.id_tahun_ajaran.tahun_ajaran}`;

        return tableItemObject;
    });

    const documentCount = await Alumni.countDocuments().lean();
    res.render("pages/lulusan/alumni/table", {
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
                        title: "Alumni",
                        icon: "user-graduate",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value:
                            documentCount >= 1
                                ? (
                                      (await Alumni.findOne()
                                          .select("id_siswa")
                                          .populate({ path: "id_siswa", select: "nama_lengkap", model: Siswa })
                                          .sort({ dibuat: -1 })
                                          .lean()) as any
                                  ).id_siswa.nama_lengkap
                                : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value:
                            documentCount >= 1
                                ? (
                                      (await Alumni.findOne()
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
                display: "Tahun Lulus",
                name: "tahun_lulus",
                query: "tahunLulus",
                placeholder: "Pilih tahun lulus",
                value: tahunLulusValue,
                option: (await TahunLulus.find().select("tahun_lulus").sort({ tahun_lulus: -1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.tahun_lulus,
                    };
                }),
            },
            {
                id: 5,
                display: "Universitas",
                name: "universitas",
                query: "universitas",
                placeholder: "Pilih universitas",
                value: universitasValue,
                option: (await Universitas.find().select("universitas").sort({ universitas: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.universitas,
                    };
                }),
            },
            {
                id: 6,
                display: "Pendidikan",
                name: "pendidikan",
                query: "pendidikan",
                placeholder: "Pilih pendidikan",
                value: pendidikanValue,
                option: (await Pendidikan.find().select("pendidikan singkatan").sort({ pendidikan: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: `${itemObject.pendidikan} - ${itemObject.singkatan}`,
                    };
                }),
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

lulusanAlumniRouter
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
                        (await Alumni.find().select("id_siswa").lean()).map((itemObject: any) => {
                            return itemObject.id_siswa;
                        }),
                    ],
                    placeholder: "Input siswa disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "id_tahun_lulus",
                    display: "Tahun Lulus",
                    type: "select",
                    value: [
                        (await TahunLulus.find().select("tahun_lulus").sort({ tahun_lulus: -1 }).lean()).map((itemObject) => {
                            return [itemObject._id, itemObject.tahun_lulus];
                        }),
                        null,
                    ],
                    placeholder: "Input tahun lulus disini",
                    enable: true,
                },
                {
                    id: 3,
                    name: "id_universitas",
                    display: "Universitas",
                    type: "select",
                    value: [
                        (await Universitas.find().select("universitas").sort({ universitas: 1 }).lean()).map((itemObject) => {
                            return [itemObject._id, itemObject.universitas];
                        }),
                        null,
                    ],
                    placeholder: "Input universitas disini",
                    enable: true,
                },
                {
                    id: 4,
                    name: "id_pendidikan",
                    display: "Pendidikan",
                    type: "select",
                    value: [
                        (await Pendidikan.find().select("pendidikan singkatan").sort({ pendidikan: 1 }).lean()).map((itemObject) => {
                            return [itemObject._id, `${itemObject.pendidikan} - ${itemObject.singkatan}`];
                        }),
                        null,
                    ],
                    placeholder: "Input pendidikan disini",
                    enable: true,
                },
                {
                    id: 5,
                    name: "pekerjaan",
                    display: "Pekerjaan",
                    type: "text",
                    value: null,
                    placeholder: "Input pekerjaan disini",
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
            const itemObject = new Alumni({
                _id: (await Alumni.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

                ...attributeArray,

                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await itemObject.save();

                await Siswa.updateOne(
                    { id: itemObject.id_siswa },
                    {
                        aktif: false,
                        id_keterangan: 3,

                        diubah: new Date(),
                    }
                );

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

lulusanAlumniRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Alumni.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject: any = await Alumni.findOne({ _id: id })
                .select("id_siswa id_tahun_lulus id_universitas id_pendidikan pekerjaan")
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
                        name: "id_tahun_lulus",
                        display: "Tahun Lulus",
                        type: "select",
                        value: [
                            (await TahunLulus.find().select("tahun_lulus").sort({ tahun_lulus: -1 }).lean()).map((itemObject) => {
                                return [itemObject._id, itemObject.tahun_lulus];
                            }),
                            itemObject.id_tahun_lulus,
                        ],
                        placeholder: "Input tahun lulus disini",
                        enable: true,
                    },
                    {
                        id: 3,
                        name: "id_universitas",
                        display: "Universitas",
                        type: "select",
                        value: [
                            (await Universitas.find().select("universitas").sort({ universitas: 1 }).lean()).map((itemObject) => {
                                return [itemObject._id, itemObject.universitas];
                            }),
                            itemObject.id_universitas,
                        ],
                        placeholder: "Input universitas disini",
                        enable: true,
                    },
                    {
                        id: 4,
                        name: "id_pendidikan",
                        display: "Pendidikan",
                        type: "select",
                        value: [
                            (await Pendidikan.find().select("pendidikan singkatan").sort({ pendidikan: 1 }).lean()).map((itemObject) => {
                                return [itemObject._id, `${itemObject.pendidikan} - ${itemObject.singkatan}`];
                            }),
                            itemObject.id_pendidikan,
                        ],
                        placeholder: "Input pendidikan disini",
                        enable: true,
                    },
                    {
                        id: 5,
                        name: "pekerjaan",
                        display: "Pekerjaan",
                        type: "text",
                        value: itemObject.pekerjaan,
                        placeholder: "Input pekerjaan disini",
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
        const dataExist = await Alumni.exists({ _id: id }).lean();

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.filter((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                if (attributeCurrent != "id_siswa") {
                    attributeArray[attributeCurrent] = req.body[attributeCurrent];

                    return req.body[attributeCurrent];
                }
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Alumni.updateOne(
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

lulusanAlumniRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Alumni.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject: any = await Alumni.findOne({ _id: id })
                .select("id_siswa id_tahun_lulus id_universitas id_pendidikan pekerjaan")
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
                    path: "id_tahun_lulus",
                    select: "tahun_lulus",
                })
                .populate({
                    path: "id_universitas",
                    select: "universitas",
                    model: Universitas,
                })
                .populate({
                    path: "id_pendidikan",
                    select: "pendidikan singkatan",
                    model: Pendidikan,
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
                        name: "id_tahun_lulus",
                        display: "Tahun Lulus",
                        type: "number",
                        value: itemObject.id_tahun_lulus.tahun_lulus,
                        placeholder: "Input tahun lulus disini",
                        enable: false,
                    },
                    {
                        id: 3,
                        name: "id_universitas",
                        display: "Universitas",
                        type: "text",
                        value: itemObject.id_universitas.universitas,
                        placeholder: "Input universitas disini",
                        enable: false,
                    },
                    {
                        id: 4,
                        name: "id_pendidikan",
                        display: "Pendidikan",
                        type: "text",
                        value: `${itemObject.id_pendidikan.pendidikan} - ${itemObject.id_pendidikan.singkatan}`,
                        placeholder: "Input pendidikan disini",
                        enable: false,
                    },
                    {
                        id: 5,
                        name: "pekerjaan",
                        display: "Pekerjaan",
                        type: "text",
                        value: itemObject.pekerjaan,
                        placeholder: "Input pekerjaan disini",
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
        const dataExist: any = await Alumni.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Alumni.findOne({ _id: id }).select("id_siswa").lean();

            try {
                await Alumni.deleteOne({ _id: id }).lean();

                await Siswa.updateOne(
                    { _id: itemObject.id_siswa },
                    {
                        aktif: true,
                        id_keterangan: 1,

                        diubah: new Date(),
                    }
                );

                res.redirect("./?response=success");
            } catch (error: any) {
                res.redirect(`delete?id=${id}&response=error`);
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
