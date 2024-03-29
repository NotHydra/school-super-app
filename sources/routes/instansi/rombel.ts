import express, { Router } from "express";

import { headTitle } from ".";

import { Alumni, Guru, Jurusan, Rombel, Siswa, TahunAjaran, TahunLulus, Tingkat } from "../../models";

export const instansiRombelRouter = Router();

const navActive = [8, 2];
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
        label: "Tahun Ajaran",
        value: ["id_tahun_ajaran", "tahun_ajaran"],
        type: "text",
    },
];

instansiRombelRouter.use(express.static("sources/public"));
instansiRombelRouter.use(express.urlencoded({ extended: false }));

instansiRombelRouter.route("/").get(async (req, res) => {
    const typeValue: any = req.query.type;
    const rombelValue: any = req.query.rombel;

    const tingkatValue: any = req.query.tingkat;
    const jurusanValue: any = req.query.jurusan;
    const tahunAjaranValue: any = req.query.tahunAjaran;
    let filterValue = {};

    if (rombelValue != undefined && !isNaN(rombelValue)) {
        filterValue = { ...filterValue, _id: rombelValue };
    }

    if (tingkatValue != undefined && !isNaN(tingkatValue)) {
        filterValue = { ...filterValue, id_tingkat: tingkatValue };
    }

    if (jurusanValue != undefined && !isNaN(jurusanValue)) {
        filterValue = { ...filterValue, id_jurusan: jurusanValue };
    }

    if (tahunAjaranValue != undefined && !isNaN(tahunAjaranValue)) {
        filterValue = { ...filterValue, id_tahun_ajaran: tahunAjaranValue };
    }

    const tableItemArray = (
        await Rombel.find(filterValue)
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
                path: "id_tahun_ajaran",
                select: "tahun_ajaran",
                model: TahunAjaran,
            })
            .sort({ rombel: 1 })
            .lean()
    ).sort((a: any, b: any) => {
        return b.id_tahun_ajaran.tahun_ajaran.localeCompare(a.id_tahun_ajaran.tahun_ajaran);
    });

    const documentCount = await Rombel.countDocuments().lean();
    res.render("pages/instansi/rombel/table", {
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
                        title: "Rombel",
                        icon: "archway",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await Rombel.findOne().select("rombel").sort({ dibuat: -1 }).lean()).rombel : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await Rombel.findOne().select("rombel").sort({ diubah: -1 }).lean()).rombel : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [
            {
                id: 1,
                display: "Tingkat",
                name: "tingkat",
                query: "tingkat",
                placeholder: "Pilih tingkat",
                value: tingkatValue,
                option: (await Tingkat.find().select("tingkat").sort({ tingkat: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.tingkat,
                    };
                }),
            },
            {
                id: 2,
                display: "Jurusan",
                name: "jurusan",
                query: "jurusan",
                placeholder: "Pilih jurusan",
                value: jurusanValue,
                option: (await Jurusan.find().select("jurusan").sort({ jurusan: 1 }).lean()).map((itemObject: any) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.jurusan,
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
        ],
        tableAttributeArray,
        tableItemArray,
        typeValue,
        rombelValue,
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
                        (await Guru.find().select("nip nama_lengkap").sort({ nip: 1 }).lean()).map((itemObject) => {
                            return [itemObject._id, `${itemObject.nip} - ${itemObject.nama_lengkap}`];
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
                        (await Tingkat.find().select("tingkat").sort({ tingkat: 1 }).lean()).map((itemObject) => {
                            return [itemObject._id, itemObject.tingkat];
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
                        (await Jurusan.find().select("jurusan").sort({ jurusan: 1 }).lean()).map((itemObject) => {
                            return [itemObject._id, itemObject.jurusan];
                        }),
                        null,
                    ],
                    placeholder: "Input jurusan disini",
                    enable: true,
                },
                {
                    id: 5,
                    name: "id_tahun_ajaran",
                    display: "Tahun Ajaran",
                    type: "select",
                    value: [
                        (await TahunAjaran.find().select("tahun_ajaran").sort({ tahun_ajaran: -1 }).lean()).map((itemObject) => {
                            return [itemObject._id, itemObject.tahun_ajaran];
                        }),
                        null,
                    ],
                    placeholder: "Input tahun ajaran disini",
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
                _id: (await Rombel.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

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

instansiRombelRouter.route("/update-lulus").get(async (req, res) => {
    const id: any = req.query.id;

    const typeValue: any = req.query.type;
    const rombelValue: any = req.query.rombel;

    let queryString: any = "";

    if (typeValue == "wali-kelas") {
        queryString = `&type=${typeValue}&rombel=${rombelValue}`;
    }

    const dataExist = await Rombel.exists({ _id: id }).lean();

    if (dataExist != null) {
        try {
            const siswaCount = await Siswa.countDocuments({ id_rombel: id }).lean();
            const siswaArray = await Siswa.find({ id_rombel: id, aktif: true, id_keterangan: 1 }).select("_id").lean();
            const alumniLatestId = (await Alumni.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1;
            const tahunLulusLatestId = (await TahunLulus.findOne().select("_id").sort({ tahun_lulus: -1 }).lean())._id;

            await Siswa.updateMany(
                { id_rombel: id, aktif: true, id_keterangan: 1 },
                {
                    aktif: false,
                    id_keterangan: 3,

                    diubah: new Date(),
                }
            ).lean();

            await Alumni.insertMany(
                await Promise.all(
                    siswaArray.map(async (siswaObject, siswaIndex) => {
                        return {
                            _id: alumniLatestId + siswaIndex,

                            id_siswa: siswaObject._id,
                            id_tahun_lulus: tahunLulusLatestId,
                            id_universitas: 1,
                            id_pendidikan: 1,
                            pekerjaan: "-",

                            dibuat: new Date(),
                            diubah: new Date(),
                        };
                    })
                )
            );

            res.redirect(`./?response=success${queryString}&text=${siswaArray.length} dari ${siswaCount} siswa diluluskan`);
        } catch (error: any) {
            res.redirect(`./?response=error${queryString}`);
        }
    } else if (dataExist == null) {
        res.redirect(`./?response=error&text=Data tidak valid${queryString}`);
    }
});

instansiRombelRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;

        const typeValue: any = req.query.type;
        const rombelValue: any = req.query.rombel;

        let queryString: any = "";

        if (typeValue == "wali-kelas") {
            queryString = `&type=${typeValue}&rombel=${rombelValue}`;
        }

        const dataExist = await Rombel.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Rombel.findOne({ _id: id }).select("rombel id_wali_kelas id_tingkat id_jurusan id_tahun_ajaran").lean();

            res.render("pages/instansi/rombel/update", {
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
                            (await Guru.find().select("nip nama_lengkap").sort({ nip: 1 }).lean()).map((itemObject) => {
                                return [itemObject._id, `${itemObject.nip} - ${itemObject.nama_lengkap}`];
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
                            (await Tingkat.find().select("tingkat").sort({ tingkat: 1 }).lean()).map((itemObject) => {
                                return [itemObject._id, itemObject.tingkat];
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
                            (await Jurusan.find().select("jurusan").sort({ jurusan: 1 }).lean()).map((itemObject) => {
                                return [itemObject._id, itemObject.jurusan];
                            }),
                            itemObject.id_jurusan,
                        ],
                        placeholder: "Input jurusan disini",
                        enable: true,
                    },
                    {
                        id: 5,
                        name: "id_tahun_ajaran",
                        display: "Tahun Ajaran",
                        type: "select",
                        value: [
                            (await TahunAjaran.find().select("tahun_ajaran").sort({ tahun_ajaran: -1 }).lean()).map((itemObject) => {
                                return [itemObject._id, itemObject.tahun_ajaran];
                            }),
                            itemObject.id_tahun_ajaran,
                        ],
                        placeholder: "Input tahun ajaran disini",
                        enable: true,
                    },
                ],
                typeValue,
                rombelValue,
            });
        } else if (dataExist == null) {
            res.redirect(`./?response=error&text=Data tidak valid${queryString}`);
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Rombel.exists({ _id: id }).lean();

        const typeValue: any = req.query.type;
        const rombelValue: any = req.query.rombel;

        let queryString: any = "";

        if (typeValue == "wali-kelas") {
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
                    await Rombel.updateOne(
                        { _id: id },
                        {
                            ...attributeArray,

                            diubah: new Date(),
                        }
                    ).lean();
                    res.redirect(`update?id=${id}&response=success${queryString}`);
                } catch (error: any) {
                    res.redirect(`update?id=${id}&response=error${queryString}`);
                }
            } else if (inputArray.includes(undefined)) {
                res.redirect(`update?id=${id}&response=error&text=Data tidak lengkap${queryString}`);
            }
        } else if (dataExist == null) {
            res.redirect(`./?response=error&text=Data tidak valid${queryString}`);
        }
    });

instansiRombelRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Rombel.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject: any = await Rombel.findOne({ _id: id })
                .select("rombel id_wali_kelas id_tingkat id_jurusan id_tahun_ajaran")
                .populate({
                    path: "id_wali_kelas",
                    select: "nip nama_lengkap",
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
                    path: "id_tahun_ajaran",
                    select: "tahun_ajaran",
                    model: TahunAjaran,
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
                        value: `${itemObject.id_wali_kelas.nip} - ${itemObject.id_wali_kelas.nama_lengkap}`,
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
                        name: "id_tahun_ajaran",
                        display: "Tahun Ajaran",
                        type: "text",
                        value: itemObject.id_tahun_ajaran.tahun_ajaran,
                        placeholder: "Input tahun ajaran disini",
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
        const dataExist = await Rombel.exists({ _id: id }).lean();

        if (dataExist != null) {
            const dataIsUsed = await Siswa.exists({ id_rombel: id }).lean();

            if (dataIsUsed == null) {
                try {
                    await Rombel.deleteOne({ _id: id }).lean();
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
