import express, { Router } from "express";

import { headTitle } from ".";

import { Keterangan, Klasifikasi, Pelanggar, Rombel, Siswa, TahunAjaran, TahunMasuk, Tipe } from "../../models";

export const pelanggaranSkorRouter = Router();

const navActive = [12, 5];
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
        label: "Rombel",
        value: ["id_rombel", "rombelFull"],
        type: "text",
    },
    {
        id: 4,
        label: "Tahun Ajaran",
        value: ["id_tahun_ajaran", "tahun_ajaran"],
        type: "text",
    },
    {
        id: 5,
        label: "Tahun Masuk",
        value: ["id_tahun_masuk", "tahun_masuk"],
        type: "text",
    },
    {
        id: 6,
        label: "Skor",
        value: ["skor"],
        type: "text",
    },
    {
        id: 7,
        label: "Status",
        value: ["aktif"],
        type: "text",
    },
    {
        id: 8,
        label: "Keterangan",
        value: ["id_keterangan", "keterangan"],
        type: "text",
    },
];

pelanggaranSkorRouter.use(express.static("sources/public"));
pelanggaranSkorRouter.use(express.urlencoded({ extended: false }));

pelanggaranSkorRouter.route("/").get(async (req, res) => {
    const rombelValue: any = req.query.rombel;
    const tahunAjaranValue: any = req.query.tahunAjaran;
    const tahunMasukValue: any = req.query.tahunMasuk;
    const aktifValue: any = req.query.aktif;
    const keteranganValue: any = req.query.keterangan;
    let filterValue = {};

    let tableItemArray = await Pelanggar.find(filterValue)
        .select("id_siswa id_klasifikasi")
        .populate({
            path: "id_siswa",
            select: "nisn nama_lengkap id_rombel id_tahun_ajaran id_tahun_masuk aktif id_keterangan",
            populate: [
                {
                    path: "id_rombel",
                    select: "rombel id_tahun_ajaran",
                    populate: [{ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran }],
                    model: Rombel,
                },
                { path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran },
                { path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk },
                { path: "id_keterangan", select: "keterangan", model: Keterangan },
            ],
            model: Siswa,
        })
        .populate({
            path: "id_klasifikasi",
            select: "id_tipe",
            populate: [{ path: "id_tipe", select: "skor", model: Tipe }],
            model: Klasifikasi,
        })
        .sort({ id_siswa: -1 })
        .lean();

    if (rombelValue != undefined && !isNaN(rombelValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_siswa.id_rombel._id == rombelValue) {
                return tableItemObject;
            }
        });
    }

    if (tahunAjaranValue != undefined && !isNaN(tahunAjaranValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_siswa.id_tahun_ajaran._id == tahunAjaranValue) {
                return tableItemObject;
            }
        });
    }

    if (tahunMasukValue != undefined && !isNaN(tahunMasukValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_siswa.id_tahun_masuk._id == tahunMasukValue) {
                return tableItemObject;
            }
        });
    }

    if (aktifValue != undefined) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (`${tableItemObject.id_siswa.aktif}` == aktifValue) {
                return tableItemObject;
            }
        });
    }

    if (keteranganValue != undefined && !isNaN(keteranganValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_siswa.id_keterangan._id == keteranganValue) {
                return tableItemObject;
            }
        });
    }

    tableItemArray = tableItemArray.map((tableItemObject: any) => {
        tableItemObject.id_siswa.id_rombel.rombelFull = `${tableItemObject.id_siswa.id_rombel.rombel} ${tableItemObject.id_siswa.id_rombel.id_tahun_ajaran.tahun_ajaran}`;

        return tableItemObject;
    });

    const pelanggarScoreArray: any = [];
    tableItemArray.forEach((itemObject: any) => {
        let pelanggarScoreIsNew = true;
        pelanggarScoreArray.find((pelanggarScoreObject: any) => {
            if (itemObject.id_siswa._id == pelanggarScoreObject._id) {
                pelanggarScoreIsNew = false;

                pelanggarScoreObject.skor += itemObject.id_klasifikasi.id_tipe.skor;
            }
        });

        if (pelanggarScoreIsNew) {
            pelanggarScoreArray.push({
                ...itemObject.id_siswa,
                aktif: itemObject.id_siswa.aktif == true ? "Aktif" : "Tidak Aktif",
                skor: itemObject.id_klasifikasi.id_tipe.skor,
            });
        }
    });

    pelanggarScoreArray.sort((a: any, b: any) => {
        return b.skor - a.skor;
    });

    res.render("pages/pelanggaran/skor/table", {
        headTitle,
        navActive,
        toastResponse: req.query.response,
        toastTitle: req.query.response == "success" ? "Berhasil" : "Gagal",
        toastText: req.query.text,
        cardItemArray: [],
        filterArray: [
            {
                id: 1,
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
                        return b.id_tahun_ajaran.tahun_ajaran.localeCompare(a.id_tahun_ajaran.tahun_ajaran);
                    })
                    .map((itemObject: any) => {
                        return {
                            value: itemObject._id,
                            display: `${itemObject.rombel} ${itemObject.id_tahun_ajaran.tahun_ajaran}`,
                        };
                    }),
            },
            {
                id: 2,
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
                id: 3,
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
                id: 4,
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
                id: 5,
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
        tableItemArray: pelanggarScoreArray,
    });
});

pelanggaranSkorRouter.route("/status").get(async (req, res) => {
    const id: any = req.query.id;

    const dataExist = await Siswa.exists({ _id: id, aktif: true, id_keterangan: 1 }).lean();

    if (dataExist != null) {
        try {
            await Siswa.updateOne(
                { _id: id, aktif: true, id_keterangan: 1 },
                {
                    aktif: false,
                    id_keterangan: 2,

                    diubah: new Date(),
                }
            ).lean();

            res.redirect(`./?response=success`);
        } catch (error: any) {
            res.redirect(`./?response=error`);
        }
    } else if (dataExist == null) {
        res.redirect(`./?response=error&text=Data tidak valid`);
    }
});
