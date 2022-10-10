import express, { Router } from "express";

import { headTitle } from ".";

import { localMoment } from "../../utility";

import { Guru, Jabatan, JenisKelamin, Pendidikan, TempatLahir, Universitas } from "../../models";

export const pengajarGuruRouter = Router();

const navActive = [1, 1];
const tableAttributeArray = [
    {
        id: 1,
        label: "NIP",
        value: ["nip"],
        type: "text",
    },
    {
        id: 2,
        label: "Nama Lengkap",
        value: ["nama_lengkap"],
        type: "text",
    },
    {
        id: 3,
        label: "Tempat Lahir",
        value: ["id_tempat_lahir", "tempat_lahir"],
        type: "text",
    },
    {
        id: 4,
        label: "Tanggal Lahir",
        value: ["tanggal_lahir"],
        type: "date",
    },
    {
        id: 5,
        label: "Jenis Kelamin",
        value: ["id_jenis_kelamin", "jenis_kelamin"],
        type: "text",
    },
    {
        id: 6,
        label: "Jabatan",
        value: ["id_jabatan", "jabatan"],
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
        label: "Nomor Telepon",
        value: ["nomor_telepon"],
        type: "text",
    },
];

pengajarGuruRouter.use(express.static("sources/public"));
pengajarGuruRouter.use(express.urlencoded({ extended: false }));

pengajarGuruRouter.route("/").get(async (req, res) => {
    const tableItemArray = await Guru.find()
        .populate({ path: "id_tempat_lahir", select: "tempat_lahir", model: TempatLahir })
        .populate({ path: "id_jenis_kelamin", select: "jenis_kelamin", model: JenisKelamin })
        .populate({ path: "id_jabatan", select: "jabatan", model: Jabatan })
        .populate({ path: "id_universitas", select: "universitas", model: Universitas })
        .populate({ path: "id_pendidikan", select: "singkatan", model: Pendidikan })
        .sort({ nip: 1 });

    const documentCount = await Guru.countDocuments();
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
                        title: "Guru",
                        icon: "user-tie",
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
                        value: documentCount >= 1 ? (await Guru.findOne().sort({ dibuat: -1 })).nip : "Tidak Ada",
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
                        value: documentCount >= 1 ? (await Guru.findOne().sort({ diubah: -1 })).nip : "Tidak Ada",
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

pengajarGuruRouter
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
                    name: "nip",
                    display: "NIP",
                    type: "text",
                    value: null,
                    placeholder: "Input NIP disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "nama_lengkap",
                    display: "Nama Lengkap",
                    type: "text",
                    value: null,
                    placeholder: "Input nama lengkap disini",
                    enable: true,
                },
                {
                    id: 3,
                    name: "id_tempat_lahir",
                    display: "Tempat Lahir",
                    type: "select",
                    value: [
                        (await TempatLahir.find().sort({ tempat_lahir: 1 })).map((tempatLahirObject: any) => {
                            return [tempatLahirObject._id, tempatLahirObject.tempat_lahir];
                        }),
                        null,
                    ],
                    placeholder: "Input tempat lahir disini",
                    enable: true,
                },
                {
                    id: 4,
                    name: "tanggal_lahir",
                    display: "Tanggal Lahir",
                    type: "date",
                    value: null,
                    placeholder: "Input tanggal lahir disini",
                    enable: true,
                },
                {
                    id: 5,
                    name: "id_jenis_kelamin",
                    display: "Jenis Kelamin",
                    type: "select",
                    value: [
                        (await JenisKelamin.find().sort({ jenis_kelamin: 1 })).map((jenisKelaminObject: any) => {
                            return [jenisKelaminObject._id, jenisKelaminObject.jenis_kelamin];
                        }),
                        null,
                    ],
                    placeholder: "Input jenis kelamin disini",
                    enable: true,
                },
                {
                    id: 6,
                    name: "id_jabatan",
                    display: "Jabatan",
                    type: "select",
                    value: [
                        (await Jabatan.find().sort({ jabatan: 1 })).map((jabatanObject: any) => {
                            return [jabatanObject._id, jabatanObject.jabatan];
                        }),
                        null,
                    ],
                    placeholder: "Input jabatan disini",
                    enable: true,
                },
                {
                    id: 7,
                    name: "id_universitas",
                    display: "Universitas",
                    type: "select",
                    value: [
                        (await Universitas.find().sort({ universitas: 1 })).map((universitasObject: any) => {
                            return [universitasObject._id, universitasObject.universitas];
                        }),
                        null,
                    ],
                    placeholder: "Input universitas disini",
                    enable: true,
                },
                {
                    id: 8,
                    name: "id_pendidikan",
                    display: "Pendidikan",
                    type: "select",
                    value: [
                        (await Pendidikan.find().sort({ pendidikan: 1 })).map((pendidikanObject: any) => {
                            return [pendidikanObject._id, `${pendidikanObject.pendidikan} - ${pendidikanObject.singkatan}`];
                        }),
                        null,
                    ],
                    placeholder: "Input pendidikan disini",
                    enable: true,
                },
                {
                    id: 9,
                    name: "nomor_telepon",
                    display: "Nomor Telepon",
                    type: "text",
                    value: null,
                    placeholder: "Input nomor telepon disini",
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
            const itemObject = new Guru({
                _id: (await Guru.findOne().sort({ _id: -1 }))._id + 1,

                ...attributeArray,

                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await itemObject.save();
                res.redirect("create?response=success");
            } catch (error) {
                res.redirect("create?response=error");
            }
        } else if (inputArray.includes(undefined)) {
            res.redirect("create?response=error&text=Data tidak lengkap");
        }
    });

pengajarGuruRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Guru.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await Guru.findOne({ _id: id });

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
                        name: "nip",
                        display: "NIP",
                        type: "text",
                        value: itemObject.nip,
                        placeholder: "Input NIP disini",
                        enable: true,
                    },
                    {
                        id: 2,
                        name: "nama_lengkap",
                        display: "Nama Lengkap",
                        type: "text",
                        value: itemObject.nama_lengkap,
                        placeholder: "Input nama lengkap disini",
                        enable: true,
                    },
                    {
                        id: 3,
                        name: "id_tempat_lahir",
                        display: "Tempat Lahir",
                        type: "select",
                        value: [
                            (await TempatLahir.find().sort({ tempat_lahir: 1 })).map((tempatLahirObject: any) => {
                                return [tempatLahirObject._id, tempatLahirObject.tempat_lahir];
                            }),
                            itemObject.id_tempat_lahir,
                        ],
                        placeholder: "Input tempat lahir disini",
                        enable: true,
                    },
                    {
                        id: 4,
                        name: "tanggal_lahir",
                        display: "Tanggal Lahir",
                        type: "date",
                        value: localMoment(itemObject.tanggal_lahir).format("YYYY-MM-DD"),
                        placeholder: "Input tanggal lahir disini",
                        enable: true,
                    },
                    {
                        id: 5,
                        name: "id_jenis_kelamin",
                        display: "Jenis Kelamin",
                        type: "select",
                        value: [
                            (await JenisKelamin.find().sort({ jenis_kelamin: 1 })).map((jenisKelaminObject: any) => {
                                return [jenisKelaminObject._id, jenisKelaminObject.jenis_kelamin];
                            }),
                            itemObject.id_jenis_kelamin,
                        ],
                        placeholder: "Input jenis kelamin disini",
                        enable: true,
                    },
                    {
                        id: 6,
                        name: "id_jabatan",
                        display: "Jabatan",
                        type: "select",
                        value: [
                            (await Jabatan.find().sort({ jabatan: 1 })).map((jabatanObject: any) => {
                                return [jabatanObject._id, jabatanObject.jabatan];
                            }),
                            itemObject.id_jabatan,
                        ],
                        placeholder: "Input jabatan disini",
                        enable: true,
                    },
                    {
                        id: 7,
                        name: "id_universitas",
                        display: "Universitas",
                        type: "select",
                        value: [
                            (await Universitas.find().sort({ universitas: 1 })).map((universitasObject: any) => {
                                return [universitasObject._id, universitasObject.universitas];
                            }),
                            itemObject.id_universitas,
                        ],
                        placeholder: "Input universitas disini",
                        enable: true,
                    },
                    {
                        id: 8,
                        name: "id_pendidikan",
                        display: "Pendidikan",
                        type: "select",
                        value: [
                            (await Pendidikan.find().sort({ pendidikan: 1 })).map((pendidikanObject: any) => {
                                return [pendidikanObject._id, `${pendidikanObject.pendidikan} - ${pendidikanObject.singkatan}`];
                            }),
                            itemObject.id_pendidikan,
                        ],
                        placeholder: "Input pendidikan disini",
                        enable: true,
                    },
                    {
                        id: 9,
                        name: "nomor_telepon",
                        display: "Nomor Telepon",
                        type: "text",
                        value: itemObject.nomor_telepon,
                        placeholder: "Input nomor telepon disini",
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
        const dataExist = await Guru.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Guru.updateOne(
                        { _id: id },
                        {
                            ...attributeArray,

                            diubah: new Date(),
                        }
                    );

                    res.redirect(`update?id=${id}&response=success`);
                } catch {
                    res.redirect(`update?id=${id}&response=error`);
                }
            } else if (inputArray.includes(undefined)) {
                res.redirect(`update?id=${id}&response=error&text=Data tidak lengkap`);
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });

pengajarGuruRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Guru.exists({ _id: id });

        if (dataExist != null) {
            const itemObject: any = await Guru.findOne({ _id: id })
                .populate({ path: "id_tempat_lahir", select: "tempat_lahir", model: TempatLahir })
                .populate({ path: "id_jenis_kelamin", select: "jenis_kelamin", model: JenisKelamin })
                .populate({ path: "id_jabatan", select: "jabatan", model: Jabatan })
                .populate({ path: "id_universitas", select: "universitas", model: Universitas })
                .populate({ path: "id_pendidikan", select: "pendidikan singkatan", model: Pendidikan });

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
                        name: "nip",
                        display: "NIP",
                        type: "text",
                        value: itemObject.nip,
                        placeholder: "Input NIP disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "nama_lengkap",
                        display: "Nama Lengkap",
                        type: "text",
                        value: itemObject.nama_lengkap,
                        placeholder: "Input nama lengkap disini",
                        enable: false,
                    },
                    {
                        id: 3,
                        name: "id_tempat_lahir",
                        display: "Tempat Lahir",
                        type: "text",
                        value: itemObject.id_tempat_lahir.tempat_lahir,
                        placeholder: "Input tempat lahir disini",
                        enable: false,
                    },
                    {
                        id: 4,
                        name: "tanggal_lahir",
                        display: "Tanggal Lahir",
                        type: "date",
                        value: localMoment(itemObject.tanggal_lahir).format("YYYY-MM-DD"),
                        placeholder: "Input tanggal lahir disini",
                        enable: false,
                    },
                    {
                        id: 5,
                        name: "id_jenis_kelamin",
                        display: "Jenis Kelamin",
                        type: "text",
                        value: itemObject.id_jenis_kelamin.jenis_kelamin,
                        placeholder: "Input jenis kelamin disini",
                        enable: false,
                    },
                    {
                        id: 6,
                        name: "id_jabatan",
                        display: "Jabatan",
                        type: "text",
                        value: itemObject.id_jabatan.jabatan,
                        placeholder: "Input jabatan disini",
                        enable: false,
                    },
                    {
                        id: 7,
                        name: "id_universitas",
                        display: "Universitas",
                        type: "text",
                        value: itemObject.id_universitas.universitas,
                        placeholder: "Input universitas disini",
                        enable: false,
                    },
                    {
                        id: 8,
                        name: "id_pendidikan",
                        display: "Pendidikan",
                        type: "text",
                        value: `${itemObject.id_pendidikan.pendidikan} - ${itemObject.id_pendidikan.singkatan}`,
                        placeholder: "Input pendidikan disini",
                        enable: false,
                    },
                    {
                        id: 9,
                        name: "nomor_telepon",
                        display: "Nomor Telepon",
                        type: "text",
                        value: itemObject.nomor_telepon,
                        placeholder: "Input nomor telepon disini",
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
        const dataExist = await Guru.exists({ _id: id });

        if (dataExist != null) {
            try {
                await Guru.deleteOne({ _id: id });
                res.redirect("./?response=success");
            } catch (error) {
                res.redirect(`delete?id=${id}&response=error`);
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
