import express, { Router } from "express";

import { headTitle } from ".";

import { localMoment } from "../../utility";

import { Alumni, Anggota, JenisKelamin, Rombel, Siswa, TahunMasuk, TahunRombel, TempatLahir } from "../../models";

export const pelajarSiswaRouter = Router();

const navActive = [2, 1];
const tableAttributeArray = [
    {
        id: 1,
        label: "NISN",
        value: ["nisn"],
        type: "number",
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
        type: "number",
    },
    {
        id: 7,
        label: "Rombel",
        value: ["id_rombel", "rombel"],
        type: "text",
    },
];

pelajarSiswaRouter.use(express.static("sources/public"));
pelajarSiswaRouter.use(express.urlencoded({ extended: false }));

pelajarSiswaRouter.route("/").get(async (req, res) => {
    const typeValue: any = req.query.type;
    const siswaValue: any = req.query.siswa;

    const tahunMasukValue: any = req.query.tahunMasuk;
    const rombelValue: any = req.query.rombel;
    let filterValue = {};

    if (siswaValue != undefined && !isNaN(siswaValue)) {
        filterValue = { ...filterValue, _id: siswaValue };
    }

    if (tahunMasukValue != undefined && !isNaN(tahunMasukValue)) {
        filterValue = { ...filterValue, id_tahun_masuk: tahunMasukValue };
    }

    if (rombelValue != undefined && !isNaN(rombelValue)) {
        filterValue = { ...filterValue, id_rombel: rombelValue };
    }

    const tableItemArray = await Siswa.find(filterValue)
        .populate({ path: "id_tempat_lahir", select: "tempat_lahir", model: TempatLahir })
        .populate({ path: "id_jenis_kelamin", select: "jenis_kelamin", model: JenisKelamin })
        .populate({ path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk })
        .populate({ path: "id_rombel", select: "rombel", model: Rombel })
        .sort({ nisn: -1 })
        .lean();

    const rombelArray = await Rombel.find()
        .select("rombel id_tahun_rombel")
        .populate({ path: "id_tahun_rombel", select: "tahun_rombel", model: TahunRombel })
        .sort({ rombel: 1 })
        .lean();

    rombelArray.sort((a: any, b: any) => {
        return b.id_tahun_rombel.tahun_rombel - a.id_tahun_rombel.tahun_rombel;
    });

    const documentCount = await Siswa.countDocuments().lean();
    res.render("pages/pelajar/siswa/table", {
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
                        title: "Siswa",
                        icon: "user",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Laki-Laki & Perempuan",
                        icon: "restroom",
                        value: `${await Siswa.find({ id_jenis_kelamin: 1 }).select("_id").countDocuments().lean()} - ${await Siswa.find({ id_jenis_kelamin: 2 })
                            .select("_id")
                            .countDocuments()
                            .lean()}`,
                    },
                    {
                        id: 3,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await Siswa.findOne().select("nisn").sort({ dibuat: -1 }).lean()).nisn : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await Siswa.findOne().select("nisn").sort({ diubah: -1 }).lean()).nisn : "Tidak Ada",
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
        typeValue,
        siswaValue,
        tahunMasukValue,
        tahunMasukArray: await TahunMasuk.find().select("tahun_masuk").sort({ tahun_masuk: 1 }).lean(),
        rombelValue,
        rombelArray,
    });
});

