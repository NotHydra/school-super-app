import express, { Router } from "express";

import { JenisKelamin, Jurusan, Rombel, Siswa, TahunMasuk, TempatLahir, Tingkat } from "../../models";

import { headTitle } from ".";
import { localMoment } from "../../utility";

export const bukuIndukSiswaRouter = Router();
const navActive = [1, 1];
const tableAttributeArray = [
    {
        id: 1,
        label: "NISN",
        value: ["nisn"],
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
        label: "Tahun Masuk",
        value: ["id_tahun_masuk", "tahun_masuk"],
        type: "text",
    },
    {
        id: 7,
        label: "Tingkat",
        value: ["id_tingkat", "tingkat"],
        type: "text",
    },
    {
        id: 8,
        label: "Jurusan",
        value: ["id_jurusan", "jurusan"],
        type: "text",
    },
    {
        id: 9,
        label: "Rombel",
        value: ["id_rombel", "rombel"],
        type: "text",
    },
];

bukuIndukSiswaRouter.use(express.static("sources/public"));
bukuIndukSiswaRouter.use(express.urlencoded({ extended: false }));

bukuIndukSiswaRouter.route("/").get(async (req, res) => {
    const tableItemArray = await Siswa.find()
        .populate("id_tempat_lahir")
        .populate("id_jenis_kelamin")
        .populate("id_tahun_masuk")
        .populate("id_tingkat")
        .populate("id_jurusan")
        .populate("id_rombel");

    res.render("pages/table", {
        headTitle,
        navActive,
        toastResponse: req.query.response,
        toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
        toastText: req.query.text,
        cardItemArray: [
            {
                id: 1,
                title: "Siswa",
                icon: "user",
                value: await Siswa.countDocuments(),
            },
            {
                id: 2,
                title: "Laki-Laki & Perempuan",
                icon: "restroom",
                value: `${await Siswa.find({ id_jenis_kelamin: 1 }).count()} - ${await Siswa.find({ id_jenis_kelamin: 2 }).count()}`,
            },
            {
                id: 3,
                title: "Dibuat",
                icon: "circle-plus",
                value: (await Siswa.findOne().sort({ dibuat: -1 })).nisn,
            },
            {
                id: 4,
                title: "Diupdate",
                icon: "circle-exclamation",
                value: (await Siswa.findOne().sort({ diubah: -1 })).nisn,
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

bukuIndukSiswaRouter
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
                    name: "nisn",
                    display: "NISN",
                    type: "number",
                    value: null,
                    placeholder: "Input NISN disini",
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
                        (await TempatLahir.find().sort({ tempat_lahir: 1 })).map((tempatLahirObject) => {
                            return [tempatLahirObject.id, tempatLahirObject.tempat_lahir];
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
                        (await JenisKelamin.find().sort({ jenis_kelamin: 1 })).map((jenisKelaminObject) => {
                            return [jenisKelaminObject.id, jenisKelaminObject.jenis_kelamin];
                        }),
                        null,
                    ],
                    placeholder: "Input jenis kelamin disini",
                    enable: true,
                },
                {
                    id: 6,
                    name: "id_tahun_masuk",
                    display: "Tahun Masuk",
                    type: "select",
                    value: [
                        (await TahunMasuk.find().sort({ tahun_masuk: 1 })).map((tahunMasukObject) => {
                            return [tahunMasukObject.id, tahunMasukObject.tahun_masuk];
                        }),
                        null,
                    ],
                    placeholder: "Input tahun masuk disini",
                    enable: true,
                },
                {
                    id: 7,
                    name: "id_tingkat",
                    display: "Tingkat",
                    type: "select",
                    value: [
                        (await Tingkat.find().sort({ tingkat: 1 })).map((tingkatObject) => {
                            return [tingkatObject.id, tingkatObject.tingkat];
                        }),
                        null,
                    ],
                    placeholder: "Input tingkat disini",
                    enable: true,
                },
                {
                    id: 8,
                    name: "id_jurusan",
                    display: "Jurusan",
                    type: "select",
                    value: [
                        (await Jurusan.find().sort({ jurusan: 1 })).map((jurusanObject) => {
                            return [jurusanObject.id, jurusanObject.jurusan];
                        }),
                        null,
                    ],
                    placeholder: "Input jurusan disini",
                    enable: true,
                },
                {
                    id: 9,
                    name: "id_rombel",
                    display: "Rombel",
                    type: "select",
                    value: [
                        (await Rombel.find().sort({ rombel: 1 })).map((rombelObject) => {
                            return [rombelObject.id, rombelObject.rombel];
                        }),
                        null,
                    ],
                    placeholder: "Input rombel disini",
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
            const itemObject = new Siswa({
                _id: (await Siswa.findOne().sort({ _id: -1 }))._id + 1,

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

bukuIndukSiswaRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Siswa.exists({ _id: id });

        if (dataExist) {
            const itemObject = await Siswa.findOne({ _id: id });

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
                        name: "nisn",
                        display: "NISN",
                        type: "number",
                        value: itemObject.nisn,
                        placeholder: "Input NISN disini",
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
                            (await TempatLahir.find().sort({ tempat_lahir: 1 })).map((tempatLahirObject) => {
                                return [tempatLahirObject.id, tempatLahirObject.tempat_lahir];
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
                            (await JenisKelamin.find().sort({ jenis_kelamin: 1 })).map((jenisKelaminObject) => {
                                return [jenisKelaminObject.id, jenisKelaminObject.jenis_kelamin];
                            }),
                            itemObject.id_jenis_kelamin,
                        ],
                        placeholder: "Input jenis kelamin disini",
                        enable: true,
                    },
                    {
                        id: 6,
                        name: "id_tahun_masuk",
                        display: "Tahun Masuk",
                        type: "select",
                        value: [
                            (await TahunMasuk.find().sort({ tahun_masuk: 1 })).map((tahunMasukObject) => {
                                return [tahunMasukObject.id, tahunMasukObject.tahun_masuk];
                            }),
                            itemObject.id_tahun_masuk,
                        ],
                        placeholder: "Input tahun masuk disini",
                        enable: true,
                    },
                    {
                        id: 7,
                        name: "id_tingkat",
                        display: "Tingkat",
                        type: "select",
                        value: [
                            (await Tingkat.find().sort({ tingkat: 1 })).map((tingkatObject) => {
                                return [tingkatObject.id, tingkatObject.tingkat];
                            }),
                            itemObject.id_tingkat,
                        ],
                        placeholder: "Input tingkat disini",
                        enable: true,
                    },
                    {
                        id: 8,
                        name: "id_jurusan",
                        display: "Jurusan",
                        type: "select",
                        value: [
                            (await Jurusan.find().sort({ jurusan: 1 })).map((jurusanObject) => {
                                return [jurusanObject.id, jurusanObject.jurusan];
                            }),
                            itemObject.id_jurusan,
                        ],
                        placeholder: "Input jurusan disini",
                        enable: true,
                    },
                    {
                        id: 9,
                        name: "id_rombel",
                        display: "Rombel",
                        type: "select",
                        value: [
                            (await Rombel.find().sort({ rombel: 1 })).map((rombelObject) => {
                                return [rombelObject.id, rombelObject.rombel];
                            }),
                            itemObject.id_rombel,
                        ],
                        placeholder: "Input rombel disini",
                        enable: true,
                    },
                ],
            });
        } else if (!dataExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Siswa.exists({ _id: id });

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            if (!inputArray.includes(undefined)) {
                try {
                    await Siswa.updateOne(
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

bukuIndukSiswaRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const siswaExist = await Siswa.exists({ _id: id });

        if (siswaExist) {
            const siswaObject = await Siswa.findOne({ _id: id });

            res.render("pages/buku-induk/siswa/delete", {
                headTitle,
                extraTitle: "Hapus",
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
                toastText: req.query.text,
                id,
                detailedInputArray: [
                    {
                        id: 1,
                        name: "nisn",
                        display: "NISN",
                        type: "number",
                        value: siswaObject.nisn,
                        placeholder: "Input NISN disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "nama_lengkap",
                        display: "Nama Lengkap",
                        type: "text",
                        value: siswaObject.nama_lengkap,
                        placeholder: "Input nama lengkap disini",
                        enable: false,
                    },
                    {
                        id: 3,
                        name: "id_tempat_lahir",
                        display: "Tempat Lahir",
                        type: "text",
                        value: (await TempatLahir.findOne({ _id: siswaObject.id_tempat_lahir })).tempat_lahir,
                        placeholder: "Input tempat lahir disini",
                        enable: false,
                    },
                    {
                        id: 4,
                        name: "tanggal_lahir",
                        display: "Tanggal Lahir",
                        type: "date",
                        value: localMoment(siswaObject.tanggal_lahir).format("YYYY-MM-DD"),
                        placeholder: "Input tanggal lahir disini",
                        enable: false,
                    },
                    {
                        id: 5,
                        name: "id_jenis_kelamin",
                        display: "Jenis Kelamin",
                        type: "text",
                        value: (await JenisKelamin.findOne({ _id: siswaObject.id_jenis_kelamin })).jenis_kelamin,
                        placeholder: "Input jenis kelamin disini",
                        enable: false,
                    },
                    {
                        id: 6,
                        name: "id_tahun_masuk",
                        display: "Tahun Masuk",
                        type: "text",
                        value: (await TahunMasuk.findOne({ _id: siswaObject.id_tahun_masuk })).tahun_masuk,
                        placeholder: "Input tahun masuk disini",
                        enable: false,
                    },
                    {
                        id: 7,
                        name: "id_tingkat",
                        display: "Tingkat",
                        type: "text",
                        value: (await Tingkat.findOne({ _id: siswaObject.id_tingkat })).tingkat,
                        placeholder: "Input tingkat disini",
                        enable: false,
                    },
                    {
                        id: 8,
                        name: "id_jurusan",
                        display: "Jurusan",
                        type: "text",
                        value: (await Jurusan.findOne({ _id: siswaObject.id_jurusan })).jurusan,
                        placeholder: "Input jurusan disini",
                        enable: false,
                    },
                    {
                        id: 9,
                        name: "id_rombel",
                        display: "Rombel",
                        type: "text",
                        value: (await Rombel.findOne({ _id: siswaObject.id_rombel })).rombel,
                        placeholder: "Input rombel disini",
                        enable: false,
                    },
                ],
            });
        } else if (!siswaExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const siswaExist = await Siswa.exists({ _id: id });

        if (siswaExist) {
            try {
                await Siswa.deleteOne({ _id: id });
                res.redirect("./?response=success");
            } catch (error) {
                res.redirect(`delete?id=${id}&response=error`);
            }
        } else if (!siswaExist) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
