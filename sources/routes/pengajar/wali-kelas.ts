import express, { Router } from "express";

import { headTitle } from ".";

import { Guru, Rombel, TahunAjaran } from "../../models";

export const pengajarWaliKelasRouter = Router();

const navActive = [4, 3];
const tableAttributeArray = [
    {
        id: 1,
        label: "NIP",
        value: ["id_wali_kelas", "nip"],
        type: "text",
    },
    {
        id: 2,
        label: "Nama Lengkap",
        value: ["id_wali_kelas", "nama_lengkap"],
        type: "text",
    },
    {
        id: 3,
        label: "Rombel",
        value: ["rombel"],
        type: "text",
    },
    {
        id: 4,
        label: "Tahun Ajaran Rombel",
        value: ["id_tahun_ajaran", "tahun_ajaran"],
        type: "text",
    },
];

pengajarWaliKelasRouter.use(express.static("sources/public"));
pengajarWaliKelasRouter.use(express.urlencoded({ extended: false }));

pengajarWaliKelasRouter.route("/").get(async (req, res) => {
    const typeValue: any = req.query.type;
    const waliKelasValue: any = req.query.waliKelas;

    const tahunAjaranValue: any = req.query.tahunAjaran;
    let filterValue = {};

    if (waliKelasValue != undefined && !isNaN(waliKelasValue)) {
        filterValue = { ...filterValue, id_wali_kelas: waliKelasValue };
    }

    if (tahunAjaranValue != undefined && !isNaN(tahunAjaranValue)) {
        filterValue = { ...filterValue, id_tahun_ajaran: tahunAjaranValue };
    }

    let tableItemArray = (
        await Rombel.find(filterValue)
            .select("rombel id_wali_kelas id_tahun_ajaran")
            .populate({
                path: "id_wali_kelas",
                select: "nip nama_lengkap",
                model: Guru,
            })
            .populate({
                path: "id_tahun_ajaran",
                select: "tahun_ajaran",
                model: TahunAjaran,
            })
            .sort({ rombel: 1 })
            .lean()
    ).sort((a: any, b: any) => {
        return b.id_tahun_ajaran.tahun_ajaran - a.id_tahun_ajaran.tahun_ajaran;
    });

    const uniqueWaliKelasId: number[] = [
        ...new Set(
            tableItemArray.map((tableItemObject: any) => {
                return tableItemObject.id_wali_kelas._id;
            })
        ),
    ];

    const documentCount = await Rombel.countDocuments().lean();
    res.render("pages/pengajar/wali-kelas/table", {
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
                        title: "Wali Kelas",
                        icon: "user-tie",
                        value: documentCount,
                    },
                ],
            },
        ],
        filterArray: [
            {
                id: 1,
                display: "Wali Kelas",
                name: "wali_kelas",
                query: "waliKelas",
                placeholder: "Pilih wali kelas",
                value: waliKelasValue,
                option: (await Guru.find({ _id: uniqueWaliKelasId }).select("nip nama_lengkap").sort({ nip: 1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: `${itemObject.nip} - ${itemObject.nama_lengkap}`,
                    };
                }),
            },
            {
                id: 2,
                display: "Tahun Ajaran Rombel",
                name: "tahun_ajaran",
                query: "tahunAjaran",
                placeholder: "Pilih tahun ajaran rombel",
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
        waliKelasValue,
    });
});
