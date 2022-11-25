import express, { Router } from "express";

import { headTitle } from ".";

import { keteranganToId, localMoment } from "../../utility";

import { Alumni, Anggota, JenisKelamin, Keterangan, Pelanggar, Rombel, Siswa, TahunAjaran, TahunLulus, TahunMasuk, TempatLahir } from "../../models";

export const pelajarSiswaRouter = Router();

const navActive = [5, 2];
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
        label: "Tahun Ajaran",
        value: ["id_tahun_ajaran", "tahun_ajaran"],
        type: "text",
    },
    {
        id: 7,
        label: "Tahun Masuk",
        value: ["id_tahun_masuk", "tahun_masuk"],
        type: "number",
    },
    {
        id: 8,
        label: "Rombel",
        value: ["id_rombel", "rombelFull"],
        type: "text",
    },
    {
        id: 9,
        label: "Status",
        value: ["aktif"],
        type: "text",
    },
    {
        id: 10,
        label: "Keterangan",
        value: ["id_keterangan", "keterangan"],
        type: "text",
    },
    {
        id: 11,
        label: "Nomor Telepon",
        value: ["nomor_telepon"],
        type: "text",
    },
];

pelajarSiswaRouter.use(express.static("sources/public"));
pelajarSiswaRouter.use(express.urlencoded({ extended: false }));

pelajarSiswaRouter.route("/").get(async (req, res) => {
    const typeValue: any = req.query.type;
    const siswaValue: any = req.query.siswa;

    const tempatLahirValue: any = req.query.tempatLahir;
    const jenisKelaminValue: any = req.query.jenisKelamin;
    const tahunAjaranValue: any = req.query.tahunAjaran;
    const tahunMasukValue: any = req.query.tahunMasuk;
    const rombelValue: any = req.query.rombel;
    const aktifValue: any = req.query.aktif;
    const keteranganValue: any = req.query.keterangan;
    let filterValue = {};

    if (siswaValue != undefined && !isNaN(siswaValue)) {
        filterValue = { ...filterValue, _id: siswaValue };
    }

    if (tempatLahirValue != undefined && !isNaN(tempatLahirValue)) {
        filterValue = { ...filterValue, id_tempat_lahir: tempatLahirValue };
    }

    if (jenisKelaminValue != undefined && !isNaN(jenisKelaminValue)) {
        filterValue = { ...filterValue, id_jenis_kelamin: jenisKelaminValue };
    }

    if (tahunAjaranValue != undefined && !isNaN(tahunAjaranValue)) {
        filterValue = { ...filterValue, id_tahun_ajaran: tahunAjaranValue };
    }

    if (tahunMasukValue != undefined && !isNaN(tahunMasukValue)) {
        filterValue = { ...filterValue, id_tahun_masuk: tahunMasukValue };
    }

    if (rombelValue != undefined && !isNaN(rombelValue)) {
        filterValue = { ...filterValue, id_rombel: rombelValue };
    }

    if (aktifValue != undefined) {
        filterValue = { ...filterValue, aktif: aktifValue };
    }

    if (keteranganValue != undefined && !isNaN(rombelValue)) {
        filterValue = { ...filterValue, id_keterangan: keteranganValue };
    }

    const tableItemArray = (
        await Siswa.find(filterValue)
            .populate({ path: "id_tempat_lahir", select: "tempat_lahir", model: TempatLahir })
            .populate({ path: "id_jenis_kelamin", select: "jenis_kelamin", model: JenisKelamin })
            .populate({ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran })
            .populate({ path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk })
            .populate({
                path: "id_rombel",
                select: "rombel id_tahun_ajaran",
                populate: [{ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran }],
                model: Rombel,
            })
            .populate({ path: "id_keterangan", select: "keterangan", model: Keterangan })
            .sort({ nisn: 1 })
            .lean()
    )
        .sort((a: any, b: any) => {
            return b.id_rombel.id_tahun_ajaran.tahun_ajaran.localeCompare(a.id_rombel.id_tahun_ajaran.tahun_ajaran);
        })
        .map((tableItemObject: any) => {
            tableItemObject.id_rombel.rombelFull = `${tableItemObject.id_rombel.rombel} ${tableItemObject.id_rombel.id_tahun_ajaran.tahun_ajaran}`;
            tableItemObject.aktif = tableItemObject.aktif == true ? "Aktif" : "Tidak Aktif";

            return tableItemObject;
        });

    const documentCount = await Siswa.countDocuments().lean();
    res.render("pages/pelajar/siswa/table", {
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
                ],
            },
            {
                id: 2,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await Siswa.findOne().select("nisn").sort({ dibuat: -1 }).lean()).nisn : "Tidak Ada",
                    },
                    {
                        id: 2,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await Siswa.findOne().select("nisn").sort({ diubah: -1 }).lean()).nisn : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [
            {
                id: 1,
                display: "Tempat Lahir",
                name: "tempat_lahir",
                query: "tempatLahir",
                placeholder: "Pilih tempat lahir",
                value: tempatLahirValue,
                option: (await TempatLahir.find().select("tempat_lahir").sort({ tempat_lahir: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.tempat_lahir,
                    };
                }),
            },
            {
                id: 2,
                display: "Jenis Kelamin",
                name: "jenis_kelamin",
                query: "jenisKelamin",
                placeholder: "Pilih jenis kelamin",
                value: jenisKelaminValue,
                option: (await JenisKelamin.find().select("jenis_kelamin").sort({ jenis_kelamin: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.jenis_kelamin,
                    };
                }),
            },
            {
                id: 3,
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
                id: 4,
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
                id: 5,
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
                        return b.id_tahun_ajaran.tahun_ajaran - a.id_tahun_ajaran.tahun_ajaran;
                    })
                    .map((itemObject: any) => {
                        return {
                            value: itemObject._id,
                            display: `${itemObject.rombel} ${itemObject.id_tahun_ajaran.tahun_ajaran}`,
                        };
                    }),
            },
            {
                id: 6,
                display: "Status",
                name: "aktif",
                query: "aktif",
                placeholder: "Pilih status",
                value: aktifValue,
                option: [
                    {
                        value: "true",
                        display: "Aktif",
                    },
                    {
                        value: "false",
                        display: "Tidak Aktif",
                    },
                ],
            },
            {
                id: 7,
                display: "Keterangan",
                name: "keterangan",
                query: "keterangan",
                placeholder: "Pilih keterangan",
                value: keteranganValue,
                option: (await Keterangan.find().select("keterangan").sort({ keterangan: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.keterangan,
                    };
                }),
            },
        ],
        tableAttributeArray,
        tableItemArray,
        typeValue,
        siswaValue,
        rombelValue,
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
                    name: "id_tahun_ajaran",
                    display: "Tahun Ajaran",
                    type: "select",
                    value: [
                        (await TahunAjaran.find().select("tahun_ajaran").sort({ tahun_ajaran: -1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.tahun_ajaran];
                        }),
                        null,
                    ],
                    placeholder: "Input tahun ajaran disini",
                    enable: true,
                },
                {
                    id: 7,
                    name: "id_tahun_masuk",
                    display: "Tahun Masuk",
                    type: "select",
                    value: [
                        (await TahunMasuk.find().select("tahun_masuk").sort({ tahun_masuk: -1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.tahun_masuk];
                        }),
                        null,
                    ],
                    placeholder: "Input tahun masuk disini",
                    enable: true,
                },
                {
                    id: 8,
                    name: "id_rombel",
                    display: "Rombel",
                    type: "select",
                    value: [
                        (
                            await Rombel.find(typeValue == "rombel" ? { _id: rombelValue } : {})
                                .select("rombel id_tahun_ajaran")
                                .populate({ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran })
                                .sort({ rombel: 1 })
                                .lean()
                        )
                            .sort((a: any, b: any) => {
                                return b.id_tahun_ajaran.tahun_ajaran.localeCompare(a.id_tahun_ajaran.tahun_ajaran);
                            })
                            .map((itemObject: any) => {
                                return [itemObject._id, `${itemObject.rombel} ${itemObject.id_tahun_ajaran.tahun_ajaran}`];
                            }),
                        typeValue == "rombel" ? rombelValue : null,
                    ],
                    placeholder: "Input rombel disini",
                    enable: true,
                },
                {
                    id: 9,
                    name: "id_keterangan",
                    display: "Keterangan",
                    type: "select",
                    value: [
                        (await Keterangan.find().select("keterangan").sort({ keterangan: 1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.keterangan];
                        }),
                        null,
                    ],
                    placeholder: "Input keterangan disini",
                    enable: true,
                },
                {
                    id: 10,
                    name: "nomor_telepon",
                    display: "Nomor Telepon",
                    type: "number",
                    value: null,
                    placeholder: "Input nomor telepon disini",
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

        let queryString: any = "";

        if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&rombel=${rombelValue}`;
        }

        const attributeArray: any = {};
        const inputArray = tableAttributeArray.map((tableAttributeObject) => {
            const attributeCurrent = tableAttributeObject.value[0];

            if (attributeCurrent != "aktif") {
                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            } else if (attributeCurrent == "aktif") {
                const idKeterangan = req.body.id_keterangan;

                attributeArray.aktif = idKeterangan == 1 ? true : false;

                return idKeterangan == 1 ? true : false;
            }
        });

        if (!inputArray.includes(undefined)) {
            const itemObject = new Siswa({
                _id: (await Siswa.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

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

pelajarSiswaRouter.route("/status").get(async (req, res) => {
    const id: any = req.query.id;
    const keterangan: any = req.query.keterangan;

    const typeValue: any = req.query.type;
    const rombelValue: any = req.query.rombel;

    let queryString = "";

    if (typeValue == "rombel") {
        queryString = `&type=${typeValue}&rombel=${rombelValue}`;
    }

    const dataExist = await Siswa.exists({ _id: id }).lean();

    if (dataExist != null) {
        try {
            await Siswa.updateOne(
                { _id: id },
                {
                    aktif: keterangan == "aktif" ? true : false,
                    id_keterangan: keteranganToId[keterangan],

                    diubah: new Date(),
                }
            ).lean();

            if (keterangan == "lulus") {
                await new Alumni({
                    _id: (await Alumni.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

                    id_siswa: id,
                    id_tahun_lulus: (await TahunLulus.findOne().select("_id").sort({ tahun_lulus: -1 }).lean())._id,
                    id_universitas: 1,
                    id_pendidikan: 1,
                    pekerjaan: "-",

                    dibuat: new Date(),
                    diubah: new Date(),
                }).save();
            } else if (keterangan == "aktif") {
                await Alumni.deleteOne({ id_siswa: id }).lean();
            }

            res.redirect(`./?response=success${queryString}`);
        } catch (error: any) {
            if (error.code == 11000) {
                if (error.keyPattern.id_siswa) {
                    res.redirect(`./?response=error&text=Siswa sudah lulus${queryString}`);
                }
            } else {
                res.redirect(`./?response=error${queryString}`);
            }
        }
    } else if (dataExist == null) {
        res.redirect(`./?response=error&text=Data tidak valid${queryString}`);
    }
});

pelajarSiswaRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;

        const typeValue: any = req.query.type;
        const siswaValue: any = req.query.siswa;
        const rombelValue: any = req.query.rombel;

        let queryString = "";

        if (typeValue == "anggota" || typeValue == "alumni") {
            queryString = `&type=${typeValue}&siswa=${siswaValue}`;
        } else if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&rombel=${rombelValue}`;
        }

        const dataExist = await Siswa.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Siswa.findOne({ _id: id })
                .select("nisn nama_lengkap id_tempat_lahir tanggal_lahir id_jenis_kelamin id_tahun_ajaran id_tahun_masuk id_rombel aktif id_keterangan nomor_telepon")
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
                        name: "id_tahun_ajaran",
                        display: "Tahun Ajaran",
                        type: "select",
                        value: [
                            (await TahunAjaran.find().select("tahun_ajaran").sort({ tahun_ajaran: -1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.tahun_ajaran];
                            }),
                            itemObject.id_tahun_ajaran,
                        ],
                        placeholder: "Input tahun ajaran disini",
                        enable: true,
                    },
                    {
                        id: 7,
                        name: "id_tahun_masuk",
                        display: "Tahun Masuk",
                        type: "select",
                        value: [
                            (await TahunMasuk.find().select("tahun_masuk").sort({ tahun_masuk: -1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.tahun_masuk];
                            }),
                            itemObject.id_tahun_masuk,
                        ],
                        placeholder: "Input tahun masuk disini",
                        enable: true,
                    },
                    {
                        id: 8,
                        name: "id_rombel",
                        display: "Rombel",
                        type: "select",
                        value: [
                            (
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
                                    return [itemObject._id, `${itemObject.rombel} ${itemObject.id_tahun_ajaran.tahun_ajaran}`];
                                }),
                            itemObject.id_rombel,
                        ],
                        placeholder: "Input rombel disini",
                        enable: true,
                    },
                    {
                        id: 9,
                        name: "nomor_telepon",
                        display: "Nomor Telepon",
                        type: "number",
                        value: itemObject.nomor_telepon,
                        placeholder: "Input nomor telepon disini",
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

        let queryString: any = "";

        if (typeValue == "anggota" || typeValue == "alumni") {
            queryString = `&type=${typeValue}&siswa=${siswaValue}`;
        } else if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&rombel=${rombelValue}`;
        }

        if (dataExist != null) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.filter((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                if (!["aktif", "id_keterangan"].includes(attributeCurrent)) {
                    attributeArray[attributeCurrent] = req.body[attributeCurrent];

                    return req.body[attributeCurrent];
                }
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

        let queryString = "";

        if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&rombel=${rombelValue}`;
        }

        const dataExist = await Siswa.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject: any = await Siswa.findOne({ _id: id })
                .select("nisn nama_lengkap id_tempat_lahir tanggal_lahir id_jenis_kelamin id_tahun_ajaran id_tahun_masuk id_rombel aktif id_keterangan nomor_telepon")
                .populate({ path: "id_tempat_lahir", select: "tempat_lahir", model: TempatLahir })
                .populate({ path: "id_jenis_kelamin", select: "jenis_kelamin", model: JenisKelamin })
                .populate({ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran })
                .populate({ path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk })
                .populate({
                    path: "id_rombel",
                    select: "rombel id_tahun_ajaran",
                    populate: [{ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran }],
                    model: Rombel,
                })
                .populate({ path: "id_keterangan", select: "keterangan", model: Keterangan })
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
                        name: "id_tahun_ajaran",
                        display: "Tahun Ajaran",
                        type: "text",
                        value: itemObject.id_tahun_ajaran.tahun_ajaran,
                        placeholder: "Input tahun ajaran disini",
                        enable: false,
                    },
                    {
                        id: 7,
                        name: "id_tahun_masuk",
                        display: "Tahun Masuk",
                        type: "text",
                        value: itemObject.id_tahun_masuk.tahun_masuk,
                        placeholder: "Input tahun masuk disini",
                        enable: false,
                    },
                    {
                        id: 8,
                        name: "id_rombel",
                        display: "Rombel",
                        type: "text",
                        value: `${itemObject.id_rombel.rombel} ${itemObject.id_rombel.id_tahun_ajaran.tahun_ajaran}`,
                        placeholder: "Input rombel disini",
                        enable: false,
                    },
                    {
                        id: 9,
                        name: "aktif",
                        display: "Status",
                        type: "text",
                        value: itemObject.aktif == true ? "Aktif" : "Tidak Aktif",
                        placeholder: "Input status disini",
                        enable: false,
                    },
                    {
                        id: 10,
                        name: "id_keterangan",
                        display: "Keterangan",
                        type: "text",
                        value: itemObject.id_keterangan.keterangan,
                        placeholder: "Input keterangan disini",
                        enable: false,
                    },
                    {
                        id: 11,
                        name: "nomor_telepon",
                        display: "Nomor Telepon",
                        type: "number",
                        value: itemObject.nomor_telepon,
                        placeholder: "Input nomor telepon disini",
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

        let queryString = "";

        if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&rombel=${rombelValue}`;
        }

        if (dataExist != null) {
            const dataIsUsed =
                (await Alumni.exists({ id_siswa: id }).lean()) || (await Anggota.exists({ id_siswa: id }).lean()) || (await Pelanggar.exists({ id_siswa: id }).lean());
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
