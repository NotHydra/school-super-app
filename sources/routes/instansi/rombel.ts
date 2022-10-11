import express, { Router } from "express";

import { headTitle } from ".";

import { Guru, Jurusan, Rombel, Siswa, TahunRombel, Tingkat } from "../../models";

export const instansiRombelRouter = Router();

const navActive = [5, 1];
const tableAttributeArray = [
    {
        id: 1,
        label: "Rombel",
        value: ["rombel"],
        type: "text",
    },
    {
        id: 2,
        label: "Wali Kelas",
        value: ["id_wali_kelas", "nama_lengkap"],
        type: "text",
    },
    {
        id: 3,
        label: "Tingkat",
        value: ["id_tingkat", "tingkat"],
        type: "text",
    },
    {
        id: 4,
        label: "Jurusan",
        value: ["id_jurusan", "jurusan"],
        type: "text",
    },
    {
        id: 5,
        label: "Tahun Rombel",
        value: ["id_tahun_rombel", "tahun_rombel"],
        type: "text",
    },
];

instansiRombelRouter.use(express.static("sources/public"));
instansiRombelRouter.use(express.urlencoded({ extended: false }));

instansiRombelRouter.route("/").get(async (req, res) => {
    const tableItemArray = await Rombel.find()
        .populate({
            path: "id_wali_kelas",
            select: "nama_lengkap",
            model: Guru,
        })
        .populate({
            path: "id_tingkat",
            select: "tingkat",
            model: Tingkat,
        })
        .populate({
            path: "id_jurusan",
            select: "jurusan",
            model: Jurusan,
        })
        .populate({
            path: "id_tahun_rombel",
            select: "tahun_rombel",
            model: TahunRombel,
        })
        .sort({ rombel: 1 });

    const documentCount = await Rombel.countDocuments();
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
                        title: "Rombel",
                        icon: "archway",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await Rombel.findOne().sort({ dibuat: -1 })).rombel : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await Rombel.findOne().sort({ diubah: -1 })).rombel : "Tidak Ada",
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