pelajarSiswaRouter
    .route("/create")
    .get(async (req, res) => {
        const typeValue: any = req.query.type;
        const rombelValue: any = req.query.rombel;

        res.render("pages/pelajar/siswa/create", {
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
                        (await TempatLahir.find().select("tempat_lahir").sort({ tempat_lahir: 1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.tempat_lahir];
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
                        (await JenisKelamin.find().select("jenis_kelamin").sort({ jenis_kelamin: 1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.jenis_kelamin];
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
                        (await TahunMasuk.find().select("tahun_masuk").sort({ tahun_masuk: 1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.tahun_masuk];
                        }),
                        null,
                    ],
                    placeholder: "Input tahun masuk disini",
                    enable: true,
                },
                {
                    id: 7,
                    name: "id_rombel",
                    display: "Rombel",
                    type: "select",
                    value: [
                        (
                            await Rombel.find(typeValue == "rombel" ? { _id: rombelValue } : {})
                                .select("rombel")
                                .sort({ rombel: 1 })
                                .lean()
                        ).map((itemObject: any) => {
                            return [itemObject._id, itemObject.rombel];
                        }),
                        typeValue == "rombel" ? rombelValue : null,
                    ],
                    placeholder: "Input rombel disini",
                    enable: true,
                },
            ],
            typeValue,
            rombelValue,
        });
    })
    .post(async (req, res) => {
        const typeValue: any = req.query.type;
        const rombelValue: any = req.query.rombel;

        let queryString: any = null;

        if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&rombel=${rombelValue}`;
        }

        const attributeArray: any = {};
        const inputArray = tableAttributeArray.map((tableAttributeObject) => {
            const attributeCurrent = tableAttributeObject.value[0];

            attributeArray[attributeCurrent] = req.body[attributeCurrent];

            return req.body[attributeCurrent];
        });

        if (!inputArray.includes(undefined)) {
            const itemObject = new Siswa({
                _id: (await Siswa.findOne().select("_id").sort({ _id: -1 }).lean())._id + 1 || 1,

                ...attributeArray,

                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await itemObject.save();
                res.redirect(`create?response=success${queryString}`);
            } catch (error: any) {
                if (error.code == 11000) {
                    if (error.keyPattern.nisn) {
                        res.redirect(`create?response=error&text=NISN sudah digunakan${queryString}`);
                    }
                } else {
                    res.redirect(`create?response=error${queryString}`);
                }
            }
        } else if (inputArray.includes(undefined)) {
            res.redirect(`create?response=error&text=Data tidak lengkap${queryString}`);
        }
    });

pelajarSiswaRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;

        const typeValue: any = req.query.type;
        const siswaValue: any = req.query.siswa;
        const rombelValue: any = req.query.rombel;

        let queryString = null;

        if (typeValue == "anggota" || typeValue == "alumni") {
            queryString = `&type=${typeValue}&siswa=${siswaValue}`;
        } else if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&rombel=${rombelValue}`;
        }

        const dataExist = await Siswa.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Siswa.findOne({ _id: id })
                .select("nisn nama_lengkap id_tempat_lahir tanggal_lahir id_jenis_kelamin id_tahun_masuk id_rombel")
                .lean();

            res.render("pages/pelajar/siswa/update", {
                headTitle,
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Diubah" : "Data Gagal Diubah",
                toastText: req.query.text,
                id,
                typeValue,
                siswaValue,
                rombelValue,
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
                            (await TempatLahir.find().select("tempat_lahir").sort({ tempat_lahir: 1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.tempat_lahir];
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
                            (await JenisKelamin.find().select("jenis_kelamin").sort({ jenis_kelamin: 1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.jenis_kelamin];
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
                            (await TahunMasuk.find().select("tahun_masuk").sort({ tahun_masuk: 1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.tahun_masuk];
                            }),
                            itemObject.id_tahun_masuk,
                        ],
                        placeholder: "Input tahun masuk disini",
                        enable: true,
                    },
                    {
                        id: 7,
                        name: "id_rombel",
                        display: "Rombel",
                        type: "select",
                        value: [
                            (await Rombel.find().select("rombel").sort({ rombel: 1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.rombel];
                            }),
                            itemObject.id_rombel,
                        ],
                        placeholder: "Input rombel disini",
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
        const dataExist = await Siswa.exists({ _id: id }).lean();

        const typeValue: any = req.query.type;
        const siswaValue: any = req.query.siswa;
        const rombelValue: any = req.query.rombel;

        let queryString: any = null;

        if (typeValue == "anggota" || typeValue == "alumni") {
            queryString = `&type=${typeValue}&siswa=${siswaValue}`;
        } else if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&rombel=${rombelValue}`;
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
                    await Siswa.updateOne(
                        { _id: id },
                        {
                            ...attributeArray,

                            diubah: new Date(),
                        }
                    ).lean();

                    res.redirect(`update?id=${id}&response=success${queryString}`);
                } catch (error: any) {
                    if (error.code == 11000) {
                        if (error.keyPattern.nisn) {
                            res.redirect(`update?id=${id}&response=error&text=NISN sudah digunakan${queryString}`);
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

pelajarSiswaRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;

        const typeValue: any = req.query.type;
        const rombelValue: any = req.query.rombel;

        let queryString = null;

        if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&rombel=${rombelValue}`;
        }

        const dataExist = await Siswa.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject: any = await Siswa.findOne({ _id: id })
                .select("nisn nama_lengkap id_tempat_lahir tanggal_lahir id_jenis_kelamin id_tahun_masuk id_rombel")
                .populate({ path: "id_tempat_lahir", select: "tempat_lahir", model: TempatLahir })
                .populate({ path: "id_jenis_kelamin", select: "jenis_kelamin", model: JenisKelamin })
                .populate({ path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk })
                .populate({ path: "id_rombel", select: "rombel", model: Rombel })
                .lean();

            res.render("pages/pelajar/siswa/delete", {
                headTitle,
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
                toastText: req.query.text,
                id,
                typeValue,
                rombelValue,
                detailedInputArray: [
                    {
                        id: 1,
                        name: "nisn",
                        display: "NISN",
                        type: "number",
                        value: itemObject.nisn,
                        placeholder: "Input NISN disini",
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
                        type: "select",
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
                        name: "id_tahun_masuk",
                        display: "Tahun Masuk",
                        type: "text",
                        value: itemObject.id_tahun_masuk.tahun_masuk,
                        placeholder: "Input tahun masuk disini",
                        enable: false,
                    },
                    {
                        id: 7,
                        name: "id_rombel",
                        display: "Rombel",
                        type: "text",
                        value: itemObject.id_rombel.rombel,
                        placeholder: "Input rombel disini",
                        enable: false,
                    },
                ],
            });
        } else if (dataExist == null) {
            res.redirect(`./?response=error&text=Data tidak valid${queryString}`);
        }
    })
    .post(async (req, res) => {
        const id: any = req.query.id;
        const dataExist = await Siswa.exists({ _id: id }).lean();

        const typeValue: any = req.query.type;
        const rombelValue: any = req.query.rombel;

        let queryString = null;

        if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&rombel=${rombelValue}`;
        }

        if (dataExist != null) {
            const dataIsUsed = (await Alumni.exists({ id_siswa: id }).lean()) || (await Anggota.exists({ id_siswa: id }).lean());
            if (dataIsUsed == null) {
                try {
                    await Siswa.deleteOne({ _id: id }).lean();

                    res.redirect(`./?response=success${queryString}`);
                } catch (error: any) {
                    res.redirect(`delete?id=${id}&response=error${queryString}`);
                }
            } else if (dataIsUsed != null) {
                res.redirect(`delete?id=${id}&response=error&text=Data digunakan di data lain${queryString}`);
            }
        } else if (dataExist == null) {
            res.redirect(`./?response=error&text=Data tidak valid${queryString}`);
        }
    });
