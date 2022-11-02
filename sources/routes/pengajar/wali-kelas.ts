import express, { Router } from "express";

import { headTitle } from ".";

import { Guru, Rombel, TahunRombel } from "../../models";

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
        label: "Tahun Rombel",
        value: ["id_tahun_rombel", "tahun_rombel"],
        type: "text",
    },
];

pengajarWaliKelasRouter.use(express.static("sources/public"));
pengajarWaliKelasRouter.use(express.urlencoded({ extended: false }));

pengajarWaliKelasRouter.route("/").get(async (req, res) => {
    const typeValue: any = req.query.type;
    const waliKelasValue: any = req.query.waliKelas;

    const tahunRombelValue: any = req.query.tahunRombel;
    let filterValue = {};

    if (waliKelasValue != undefined && !isNaN(waliKelasValue)) {
        filterValue = { ...filterValue, id_wali_kelas: waliKelasValue };
    }

    if (tahunRombelValue != undefined && !isNaN(tahunRombelValue)) {
        filterValue = { ...filterValue, id_tahun_rombel: tahunRombelValue };
    }

    let tableItemArray = (
        await Rombel.find(filterValue)
            .populate({
                path: "id_wali_kelas",
                select: "nip nama_lengkap",
                model: Guru,
            })
            .populate({
                path: "id_tahun_rombel",
                select: "tahun_rombel",
                model: TahunRombel,
            })
            .select("rombel id_wali_kelas id_tahun_rombel")
            .sort({ rombel: 1 })
            .lean()
    ).sort((a: any, b: any) => {
        return b.id_tahun_rombel.tahun_rombel - a.id_tahun_rombel.tahun_rombel;
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
                display: "Tahun Rombel",
                name: "tahun_rombel",
                query: "tahunRombel",
                placeholder: "Pilih tahun rombel",
                value: tahunRombelValue,
                option: (await TahunRombel.find().select("tahun_rombel").sort({ tahun_rombel: -1 }).lean()).map((itemObject) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.tahun_rombel,
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
