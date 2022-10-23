import express, { Router } from "express";

import { headTitle } from ".";

import { Buku, Kategori, Peminjaman, Penerbit, Penulis } from "../../models";

export const perpustakaanBukuRouter = Router();

const navActive = [6, 3];
const tableAttributeArray = [
    {
        id: 1,
        label: "Kode",
        value: ["kode"],
        type: "text",
    },
    {
        id: 2,
        label: "Judul",
        value: ["judul"],
        type: "text",
    },
    {
        id: 3,
        label: "Kategori",
        value: ["id_kategori", "kategori"],
        type: "text",
    },
    {
        id: 4,
        label: "Penulis",
        value: ["id_penulis", "penulis"],
        type: "text",
    },
    {
        id: 5,
        label: "Penerbit",
        value: ["id_penerbit", "penerbit"],
        type: "text",
    },
    {
        id: 6,
        label: "Tahun Terbit",
        value: ["tahun_terbit"],
        type: "text",
    },
    {
        id: 7,
        label: "Halaman",
        value: ["halaman"],
        type: "text",
    },
    {
        id: 8,
        label: "Stok",
        value: ["stok"],
        type: "text",
    },
    {
        id: 9,
        label: "Sinopsis",
        value: ["sinopsis"],
        type: "text",
    },
];

perpustakaanBukuRouter.use(express.static("sources/public"));
perpustakaanBukuRouter.use(express.urlencoded({ extended: false }));

perpustakaanBukuRouter.route("/").get(async (req, res) => {
    const tableItemArray = await Buku.find()
        .populate({
            path: "id_kategori",
            select: "kategori",
            model: Kategori,
        })
        .populate({
            path: "id_penulis",
            select: "penulis",
            model: Penulis,
        })
        .populate({
            path: "id_penerbit",
            select: "penerbit",
            model: Penerbit,
        })
        .sort({ kode: 1 })
        .lean();

    const documentCount = await Buku.countDocuments().lean();
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
                        title: "Buku",
                        icon: "book",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await Buku.findOne().select("kode").sort({ dibuat: -1 }).lean()).kode : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await Buku.findOne().select("kode").sort({ diubah: -1 }).lean()).kode : "Tidak Ada",
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

