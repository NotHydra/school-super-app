import express, { Router } from "express";

import { headTitle } from ".";

import { Alumni, Keterangan, Klasifikasi, Pelanggar, Rombel, Siswa, TahunAjaran, TahunMasuk, Tipe } from "../../models";

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
        value: ["id_siswa", "id_rombel", "rombel"],
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
        label: "Tipe",
        value: ["id_klasifikasi", "id_tipe", "tipe"],
        type: "text",
    },
    {
        id: 7,
        label: "Klasifikasi",
        value: ["id_klasifikasi", "klasifikasi"],
        type: "text",
    },
];

pelanggaranPelanggarRouter.use(express.static("sources/public"));
pelanggaranPelanggarRouter.use(express.urlencoded({ extended: false }));

pelanggaranPelanggarRouter.route("/").get(async (req, res) => {
    const tableItemArray = await Pelanggar.find()
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
            path: "id_klasifikasi",
            select: "id_tipe klasifikasi",
            populate: [{ path: "id_tipe", select: "tipe", model: Tipe }],
            model: Klasifikasi,
        })
        .sort({ dibuat: -1 })
        .lean();

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
                    {
                        id: 2,
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
                    {
                        id: 3,
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
        filterArray: [],
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
