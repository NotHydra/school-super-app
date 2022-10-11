import express, { Router } from "express";

import { headTitle } from ".";

import { Alumni, Pendidikan, Rombel, Siswa, TahunLulus, TahunMasuk, Universitas } from "../../models";

export const lulusanAlumniRouter = Router();

const navActive = [3, 1];
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
        value: ["id_siswa", "id_rombel", "rombel"],
        type: "text",
    },
    {
        id: 4,
        label: "Tahun Masuk",
        value: ["id_siswa", "id_tahun_masuk", "tahun_masuk"],
        type: "text",
    },
    {
        id: 5,
        label: "Tahun Lulus",
        value: ["id_tahun_lulus", "tahun_lulus"],
        type: "text",
    },
    {
        id: 6,
        label: "Universitas",
        value: ["id_universitas", "universitas"],
        type: "text",
    },
    {
        id: 7,
        label: "Pendidikan",
        value: ["id_pendidikan", "singkatan"],
        type: "text",
    },
    {
        id: 8,
        label: "Pekerjaan",
        value: ["pekerjaan"],
        type: "text",
    },
];

lulusanAlumniRouter.use(express.static("sources/public"));
lulusanAlumniRouter.use(express.urlencoded({ extended: false }));

lulusanAlumniRouter.route("/").get(async (req, res) => {
    const tahunLulusValue: any = req.query.tahunLulus;

    const tableItemArray: any = await Alumni.find(tahunLulusValue != undefined && !isNaN(tahunLulusValue) ? { id_tahun_lulus: tahunLulusValue } : {})
        .populate({
            path: "id_siswa",
            select: "nisn nama_lengkap id_rombel id_tahun_masuk",
            populate: [
                { path: "id_rombel", select: "rombel", model: Rombel },
                { path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk },
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
            select: "singkatan",
            model: Pendidikan,
        });

    tableItemArray.sort((a: any, b: any) => {
        return a.id_siswa.nisn - b.id_siswa.nisn;
    });

    const documentCount = await Alumni.countDocuments();
    res.render("pages/lulusan/alumni/table", {
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
                                ? ((await Alumni.findOne().sort({ dibuat: -1 }).populate({ path: "id_siswa", select: "nama_lengkap", model: Siswa })) as any)
                                      .id_siswa.nama_lengkap
                                : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value:
                            documentCount >= 1
                                ? ((await Alumni.findOne().sort({ diubah: -1 }).populate({ path: "id_siswa", select: "nama_lengkap", model: Siswa })) as any)
                                      .id_siswa.nama_lengkap
                                : "Tidak Ada",
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
        tahunLulusValue,
        tahunLulusArray: await TahunLulus.find(),
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
                                .select("nisn nama_lengkap id_rombel id_tahun_masuk")
                                .populate({ path: "id_rombel", select: "rombel", model: Rombel })
                                .populate({ path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk })
                                .sort({ nisn: 1 })
                        ).map((siswaObject: any) => {
                            return [
                                siswaObject._id,
                                `${siswaObject.nisn} - ${siswaObject.nama_lengkap} - ${siswaObject.id_rombel.rombel} - ${siswaObject.id_tahun_masuk.tahun_masuk}`,
                            ];
                        }),
                        null,
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
                        (await TahunLulus.find().select("tahun_lulus").sort({ tahun_lulus: 1 })).map((tahunLulusObject) => {
                            return [tahunLulusObject._id, tahunLulusObject.tahun_lulus];
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
                        (await Universitas.find().select("universitas").sort({ universitas: 1 })).map((universitasObject) => {
                            return [universitasObject._id, universitasObject.universitas];
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
                        (await Pendidikan.find().select("pendidikan singkatan").sort({ pendidikan: 1 })).map((pendidikanObject) => {
                            return [pendidikanObject._id, `${pendidikanObject.pendidikan} - ${pendidikanObject.singkatan}`];
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
                _id: (await Alumni.findOne().sort({ _id: -1 }))._id + 1,

                ...attributeArray,

                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await itemObject.save();
                res.redirect("create?response=success");
            } catch (error: any) {
                if (error.code == 11000) {
                    res.redirect("create?response=error&text=Siswa sudah digunakan");
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
        const dataExist = await Alumni.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await Alumni.findOne({ _id: id });

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
                                    .select("nisn nama_lengkap id_rombel id_tahun_masuk")
                                    .populate({ path: "id_rombel", select: "rombel", model: Rombel })
                                    .populate({ path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk })
                                    .sort({ nisn: 1 })
                            ).map((siswaObject: any) => {
                                return [
                                    siswaObject._id,
                                    `${siswaObject.nisn} - ${siswaObject.nama_lengkap} - ${siswaObject.id_rombel.rombel} - ${siswaObject.id_tahun_masuk.tahun_masuk}`,
                                ];
                            }),
                            itemObject.id_siswa,
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
                            (await TahunLulus.find().select("tahun_lulus").sort({ tahun_lulus: 1 })).map((tahunLulusObject) => {
                                return [tahunLulusObject._id, tahunLulusObject.tahun_lulus];
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
                            (await Universitas.find().select("universitas").sort({ universitas: 1 })).map((universitasObject) => {
                                return [universitasObject._id, universitasObject.universitas];
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
                            (await Pendidikan.find().select("pendidikan singkatan").sort({ pendidikan: 1 })).map((pendidikanObject) => {
                                return [pendidikanObject._id, `${pendidikanObject.pendidikan} - ${pendidikanObject.singkatan}`];
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
        const dataExist = await Alumni.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Alumni.updateOne(
                        { _id: id },
                        {
                            ...attributeArray,

                            diubah: new Date(),
                        }
                    );

                    res.redirect(`update?id=${id}&response=success`);
                } catch (error: any) {
                    if (error.code == 11000) {
                        res.redirect(`update?id=${id}&response=error&text=Siswa sudah digunakan`);
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

lulusanAlumniRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Alumni.exists({ _id: id });

        if (dataExist != null) {
            const itemObject: any = await Alumni.findOne({ _id: id })
                .populate({
                    path: "id_siswa",
                    select: "nisn nama_lengkap id_rombel id_tahun_masuk",
                    populate: [
                        { path: "id_rombel", select: "rombel", model: Rombel },
                        { path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk },
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
                });

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
                        value: `${itemObject.id_siswa.nisn} - ${itemObject.id_siswa.nama_lengkap} - ${itemObject.id_siswa.id_rombel.rombel} - ${itemObject.id_siswa.id_tahun_masuk.tahun_masuk}`,
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
        const dataExist: any = await Alumni.exists({ _id: id });

        if (dataExist != null) {
            try {
                await Alumni.deleteOne({ _id: id });
                res.redirect("./?response=success");
            } catch (error) {
                res.redirect(`delete?id=${id}&response=error`);
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
