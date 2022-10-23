import express, { Router } from "express";

import { headTitle } from ".";

import { localMoment } from "../../utility";

import { Anggota, Buku, Peminjaman, Pengembalian, Petugas, Rombel, Siswa, TahunMasuk } from "../../models";

export const perpustakaanPengembalianRouter = Router();

const navActive = [6, 8];
const tableAttributeArray = [
    {
        id: 1,
        label: "Anggota",
        value: ["id_peminjaman", "id_anggota", "nomor_anggota"],
        type: "text",
    },
    {
        id: 2,
        label: "Tanggal Peminjaman",
        value: ["id_peminjaman", "tanggal_peminjaman"],
        type: "date",
    },
    {
        id: 3,
        label: "Durasi Peminjaman",
        value: ["id_peminjaman", "durasi_peminjaman"],
        type: "date",
    },
    {
        id: 4,
        label: "Petugas",
        value: ["id_petugas", "nama"],
        type: "text",
    },
    {
        id: 5,
        label: "Tanggal Pengembalian",
        value: ["tanggal_pengembalian"],
        type: "date",
    },
    {
        id: 6,
        label: "Denda",
        value: ["denda"],
        type: "text",
    },
];

perpustakaanPengembalianRouter.use(express.static("sources/public"));
perpustakaanPengembalianRouter.use(express.urlencoded({ extended: false }));

perpustakaanPengembalianRouter.route("/").get(async (req, res) => {
    const tableItemArray = await Pengembalian.find()
        .populate({
            path: "id_peminjaman",
            select: "id_anggota tanggal_peminjaman durasi_peminjaman",
            populate: [{ path: "id_anggota", select: "nomor_anggota", model: Anggota }],
            model: Peminjaman,
        })
        .populate({
            path: "id_petugas",
            select: "nama",
            model: Petugas,
        })
        .sort({ dibuat: -1 });

    const documentCount = await Pengembalian.countDocuments();
    const latestDibuat: any = await Pengembalian.findOne()
        .select("id_peminjaman")
        .populate({
            path: "id_peminjaman",
            select: "id_anggota",
            populate: [{ path: "id_anggota", select: "nomor_anggota", model: Anggota }],
            model: Peminjaman,
        })
        .sort({ dibuat: -1 })
        .lean();

    const latestDiubah: any = await Pengembalian.findOne()
        .select("id_peminjaman")
        .populate({
            path: "id_peminjaman",
            select: "id_anggota",
            populate: [{ path: "id_anggota", select: "nomor_anggota", model: Anggota }],
            model: Peminjaman,
        })
        .sort({ diubah: -1 })
        .lean();

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
                        title: "Pengembalian",
                        icon: "list-check",
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
                        value: documentCount >= 1 ? latestDibuat.id_peminjaman.id_anggota.nomor_anggota : "Tidak Ada",
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
                        value: documentCount >= 1 ? latestDiubah.id_peminjaman.id_anggota.nomor_anggota : "Tidak Ada",
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

perpustakaanPengembalianRouter
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
                    name: "id_peminjaman",
                    display: "Peminjaman",
                    type: "select",
                    value: [
                        (
                            await Peminjaman.find()
                                .select("id_anggota tanggal_peminjaman durasi_peminjaman")
                                .populate({ path: "id_anggota", select: "nomor_anggota", model: Anggota })
                                .sort({ dibuat: -1 })
                        ).map((peminjamanObject: any) => {
                            return [
                                peminjamanObject._id,
                                `${peminjamanObject.id_anggota.nomor_anggota} - Tanggal Peminjaman ${localMoment(peminjamanObject.tanggal_peminjaman).format(
                                    "YYYY-MM-DD"
                                )} - Durasi Peminjaman ${localMoment(peminjamanObject.durasi_peminjaman).format("YYYY-MM-DD")}`,
                            ];
                        }),
                        null,
                    ],
                    placeholder: "Input peminjaman disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "id_petugas",
                    display: "Petugas",
                    type: "select",
                    value: [
                        (await Petugas.find().select("nama").sort({ nama: 1 })).map((petugasObject: any) => {
                            return [petugasObject._id, petugasObject.nama];
                        }),
                        null,
                    ],
                    placeholder: "Input petugas disini",
                    enable: true,
                },
                {
                    id: 3,
                    name: "tanggal_pengembalian",
                    display: "Tanggal Pengembalian",
                    type: "date",
                    value: null,
                    placeholder: "Input tanggal pengembalian disini",
                    enable: true,
                },
                {
                    id: 4,
                    name: "denda",
                    display: "Denda",
                    type: "number",
                    value: null,
                    placeholder: "Input denda disini",
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
            const itemObject = new Pengembalian({
                _id: (await Pengembalian.findOne().sort({ _id: -1 }))?._id + 1 || 1,

                ...attributeArray,

                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await itemObject.save();

                const bukuArray = (await Peminjaman.findOne({ _id: itemObject.id_peminjaman }).select("buku").lean()).buku;

                bukuArray.forEach(async (bukuObject: any) => {
                    const currentStockBuku = (await Buku.findOne({ _id: bukuObject._id }).select("stok").lean()).stok;

                    const calculatedStockBuku: number = currentStockBuku + bukuObject.kuantitas;

                    await Buku.updateOne({ _id: bukuObject._id }, { stok: calculatedStockBuku, diubah: new Date() });
                });

                res.redirect("create?response=success");
            } catch (error: any) {
                if (error.code == 11000) {
                    res.redirect("create?response=error&text=Peminjaman sudah digunakan");
                } else {
                    res.redirect("create?response=error");
                }
            }
        } else if (inputArray.includes(undefined)) {
            res.redirect("create?response=error&text=Data tidak lengkap");
        }
    });

perpustakaanPengembalianRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Pengembalian.exists({ _id: id });

        if (dataExist != null) {
            const itemObject: any = await Pengembalian.findOne({ _id: id }).populate({
                path: "id_peminjaman",
                select: "id_anggota tanggal_peminjaman durasi_peminjaman",
                populate: [{ path: "id_anggota", select: "nomor_anggota", model: Anggota }],
                model: Peminjaman,
            });

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
                        name: "id_peminjaman",
                        display: "Peminjaman",
                        type: "text",
                        value: `${itemObject.id_peminjaman.id_anggota.nomor_anggota} - Tanggal Peminjaman ${localMoment(
                            itemObject.id_peminjaman.tanggal_peminjaman
                        ).format("YYYY-MM-DD")} - Durasi Peminjaman ${localMoment(itemObject.id_peminjaman.durasi_peminjaman).format("YYYY-MM-DD")}`,
                        placeholder: "Input peminjaman disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "id_petugas",
                        display: "Petugas",
                        type: "select",
                        value: [
                            (await Petugas.find().select("nama").sort({ nama: 1 })).map((petugasObject: any) => {
                                return [petugasObject._id, petugasObject.nama];
                            }),
                            itemObject.id_petugas,
                        ],
                        placeholder: "Input petugas disini",
                        enable: true,
                    },
                    {
                        id: 3,
                        name: "tanggal_pengembalian",
                        display: "Tanggal Pengembalian",
                        type: "date",
                        value: itemObject.tanggal_pengembalian,
                        placeholder: "Input tanggal pengembalian disini",
                        enable: true,
                    },
                    {
                        id: 4,
                        name: "denda",
                        display: "Denda",
                        type: "number",
                        value: itemObject.denda,
                        placeholder: "Input denda disini",
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
        const dataExist = await Pengembalian.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Pengembalian.updateOne(
                        { _id: id },
                        {
                            ...attributeArray,

                            diubah: new Date(),
                        }
                    );
                    res.redirect(`update?id=${id}&response=success`);
                } catch (error: any) {
                    if (error.code == 11000) {
                        res.redirect(`update?id=${id}&response=error&text=Peminjaman sudah digunakan`);
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

perpustakaanPengembalianRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Pengembalian.exists({ _id: id });

        if (dataExist != null) {
            const itemObject: any = await Pengembalian.findOne({ _id: id })
                .populate({
                    path: "id_peminjaman",
                    select: "id_anggota tanggal_peminjaman durasi_peminjaman",
                    populate: [{ path: "id_anggota", select: "nomor_anggota", model: Anggota }],
                    model: Peminjaman,
                })
                .populate({
                    path: "id_petugas",
                    select: "nama",
                    model: Petugas,
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
                        name: "id_peminjaman",
                        display: "Peminjaman",
                        type: "text",
                        value: `${itemObject.id_peminjaman.id_anggota.nomor_anggota} - Tanggal Peminjaman ${localMoment(
                            itemObject.id_peminjaman.tanggal_peminjaman
                        ).format("YYYY-MM-DD")} - Durasi Peminjaman ${localMoment(itemObject.id_peminjaman.durasi_peminjaman).format("YYYY-MM-DD")}`,
                        placeholder: "Input peminjaman disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "id_petugas",
                        display: "Petugas",
                        type: "text",
                        value: itemObject.id_petugas.nama,
                        placeholder: "Input petugas disini",
                        enable: false,
                    },
                    {
                        id: 3,
                        name: "tanggal_pengembalian",
                        display: "Tanggal Pengembalian",
                        type: "date",
                        value: itemObject.tanggal_pengembalian,
                        placeholder: "Input tanggal pengembalian disini",
                        enable: false,
                    },
                    {
                        id: 4,
                        name: "denda",
                        display: "Denda",
                        type: "number",
                        value: itemObject.denda,
                        placeholder: "Input denda disini",
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
        const dataExist = await Pengembalian.exists({ _id: id });

        if (dataExist != null) {
            try {
                const bukuArray = (
                    await Peminjaman.findOne({ _id: (await Pengembalian.findOne({ _id: id }).select("id_peminjaman").lean()).id_peminjaman })
                        .select("buku")
                        .lean()
                ).buku;

                bukuArray.forEach(async (bukuObject: any) => {
                    const currentStockBuku = (await Buku.findOne({ _id: bukuObject._id }).select("stok").lean()).stok;

                    const calculatedStockBuku: number = currentStockBuku - bukuObject.kuantitas;

                    await Buku.updateOne({ _id: bukuObject._id }, { stok: calculatedStockBuku, diubah: new Date() });
                });

                await Pengembalian.deleteOne({ _id: id });

                res.redirect("./?response=success");
            } catch (error) {
                res.redirect(`delete?id=${id}&response=error`);
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });