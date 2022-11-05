import express, { Router } from "express";
import path from "path";

import { app } from "../..";
import { headTitle } from ".";

import { localMoment } from "../../utility";

import { Indentitas } from "../../models";

export const sekolahIndentitasRouter = Router();

const navActive = [3, 2];

sekolahIndentitasRouter.use(express.static("sources/public"));
sekolahIndentitasRouter.use(express.urlencoded({ extended: true }));

sekolahIndentitasRouter.route("/").get(async (req, res) => {
    const itemObject = await Indentitas.findOne({ _id: 1 }).lean();

    res.render("pages/sekolah/indentitas/index", {
        headTitle,
        navActive,
        detailedInputArray: [
            {
                id: 1,
                name: "nama_aplikasi",
                display: "Nama Aplikasi",
                type: "text",
                value: itemObject.nama_aplikasi,
                placeholder: "Input nama aplikasi disini",
                enable: false,
            },
            {
                id: 2,
                name: "nama_sekolah",
                display: "Nama Sekolah",
                type: "text",
                value: itemObject.nama_sekolah,
                placeholder: "Input nama sekolah disini",
                enable: false,
            },
            {
                id: 3,
                name: "nama_kepala_sekolah",
                display: "Nama Kepala Sekolah",
                type: "text",
                value: itemObject.nama_kepala_sekolah,
                placeholder: "Input nama kepala sekolah disini",
                enable: false,
            },
            {
                id: 4,
                name: "alamat",
                display: "Alamat",
                type: "text",
                value: itemObject.alamat,
                placeholder: "Input alamat disini",
                enable: false,
            },
            {
                id: 5,
                name: "provinsi",
                display: "Provinsi",
                type: "text",
                value: itemObject.provinsi,
                placeholder: "Input provinsi disini",
                enable: false,
            },
            {
                id: 6,
                name: "kabupaten",
                display: "Kabupaten",
                type: "text",
                value: itemObject.kabupaten,
                placeholder: "Input kabupaten disini",
                enable: false,
            },
            {
                id: 7,
                name: "kecamatan",
                display: "Kecamatan",
                type: "text",
                value: itemObject.kecamatan,
                placeholder: "Input kecamatan disini",
                enable: false,
            },
            {
                id: 8,
                name: "kelurahan",
                display: "Kelurahan",
                type: "text",
                value: itemObject.kelurahan,
                placeholder: "Input kelurahan disini",
                enable: false,
            },
            {
                id: 9,
                name: "diubah",
                display: "Terakhir Diubah",
                type: "text",
                value: localMoment(itemObject.diubah).fromNow(),
                placeholder: "Input terakhir diubah disini",
                enable: false,
            },
        ],
    });
});

sekolahIndentitasRouter
    .route("/update")
    .get(async (req, res) => {
        const itemObject = await Indentitas.findOne({ _id: 1 })
            .select("nama_aplikasi nama_sekolah nama_kepala_sekolah alamat provinsi kabupaten kecamatan kelurahan")
            .lean();

        res.render("pages/sekolah/indentitas/update", {
            headTitle,
            navActive,
            toastResponse: req.query.response,
            toastTitle: req.query.response == "success" ? "Data Berhasil Diubah" : "Data Gagal Diubah",
            toastText: req.query.text,
            detailedInputArray: [
                {
                    id: 1,
                    name: "nama_aplikasi",
                    display: "Nama Aplikasi",
                    type: "text",
                    value: itemObject.nama_aplikasi,
                    placeholder: "Input nama aplikasi disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "nama_sekolah",
                    display: "Nama Sekolah",
                    type: "text",
                    value: itemObject.nama_sekolah,
                    placeholder: "Input nama sekolah disini",
                    enable: true,
                },
                {
                    id: 3,
                    name: "nama_kepala_sekolah",
                    display: "Nama Kepala Sekolah",
                    type: "text",
                    value: itemObject.nama_kepala_sekolah,
                    placeholder: "Input nama kepala sekolah disini",
                    enable: true,
                },
                {
                    id: 4,
                    name: "alamat",
                    display: "Alamat",
                    type: "text",
                    value: itemObject.alamat,
                    placeholder: "Input alamat disini",
                    enable: true,
                },
                {
                    id: 5,
                    name: "provinsi",
                    display: "Provinsi",
                    type: "text",
                    value: itemObject.provinsi,
                    placeholder: "Input provinsi disini",
                    enable: true,
                },
                {
                    id: 6,
                    name: "kabupaten",
                    display: "Kabupaten",
                    type: "text",
                    value: itemObject.kabupaten,
                    placeholder: "Input kabupaten disini",
                    enable: true,
                },
                {
                    id: 7,
                    name: "kecamatan",
                    display: "Kecamatan",
                    type: "text",
                    value: itemObject.kecamatan,
                    placeholder: "Input kecamatan disini",
                    enable: true,
                },
                {
                    id: 8,
                    name: "kelurahan",
                    display: "Kelurahan",
                    type: "text",
                    value: itemObject.kelurahan,
                    placeholder: "Input kelurahan disini",
                    enable: true,
                },
            ],
        });
    })
    .post(async (req, res) => {
        try {
            const inputArray = [
                req.body.nama_aplikasi,
                req.body.nama_sekolah,
                req.body.nama_kepala_sekolah,
                req.body.alamat,
                req.body.provinsi,
                req.body.kabupaten,
                req.body.kecamatan,
                req.body.kelurahan,
            ];

            if (!inputArray.includes(undefined)) {
                let logoIsValid = true;

                if (req.files) {
                    const logo: any = req.files.logo;
                    if (logo) {
                        if (path.extname(logo.name) == ".png") {
                            logo.mv(`sources/public/dist/img/app-logo.png`);
                        } else if (!(path.extname(logo.name) == ".png")) {
                            logoIsValid = false;
                        }
                    }
                }

                if (logoIsValid) {
                    await Indentitas.updateOne(
                        { _id: 1 },
                        {
                            nama_aplikasi: req.body.nama_aplikasi,
                            nama_sekolah: req.body.nama_sekolah,
                            nama_kepala_sekolah: req.body.nama_kepala_sekolah,
                            alamat: req.body.alamat,
                            provinsi: req.body.provinsi,
                            kabupaten: req.body.kabupaten,
                            kecamatan: req.body.kecamatan,
                            kelurahan: req.body.kelurahan,

                            diubah: new Date(),
                        }
                    ).lean();

                    app.locals.applicationName = req.body.nama_aplikasi;

                    res.redirect("update?response=success");
                } else if (!logoIsValid) {
                    res.redirect("update?response=error&text=Logo harus png");
                }
            } else if (inputArray.includes(undefined)) {
                res.redirect("update?response=error&text=Data tidak lengkap");
            }
        } catch (error: any) {
            res.redirect("update?response=error");
        }
    });