instansiRombelRouter
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
                    name: "rombel",
                    display: "Rombel",
                    type: "text",
                    value: null,
                    placeholder: "Input rombel disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "id_wali_kelas",
                    display: "Wali Kelas",
                    type: "select",
                    value: [
                        (await Guru.find().select("nip nama_lengkap").sort({ nip: 1 })).map((guruObject) => {
                            return [guruObject._id, `${guruObject.nip} - ${guruObject.nama_lengkap}`];
                        }),
                        null,
                    ],
                    placeholder: "Input wali kelas disini",
                    enable: true,
                },
                {
                    id: 3,
                    name: "id_tingkat",
                    display: "Tingkat",
                    type: "select",
                    value: [
                        (await Tingkat.find().select("tingkat").sort({ tingkat: 1 })).map((tingkatObject) => {
                            return [tingkatObject._id, tingkatObject.tingkat];
                        }),
                        null,
                    ],
                    placeholder: "Input tingkat disini",
                    enable: true,
                },
                {
                    id: 4,
                    name: "id_jurusan",
                    display: "Jurusan",
                    type: "select",
                    value: [
                        (await Jurusan.find().select("jurusan").sort({ jurusan: 1 })).map((jurusanObject) => {
                            return [jurusanObject._id, jurusanObject.jurusan];
                        }),
                        null,
                    ],
                    placeholder: "Input jurusan disini",
                    enable: true,
                },
                {
                    id: 5,
                    name: "id_tahun_rombel",
                    display: "Tahun Rombel",
                    type: "select",
                    value: [
                        (await TahunRombel.find().select("tahun_rombel").sort({ tahun_rombel: 1 })).map((tahunRombelObject) => {
                            return [tahunRombelObject._id, tahunRombelObject.tahun_rombel];
                        }),
                        null,
                    ],
                    placeholder: "Input tahun rombel disini",
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
            const itemObject = new Rombel({
                _id: (await Rombel.findOne().sort({ _id: -1 }))._id + 1,

                ...attributeArray,

                semester: [],
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

instansiRombelRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Rombel.exists({ _id: id });

        if (dataExist != null) {
            const itemObject = await Rombel.findOne({ _id: id });

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
                        name: "rombel",
                        display: "Rombel",
                        type: "text",
                        value: itemObject.rombel,
                        placeholder: "Input rombel disini",
                        enable: true,
                    },
                    {
                        id: 2,
                        name: "id_wali_kelas",
                        display: "Wali Kelas",
                        type: "select",
                        value: [
                            (await Guru.find().select("nip nama_lengkap").sort({ nip: 1 })).map((guruObject) => {
                                return [guruObject._id, `${guruObject.nip} ${guruObject.nama_lengkap}`];
                            }),
                            itemObject.id_wali_kelas,
                        ],
                        placeholder: "Input wali kelas disini",
                        enable: true,
                    },
                    {
                        id: 3,
                        name: "id_tingkat",
                        display: "Tingkat",
                        type: "select",
                        value: [
                            (await Tingkat.find().select("tingkat").sort({ tingkat: 1 })).map((tingkatObject) => {
                                return [tingkatObject._id, tingkatObject.tingkat];
                            }),
                            itemObject.id_tingkat,
                        ],
                        placeholder: "Input tingkat disini",
                        enable: true,
                    },
                    {
                        id: 4,
                        name: "id_jurusan",
                        display: "Jurusan",
                        type: "select",
                        value: [
                            (await Jurusan.find().select("jurusan").sort({ jurusan: 1 })).map((jurusanObject) => {
                                return [jurusanObject._id, jurusanObject.jurusan];
                            }),
                            itemObject.id_jurusan,
                        ],
                        placeholder: "Input jurusan disini",
                        enable: true,
                    },
                    {
                        id: 5,
                        name: "id_tahun_rombel",
                        display: "Tahun Rombel",
                        type: "select",
                        value: [
                            (await TahunRombel.find().select("tahun_rombel").sort({ tahun_rombel: 1 })).map((tahunRombelObject) => {
                                return [tahunRombelObject._id, tahunRombelObject.tahun_rombel];
                            }),
                            itemObject.id_tahun_rombel,
                        ],
                        placeholder: "Input tahun rombel disini",
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
        const dataExist = await Rombel.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Rombel.updateOne(
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

instansiRombelRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Rombel.exists({ _id: id });

        if (dataExist != null) {
            const itemObject: any = await Rombel.findOne({ _id: id })
                .populate({
                    path: "id_wali_kelas",
                    select: "nama_lengkap",
                    model: Guru,
                })
                .populate({
                    path: "id_tingkat",
                    select: "tingkat",
                    model: Tingkat,
                })
                .populate({
                    path: "id_jurusan",
                    select: "jurusan",
                    model: Jurusan,
                })
                .populate({
                    path: "id_tahun_rombel",
                    select: "tahun_rombel",
                    model: TahunRombel,
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
                        name: "rombel",
                        display: "Rombel",
                        type: "text",
                        value: itemObject.rombel,
                        placeholder: "Input rombel disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "id_wali_kelas",
                        display: "Wali Kelas",
                        type: "text",
                        value: itemObject.id_wali_kelas.nama_lengkap,
                        placeholder: "Input wali kelas disini",
                        enable: false,
                    },
                    {
                        id: 3,
                        name: "id_tingkat",
                        display: "Tingkat",
                        type: "text",
                        value: itemObject.id_tingkat.tingkat,
                        placeholder: "Input tingkat disini",
                        enable: false,
                    },
                    {
                        id: 4,
                        name: "id_jurusan",
                        display: "Jurusan",
                        type: "text",
                        value: itemObject.id_jurusan.jurusan,
                        placeholder: "Input jurusan disini",
                        enable: false,
                    },
                    {
                        id: 5,
                        name: "id_tahun_rombel",
                        display: "Tahun Rombel",
                        type: "text",
                        value: itemObject.id_tahun_rombel.tahun_rombel,
                        placeholder: "Input tahun rombel disini",
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
        const dataExist = await Rombel.exists({ _id: id });

        if (dataExist != null) {
            const dataIsUsed = await Siswa.exists({ id_rombel: id });

            if (dataIsUsed == null) {
                try {
                    await Rombel.deleteOne({ _id: id });
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
