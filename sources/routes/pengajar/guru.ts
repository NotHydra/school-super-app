import express, { Router } from "express";

import { headTitle } from ".";

import { localMoment } from "../../utility";

import { Guru, Jabatan, JenisKelamin, Pendidikan, Rombel, TempatLahir, Universitas } from "../../models";

export const pengajarGuruRouter = Router();

const navActive = [2, 1];
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
    const typeValue: any = req.query.type;
    const guruValue: any = req.query.guru;

    const tempatLahirValue: any = req.query.tempatLahir;
    const jenisKelaminValue: any = req.query.jenisKelamin;
    const jabatanValue: any = req.query.jabatan;
    const universitasValue: any = req.query.universitas;
    const pendidikanValue: any = req.query.pendidikan;
    let filterValue = {};

    if (guruValue != undefined && !isNaN(guruValue)) {
        filterValue = { ...filterValue, _id: guruValue };
    }

    if (tempatLahirValue != undefined && !isNaN(tempatLahirValue)) {
        filterValue = { ...filterValue, id_tempat_lahir: tempatLahirValue };
    }

    if (jenisKelaminValue != undefined && !isNaN(jenisKelaminValue)) {
        filterValue = { ...filterValue, id_jenis_kelamin: jenisKelaminValue };
    }

    if (jabatanValue != undefined && !isNaN(jabatanValue)) {
        filterValue = { ...filterValue, id_jabatan: jabatanValue };
    }

    if (universitasValue != undefined && !isNaN(universitasValue)) {
        filterValue = { ...filterValue, id_universitas: universitasValue };
    }

    if (pendidikanValue != undefined && !isNaN(pendidikanValue)) {
        filterValue = { ...filterValue, id_pendidikan: pendidikanValue };
    }

    const tableItemArray = await Guru.find(filterValue)
        .populate({ path: "id_tempat_lahir", select: "tempat_lahir", model: TempatLahir })
        .populate({ path: "id_jenis_kelamin", select: "jenis_kelamin", model: JenisKelamin })
        .populate({ path: "id_jabatan", select: "jabatan", model: Jabatan })
        .populate({ path: "id_universitas", select: "universitas", model: Universitas })
        .populate({ path: "id_pendidikan", select: "singkatan", model: Pendidikan })
        .sort({ nip: 1 })
        .lean();

    const documentCount = await Guru.countDocuments().lean();
    res.render("pages/pengajar/guru/table", {
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
                        title: "Laki-Laki & Perempuan",
                        icon: "restroom",
                        value: `${await Guru.find({ id_jenis_kelamin: 1 }).select("_id").countDocuments().lean()} - ${await Guru.find({ id_jenis_kelamin: 2 })
                            .select("_id")
                            .countDocuments()
                            .lean()}`,
                    },
                ],
            },
            {
                id: 3,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await Guru.findOne().select("nip").sort({ dibuat: -1 }).lean()).nip : "Tidak Ada",
                    },
                ],
            },
            {
                id: 4,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await Guru.findOne().select("nip").sort({ diubah: -1 }).lean()).nip : "Tidak Ada",
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
                display: "Jabatan",
                name: "jabatan",
                query: "jabatan",
                placeholder: "Pilih jabatan",
                value: jabatanValue,
                option: (await Jabatan.find().select("jabatan").sort({ jabatan: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.jabatan,
                    };
                }),
            },
            {
                id: 4,
                display: "Universitas",
                name: "universitas",
                query: "universitas",
                placeholder: "Pilih universitas",
                value: universitasValue,
                option: (await Universitas.find().select("universitas").sort({ universitas: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.universitas,
                    };
                }),
            },
            {
                id: 5,
                display: "Pendidikan",
                name: "pendidikan",
                query: "pendidikan",
                placeholder: "Pilih pendidikan",
                value: pendidikanValue,
                option: (await Pendidikan.find().select("pendidikan singkatan").sort({ pendidikan: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: `${itemObject.pendidikan} - ${itemObject.singkatan}`,
                    };
                }),
            },
        ],
        tableAttributeArray,
        tableItemArray,
        typeValue,
        guruValue,
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
                    name: "id_jabatan",
                    display: "Jabatan",
                    type: "select",
                    value: [
                        (await Jabatan.find().select("jabatan").sort({ jabatan: 1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.jabatan];
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
                        (await Universitas.find().select("universitas").sort({ universitas: 1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, itemObject.universitas];
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
                        (await Pendidikan.find().select("pendidikan singkatan").sort({ pendidikan: 1 }).lean()).map((itemObject: any) => {
                            return [itemObject._id, `${itemObject.pendidikan} - ${itemObject.singkatan}`];
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
                _id: (await Guru.findOne().select("_id").sort({ _id: -1 }).lean())._id + 1 || 1,

                ...attributeArray,

                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await itemObject.save();
                res.redirect("create?response=success");
            } catch (error: any) {
                if (error.code == 11000) {
                    if (error.keyPattern.nip) {
                        res.redirect("create?response=error&text=NIP sudah digunakan");
                    } else if (error.keyPattern.nomor_telepon) {
                        res.redirect("create?response=error&text=Nomor telepon sudah digunakan");
                    }
                } else {
                    res.redirect("create?response=error");
                }
            }
        } else if (inputArray.includes(undefined)) {
            res.redirect("create?response=error&text=Data tidak lengkap");
        }
    });

pengajarGuruRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;

        const typeValue: any = req.query.type;
        const guruValue: any = req.query.guru;

        let queryString: any = "";

        if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&guru=${guruValue}`;
        }

        const dataExist = await Guru.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Guru.findOne({ _id: id })
                .select("nip nama_lengkap id_tempat_lahir tanggal_lahir id_jenis_kelamin id_jabatan id_universitas id_pendidikan nomor_telepon")
                .lean();

            res.render("pages/pengajar/guru/update", {
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
                        name: "id_jabatan",
                        display: "Jabatan",
                        type: "select",
                        value: [
                            (await Jabatan.find().select("jabatan").sort({ jabatan: 1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.jabatan];
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
                            (await Universitas.find().select("universitas").sort({ universitas: 1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, itemObject.universitas];
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
                            (await Pendidikan.find().select("pendidikan singkatan").sort({ pendidikan: 1 }).lean()).map((itemObject: any) => {
                                return [itemObject._id, `${itemObject.pendidikan} - ${itemObject.singkatan}`];
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
                typeValue,
                guruValue,
            });
        } else if (dataExist == null) {
            res.redirect(`./?response=error&text=Data tidak valid${queryString}`);
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Guru.exists({ _id: id }).lean();

        const typeValue: any = req.query.type;
        const guruValue: any = req.query.guru;

        let queryString: any = "";

        if (typeValue == "rombel") {
            queryString = `&type=${typeValue}&guru=${guruValue}`;
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
                    await Guru.updateOne(
                        { _id: id },
                        {
                            ...attributeArray,

                            diubah: new Date(),
                        }
                    ).lean();

                    res.redirect(`update?id=${id}&response=success${queryString}`);
                } catch (error: any) {
                    if (error.code == 11000) {
                        if (error.keyPattern.nip) {
                            res.redirect(`update?id=${id}&response=error&text=NIP sudah digunakan${queryString}`);
                        } else if (error.keyPattern.nomor_telepon) {
                            res.redirect(`update?id=${id}&response=error&text=Nomor telepon sudah digunakan${queryString}`);
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

pengajarGuruRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Guru.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject: any = await Guru.findOne({ _id: id })
                .select("nip nama_lengkap id_tempat_lahir tanggal_lahir id_jenis_kelamin id_jabatan id_universitas id_pendidikan nomor_telepon")
                .populate({ path: "id_tempat_lahir", select: "tempat_lahir", model: TempatLahir })
                .populate({ path: "id_jenis_kelamin", select: "jenis_kelamin", model: JenisKelamin })
                .populate({ path: "id_jabatan", select: "jabatan", model: Jabatan })
                .populate({ path: "id_universitas", select: "universitas", model: Universitas })
                .populate({ path: "id_pendidikan", select: "pendidikan singkatan", model: Pendidikan })
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
        const dataExist = await Guru.exists({ _id: id }).lean();

        if (dataExist != null) {
            let dataIsUsed = null;
            (await Rombel.find().select("semester").lean()).forEach((rombelObject: any) => {
                rombelObject.semester.forEach((semesterObject: any) => {
                    semesterObject.mata_pelajaran.forEach((mataPelajaranObject: any) => {
                        if (mataPelajaranObject.id_guru == id) {
                            dataIsUsed = mataPelajaranObject;
                        }
                    });
                });
            });

            if (dataIsUsed == null) {
                try {
                    await Guru.deleteOne({ _id: id }).lean();
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
