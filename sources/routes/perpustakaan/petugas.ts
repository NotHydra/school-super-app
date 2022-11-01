import express, { Router } from "express";

import { headTitle } from ".";

import { localMoment } from "../../utility";

import { JenisKelamin, Peminjaman, Pengembalian, Petugas, TempatLahir } from "../../models";

export const perpustakaanPetugasRouter = Router();

const navActive = [9, 3];
const tableAttributeArray = [
    {
        id: 1,
        label: "Nama",
        value: ["nama"],
        type: "text",
    },
    {
        id: 2,
        label: "Tempat Lahir",
        value: ["id_tempat_lahir", "tempat_lahir"],
        type: "text",
    },
    {
        id: 3,
        label: "Tanggal Lahir",
        value: ["tanggal_lahir"],
        type: "date",
    },
    {
        id: 4,
        label: "Jenis Kelamin",
        value: ["id_jenis_kelamin", "jenis_kelamin"],
        type: "text",
    },
    {
        id: 5,
        label: "Jabatan",
        value: ["jabatan"],
        type: "text",
    },
    {
        id: 6,
        label: "Nomor Telepon",
        value: ["nomor_telepon"],
        type: "text",
    },
];

perpustakaanPetugasRouter.use(express.static("sources/public"));
perpustakaanPetugasRouter.use(express.urlencoded({ extended: false }));

perpustakaanPetugasRouter.route("/").get(async (req, res) => {
    const typeValue: any = req.query.type;
    const petugasValue: any = req.query.petugas;

    const tempatLahirValue: any = req.query.tempatLahir;
    const jenisKelaminValue: any = req.query.jenisKelamin;
    let filterValue = {};

    if (petugasValue != undefined && !isNaN(petugasValue)) {
        filterValue = { ...filterValue, _id: petugasValue };
    }

    if (tempatLahirValue != undefined && !isNaN(tempatLahirValue)) {
        filterValue = { ...filterValue, id_tempat_lahir: tempatLahirValue };
    }

    if (jenisKelaminValue != undefined && !isNaN(jenisKelaminValue)) {
        filterValue = { ...filterValue, id_jenis_kelamin: jenisKelaminValue };
    }

    const tableItemArray = await Petugas.find(filterValue)
        .populate({
            path: "id_tempat_lahir",
            select: "tempat_lahir",
            model: TempatLahir,
        })
        .populate({
            path: "id_jenis_kelamin",
            select: "jenis_kelamin",
            model: JenisKelamin,
        })
        .sort({ nama: 1 })
        .lean();

    const documentCount = await Petugas.countDocuments().lean();
    res.render("pages/perpustakaan/petugas/table", {
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
                        title: "Petugas",
                        icon: "user-tie",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await Petugas.findOne().select("nama").sort({ dibuat: -1 }).lean()).nama : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await Petugas.findOne().select("nama").sort({ diubah: -1 }).lean()).nama : "Tidak Ada",
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
        ],
        tableAttributeArray,
        tableItemArray,
        typeValue,
        petugasValue,
    });
});