perpustakaanBukuRouter
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
                    name: "kode",
                    display: "Kode",
                    type: "text",
                    value: null,
                    placeholder: "Input kode disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "judul",
                    display: "Judul",
                    type: "text",
                    value: null,
                    placeholder: "Input judul disini",
                    enable: true,
                },
                {
                    id: 3,
                    name: "id_kategori",
                    display: "Kategori",
                    type: "select",
                    value: [
                        (await Kategori.find().select("kategori").sort({ kategori: 1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.kategori];
                        }),
                        null,
                    ],
                    placeholder: "Input kategori disini",
                    enable: true,
                },
                {
                    id: 4,
                    name: "id_penulis",
                    display: "Penulis",
                    type: "select",
                    value: [
                        (await Penulis.find().select("penulis").sort({ penulis: 1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.penulis];
                        }),
                        null,
                    ],
                    placeholder: "Input penulis disini",
                    enable: true,
                },
                {
                    id: 5,
                    name: "id_penerbit",
                    display: "Penerbit",
                    type: "select",
                    value: [
                        (await Penerbit.find().select("penerbit").sort({ penerbit: 1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.penerbit];
                        }),
                        null,
                    ],
                    placeholder: "Input penerbit disini",
                    enable: true,
                },
                {
                    id: 6,
                    name: "tahun_terbit",
                    display: "Tahun Terbit",
                    type: "number",
                    value: null,
                    placeholder: "Input tahun terbit disini",
                    enable: true,
                },
                {
                    id: 7,
                    name: "halaman",
                    display: "Halaman",
                    type: "number",
                    value: null,
                    placeholder: "Input halaman disini",
                    enable: true,
                },
                {
                    id: 8,
                    name: "stok",
                    display: "Stok",
                    type: "number",
                    value: null,
                    placeholder: "Input stok disini",
                    enable: true,
                },
                {
                    id: 9,
                    name: "sinopsis",
                    display: "Sinopsis",
                    type: "text",
                    value: null,
                    placeholder: "Input sinopsis disini",
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
            const itemObject = new Buku({
                _id: (await Buku.findOne().select("_id").sort({ _id: -1 }).lean())._id + 1 || 1,

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

perpustakaanBukuRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Buku.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Buku.findOne({ _id: id })
                .select("kode judul id_kategori id_penulis id_penerbit tahun_terbit halaman stok sinopsis")
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
                        name: "kode",
                        display: "Kode",
                        type: "text",
                        value: itemObject.kode,
                        placeholder: "Input kode disini",
                        enable: true,
                    },
                    {
                        id: 2,
                        name: "judul",
                        display: "Judul",
                        type: "text",
                        value: itemObject.judul,
                        placeholder: "Input judul disini",
                        enable: true,
                    },
                    {
                        id: 3,
                        name: "id_kategori",
                        display: "Kategori",
                        type: "select",
                        value: [
                            (await Kategori.find().select("kategori").sort({ kategori: 1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.kategori];
                            }),
                            itemObject.id_kategori,
                        ],
                        placeholder: "Input kategori disini",
                        enable: true,
                    },
                    {
                        id: 4,
                        name: "id_penulis",
                        display: "Penulis",
                        type: "select",
                        value: [
                            (await Penulis.find().select("penulis").sort({ penulis: 1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.penulis];
                            }),
                            itemObject.id_penulis,
                        ],
                        placeholder: "Input penulis disini",
                        enable: true,
                    },
                    {
                        id: 5,
                        name: "id_penerbit",
                        display: "Penerbit",
                        type: "select",
                        value: [
                            (await Penerbit.find().select("penerbit").sort({ penerbit: 1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.penerbit];
                            }),
                            itemObject.id_penerbit,
                        ],
                        placeholder: "Input penerbit disini",
                        enable: true,
                    },
                    {
                        id: 6,
                        name: "tahun_terbit",
                        display: "Tahun Terbit",
                        type: "number",
                        value: itemObject.tahun_terbit,
                        placeholder: "Input tahun terbit disini",
                        enable: true,
                    },
                    {
                        id: 7,
                        name: "halaman",
                        display: "Halaman",
                        type: "number",
                        value: itemObject.halaman,
                        placeholder: "Input halaman disini",
                        enable: true,
                    },
                    {
                        id: 8,
                        name: "stok",
                        display: "Stok",
                        type: "number",
                        value: itemObject.stok,
                        placeholder: "Input stok disini",
                        enable: true,
                    },
                    {
                        id: 9,
                        name: "sinopsis",
                        display: "Sinopsis",
                        type: "text",
                        value: itemObject.sinopsis,
                        placeholder: "Input sinopsis disini",
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
        const dataExist = await Buku.exists({ _id: id }).lean();

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Buku.updateOne(
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

perpustakaanBukuRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Buku.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject: any = await Buku.findOne({ _id: id })
                .select("kode judul id_kategori id_penulis id_penerbit tahun_terbit halaman stok sinopsis")
                .populate({
                    path: "id_kategori",
                    select: "kategori",
                    model: Kategori,
                })
                .populate({
                    path: "id_penulis",
                    select: "penulis",
                    model: Penulis,
                })
                .populate({
                    path: "id_penerbit",
                    select: "penerbit",
                    model: Penerbit,
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
                        name: "kode",
                        display: "Kode",
                        type: "text",
                        value: itemObject.kode,
                        placeholder: "Input kode disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "judul",
                        display: "Judul",
                        type: "text",
                        value: itemObject.judul,
                        placeholder: "Input judul disini",
                        enable: false,
                    },
                    {
                        id: 3,
                        name: "id_kategori",
                        display: "Kategori",
                        type: "text",
                        value: itemObject.id_kategori.kategori,
                        placeholder: "Input kategori disini",
                        enable: false,
                    },
                    {
                        id: 4,
                        name: "id_penulis",
                        display: "Penulis",
                        type: "text",
                        value: itemObject.id_penulis.penulis,
                        placeholder: "Input penulis disini",
                        enable: false,
                    },
                    {
                        id: 5,
                        name: "id_penerbit",
                        display: "Penerbit",
                        type: "text",
                        value: itemObject.id_penerbit.penerbit,
                        placeholder: "Input penerbit disini",
                        enable: false,
                    },
                    {
                        id: 6,
                        name: "tahun_terbit",
                        display: "Tahun Terbit",
                        type: "number",
                        value: itemObject.tahun_terbit,
                        placeholder: "Input tahun terbit disini",
                        enable: false,
                    },
                    {
                        id: 7,
                        name: "halaman",
                        display: "Halaman",
                        type: "number",
                        value: itemObject.halaman,
                        placeholder: "Input halaman disini",
                        enable: false,
                    },
                    {
                        id: 8,
                        name: "stok",
                        display: "Stok",
                        type: "number",
                        value: itemObject.stok,
                        placeholder: "Input stok disini",
                        enable: false,
                    },
                    {
                        id: 9,
                        name: "sinopsis",
                        display: "Sinopsis",
                        type: "text",
                        value: itemObject.sinopsis,
                        placeholder: "Input sinopsis disini",
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
        const dataExist = await Buku.exists({ _id: id }).lean();

        if (dataExist != null) {
            let dataIsUsed: any = null;
            (await Peminjaman.find().select("buku").lean()).forEach((peminjamanObject: any) => {
                peminjamanObject.buku.forEach((bukuObject: any) => {
                    if (bukuObject.id_buku == id) {
                        dataIsUsed = bukuObject;
                    }
                });
            });

            if (dataIsUsed == null) {
                try {
                    await Buku.deleteOne({ _id: id }).lean();
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
