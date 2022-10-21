import express, { Router } from "express";

import { headTitle } from ".";

import { localMoment } from "../../utility";

import { Anggota, Buku, Kategori, Peminjaman, Penerbit, Pengembalian, Penulis, Petugas } from "../../models";

export const perpustakaanPeminjamanRouter = Router();

const navActive = [6, 7];
const tableAttributeArray = [
    {
        id: 1,
        label: "Anggota",
        value: ["id_anggota", "nomor_anggota"],
        type: "text",
    },
    {
        id: 2,
        label: "Petugas",
        value: ["id_petugas", "nama"],
        type: "text",
    },
    {
        id: 3,
        label: "Tanggal Peminjaman",
        value: ["tanggal_peminjaman"],
        type: "date",
    },
    {
        id: 4,
        label: "Durasi Peminjaman",
        value: ["durasi_peminjaman"],
        type: "date",
    },
    {
        id: 5,
        label: "Keterangan",
        value: ["keterangan"],
        type: "text",
    },
];

perpustakaanPeminjamanRouter.use(express.static("sources/public"));
perpustakaanPeminjamanRouter.use(express.urlencoded({ extended: true }));

perpustakaanPeminjamanRouter.route("/").get(async (req, res) => {
    let tableItemArray: any = await Peminjaman.find()
        .populate({
            path: "id_anggota",
            select: "nomor_anggota",
            model: Anggota,
        })
        .populate({
            path: "id_petugas",
            select: "nama",
            model: Petugas,
        })
        .sort({ dibuat: -1 })
        .lean();

    tableItemArray = await Promise.all(
        tableItemArray.map(async (tableItemObject: any) => {
            tableItemObject.buku = await Promise.all(
                tableItemObject.buku.map(async (bukuObject: any) => {
                    return {
                        _id: bukuObject._id,
                        id_buku: await Buku.findOne({ _id: bukuObject.id_buku }).select("kode judul").lean(),
                        kuantitas: bukuObject.kuantitas,
                    };
                })
            );

            return {
                ...tableItemObject,
                status: (await Pengembalian.exists({ id_peminjaman: tableItemObject._id }).lean()) == null ? "Belum Dikembalikan" : "Sudah Dikembalikan",
            };
        })
    );

    const documentCount = await Peminjaman.countDocuments();
    const latestDibuat: any = await Peminjaman.findOne()
        .select("id_anggota")
        .populate({ path: "id_anggota", select: "nomor_anggota", model: Anggota })
        .sort({ dibuat: -1 })
        .lean();

    const latestDiubah: any = await Peminjaman.findOne()
        .select("id_anggota")
        .populate({ path: "id_anggota", select: "nomor_anggota", model: Anggota })
        .sort({ diubah: -1 })
        .lean();

    res.render("pages/perpustakaan/peminjaman/table", {
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
                        title: "Peminjaman",
                        icon: "list",
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
                        value: documentCount >= 1 ? latestDibuat.id_anggota.nomor_anggota : "Tidak Ada",
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
                        value: documentCount >= 1 ? latestDiubah.id_anggota.nomor_anggota : "Tidak Ada",
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

perpustakaanPeminjamanRouter
    .route("/create")
    .get(async (req, res) => {
        res.render("pages/perpustakaan/peminjaman/create", {
            headTitle,
            navActive,
            toastResponse: req.query.response,
            toastTitle: req.query.response == "success" ? "Data Berhasil Dibuat" : "Data Gagal Dibuat",
            toastText: req.query.text,
            detailedInputArray: [
                {
                    id: 1,
                    name: "id_anggota",
                    display: "Anggota",
                    type: "select",
                    value: [
                        (await Anggota.find().select("nomor_anggota").sort({ nomor_anggota: 1 })).map((anggotaObject: any) => {
                            return [anggotaObject._id, anggotaObject.nomor_anggota];
                        }),
                        null,
                    ],
                    placeholder: "Input anggota disini",
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
                    name: "tanggal_peminjaman",
                    display: "Tanggal Peminjaman",
                    type: "date",
                    value: null,
                    placeholder: "Input tanggal peminjaman disini",
                    enable: true,
                },
                {
                    id: 4,
                    name: "durasi_peminjaman",
                    display: "Durasi Peminjaman",
                    type: "date",
                    value: null,
                    placeholder: "Input durasi peminjaman disini",
                    enable: true,
                },
                {
                    id: 5,
                    name: "keterangan",
                    display: "Keterangan",
                    type: "text",
                    value: null,
                    placeholder: "Input keterangan disini",
                    enable: true,
                },
            ],
            bukuArray: await Buku.find()
                .select("kode judul id_kategori id_penulis id_penerbit tahun_terbit stok")
                .populate({ path: "id_kategori", select: "kategori", model: Kategori })
                .populate({ path: "id_penulis", select: "penulis", model: Penulis })
                .populate({ path: "id_penerbit", select: "penerbit", model: Penerbit })
                .sort({ kode: 1 })
                .lean(),
        });
    })
    .post(async (req, res) => {
        const attributeArray: any = {};
        const inputArray = tableAttributeArray.map((tableAttributeObject) => {
            const attributeCurrent = tableAttributeObject.value[0];

            attributeArray[attributeCurrent] = req.body[attributeCurrent];

            return req.body[attributeCurrent];
        });

        const bukuArray: any = req.body.bukuArray;
        const kuantitasArray: any = req.body.kuantitasArray;

        inputArray.push(bukuArray);
        inputArray.push(kuantitasArray);

        if (!inputArray.includes(undefined)) {
            let kuantitasIsValid = true;
            let stockIsValid = true;
            const buku: any = await Promise.all(
                bukuArray.map(async (bukuValue: any, bukuIndex: number) => {
                    const idBuku = parseInt(bukuValue);
                    const kuantitasBuku = parseInt(kuantitasArray[bukuIndex]);
                    const stockBuku = (await Buku.findOne({ _id: idBuku }).select("stok").lean()).stok;

                    if (kuantitasBuku >= 1) {
                        if (kuantitasBuku <= stockBuku) {
                            return { _id: bukuIndex + 1, id_buku: idBuku, kuantitas: kuantitasBuku };
                        } else if (kuantitasBuku > stockBuku) {
                            stockIsValid = false;
                        }
                    } else if (kuantitasBuku < 1) {
                        kuantitasIsValid = false;
                    }
                })
            );

            if (kuantitasIsValid) {
                if (stockIsValid) {
                    const itemObject = new Peminjaman({
                        _id: (await Peminjaman.findOne().sort({ _id: -1 }))?._id + 1 || 1,

                        id_anggota: attributeArray.id_anggota,
                        id_petugas: attributeArray.id_petugas,
                        buku,
                        tanggal_peminjaman: attributeArray.tanggal_peminjaman,
                        durasi_peminjaman: attributeArray.durasi_peminjaman,
                        keterangan: attributeArray.keterangan,

                        dibuat: new Date(),
                        diubah: new Date(),
                    });

                    try {
                        await itemObject.save();

                        buku.forEach(async (bukuObject: any) => {
                            const currentStockBuku = (await Buku.findOne({ _id: bukuObject._id }).select("stok").lean()).stok;

                            const calculatedStockBuku: number = currentStockBuku - bukuObject.kuantitas;

                            await Buku.updateOne({ _id: bukuObject._id }, { stok: calculatedStockBuku, diubah: new Date() });
                        });

                        res.redirect("create?response=success");
                    } catch (error: any) {
                        res.redirect("create?response=error");
                    }
                } else if (!stockIsValid) {
                    res.redirect("create?response=error&text=Stok buku tidak cukup");
                }
            } else if (!kuantitasIsValid) {
                res.redirect("create?response=error&text=Kuantitas tidak valid");
            }
        } else if (inputArray.includes(undefined)) {
            res.redirect("create?response=error&text=Data tidak lengkap");
        }
    });

perpustakaanPeminjamanRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Peminjaman.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await Peminjaman.findOne({ _id: id });

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
                        name: "id_anggota",
                        display: "Anggota",
                        type: "select",
                        value: [
                            (await Anggota.find().select("nomor_anggota").sort({ nomor_anggota: 1 })).map((anggotaObject: any) => {
                                return [anggotaObject._id, anggotaObject.nomor_anggota];
                            }),
                            itemObject.id_anggota,
                        ],
                        placeholder: "Input anggota disini",
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
                            itemObject.id_petugas,
                        ],
                        placeholder: "Input petugas disini",
                        enable: true,
                    },
                    {
                        id: 3,
                        name: "tanggal_peminjaman",
                        display: "Tanggal Peminjaman",
                        type: "date",
                        value: localMoment(itemObject.tanggal_peminjaman).format("YYYY-MM-DD"),
                        placeholder: "Input tanggal peminjaman disini",
                        enable: true,
                    },
                    {
                        id: 4,
                        name: "durasi_peminjaman",
                        display: "Durasi Peminjaman",
                        type: "date",
                        value: localMoment(itemObject.durasi_peminjaman).format("YYYY-MM-DD"),
                        placeholder: "Input durasi peminjaman disini",
                        enable: true,
                    },
                    {
                        id: 5,
                        name: "keterangan",
                        display: "Keterangan",
                        type: "text",
                        value: itemObject.keterangan,
                        placeholder: "Input keterangan disini",
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
        const dataExist = await Peminjaman.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Peminjaman.updateOne(
                        { _id: id },
                        {
                            ...attributeArray,

                            diubah: new Date(),
                        }
                    );
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

perpustakaanPeminjamanRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Peminjaman.exists({ _id: id });

        if (dataExist != null) {
            const itemObject: any = await Peminjaman.findOne({ _id: id })
                .populate({
                    path: "id_anggota",
                    select: "nomor_anggota",
                    model: Anggota,
                })
                .populate({
                    path: "id_petugas",
                    select: "nama",
                    model: Petugas,
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
                        name: "id_anggota",
                        display: "Anggota",
                        type: "text",
                        value: itemObject.id_anggota.nomor_anggota,
                        placeholder: "Input anggota disini",
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
                        name: "tanggal_peminjaman",
                        display: "Tanggal Peminjaman",
                        type: "date",
                        value: localMoment(itemObject.tanggal_peminjaman).format("YYYY-MM-DD"),
                        placeholder: "Input tanggal peminjaman disini",
                        enable: false,
                    },
                    {
                        id: 4,
                        name: "durasi_peminjaman",
                        display: "Durasi Peminjaman",
                        type: "date",
                        value: localMoment(itemObject.durasi_peminjaman).format("YYYY-MM-DD"),
                        placeholder: "Input durasi peminjaman disini",
                        enable: false,
                    },
                    {
                        id: 5,
                        name: "keterangan",
                        display: "Keterangan",
                        type: "text",
                        value: itemObject.keterangan,
                        placeholder: "Input keterangan disini",
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
        const dataExist = await Peminjaman.exists({ _id: id });

        if (dataExist != null) {
            const dataIsUsed = await Pengembalian.exists({ id_peminjaman: id });

            if (dataIsUsed == null) {
                try {
                    const itemObject = await Peminjaman.findOne({ _id: id }).select("buku").lean();

                    itemObject.buku.forEach(async (bukuObject: any) => {
                        const currentStockBuku = (await Buku.findOne({ _id: bukuObject._id }).select("stok").lean()).stok;

                        const calculatedStockBuku: number = currentStockBuku + bukuObject.kuantitas;

                        await Buku.updateOne({ _id: bukuObject._id }, { stok: calculatedStockBuku, diubah: new Date() });
                    });

                    await Peminjaman.deleteOne({ _id: id });

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