perpustakaanPetugasRouter
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
                    name: "nama",
                    display: "Nama",
                    type: "text",
                    value: null,
                    placeholder: "Input nama disini",
                    enable: true,
                },
                {
                    id: 2,
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
                    id: 3,
                    name: "tanggal_lahir",
                    display: "Tanggal Lahir",
                    type: "date",
                    value: null,
                    placeholder: "Input tanggal lahir disini",
                    enable: true,
                },
                {
                    id: 4,
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
                    id: 5,
                    name: "jabatan",
                    display: "Jabatan",
                    type: "text",
                    value: null,
                    placeholder: "Input jabatan disini",
                    enable: true,
                },
                {
                    id: 6,
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
            const itemObject = new Petugas({
                _id: (await Petugas.findOne().select("_id").sort({ _id: -1 }).lean())._id + 1 || 1,

                ...attributeArray,

                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await itemObject.save();
                res.redirect("create?response=success");
            } catch (error: any) {
                if (error.code == 11000) {
                    if (error.keyPattern.nomor_telepon) {
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

perpustakaanPetugasRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;

        const typeValue: any = req.query.type;
        const petugasValue: any = req.query.petugas;

        let queryString = "";

        if (typeValue == "peminjaman" || typeValue == "pengembalian") {
            queryString = `&type=${typeValue}&petugas=${petugasValue}`;
        }

        const dataExist = await Petugas.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await Petugas.findOne({ _id: id }).select("nama id_tempat_lahir tanggal_lahir id_jenis_kelamin jabatan nomor_telepon").lean();

            res.render("pages/perpustakaan/petugas/update", {
                headTitle,
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Diubah" : "Data Gagal Diubah",
                toastText: req.query.text,
                id,
                typeValue,
                petugasValue,
                detailedInputArray: [
                    {
                        id: 1,
                        name: "nama",
                        display: "Nama",
                        type: "text",
                        value: itemObject.nama,
                        placeholder: "Input nama disini",
                        enable: true,
                    },
                    {
                        id: 2,
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
                        id: 3,
                        name: "tanggal_lahir",
                        display: "Tanggal Lahir",
                        type: "date",
                        value: localMoment(itemObject.tanggal_lahir).format("YYYY-MM-DD"),
                        placeholder: "Input tanggal lahir disini",
                        enable: true,
                    },
                    {
                        id: 4,
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
                        id: 5,
                        name: "jabatan",
                        display: "Jabatan",
                        type: "text",
                        value: itemObject.jabatan,
                        placeholder: "Input jabatan disini",
                        enable: true,
                    },
                    {
                        id: 6,
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
            res.redirect(`./?response=error&text=Data tidak valid${queryString}`);
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const dataExist = await Petugas.exists({ _id: id }).lean();

        const typeValue: any = req.query.type;
        const petugasValue: any = req.query.petugas;

        let queryString = "";

        if (typeValue == "peminjaman" || typeValue == "pengembalian") {
            queryString = `&type=${typeValue}&petugas=${petugasValue}`;
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
                    await Petugas.updateOne(
                        { _id: id },
                        {
                            ...attributeArray,

                            diubah: new Date(),
                        }
                    ).lean();
                    res.redirect(`update?id=${id}&response=success${queryString}`);
                } catch (error: any) {
                    if (error.code == 11000) {
                        if (error.keyPattern.nomor_telepon) {
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

perpustakaanPetugasRouter
    .route("/delete")
    .get(async (req, res) => {
        const id: any = req.query.id;
        const dataExist = await Petugas.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject: any = await Petugas.findOne({ _id: id })
                .select("nama id_tempat_lahir tanggal_lahir id_jenis_kelamin jabatan nomor_telepon")
                .populate({
                    path: "id_tempat_lahir",
                    select: "tempat_lahir",
                    model: TempatLahir,
                })
                .populate({
                    path: "id_jenis_kelamin",
                    select: "jenis_kelamin",
                    model: JenisKelamin,
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
                        name: "nama",
                        display: "Nama",
                        type: "text",
                        value: itemObject.nama,
                        placeholder: "Input nama disini",
                        enable: false,
                    },
                    {
                        id: 2,
                        name: "id_tempat_lahir",
                        display: "Tempat Lahir",
                        type: "text",
                        value: itemObject.id_tempat_lahir.tempat_lahir,
                        placeholder: "Input tempat lahir disini",
                        enable: false,
                    },
                    {
                        id: 3,
                        name: "tanggal_lahir",
                        display: "Tanggal Lahir",
                        type: "date",
                        value: localMoment(itemObject.tanggal_lahir).format("YYYY-MM-DD"),
                        placeholder: "Input tanggal lahir disini",
                        enable: false,
                    },
                    {
                        id: 4,
                        name: "id_jenis_kelamin",
                        display: "Jenis Kelamin",
                        type: "select",
                        value: itemObject.id_jenis_kelamin.jenis_kelamin,
                        placeholder: "Input jenis kelamin disini",
                        enable: false,
                    },
                    {
                        id: 5,
                        name: "jabatan",
                        display: "Jabatan",
                        type: "text",
                        value: itemObject.jabatan,
                        placeholder: "Input jabatan disini",
                        enable: false,
                    },
                    {
                        id: 6,
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
        const dataExist = await Petugas.exists({ _id: id }).lean();

        if (dataExist != null) {
            const dataIsUsed = (await Peminjaman.exists({ id_petugas: id }).lean()) || (await Pengembalian.exists({ id_petugas: id }).lean());

            if (dataIsUsed == null) {
                try {
                    await Petugas.deleteOne({ _id: id }).lean();
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
