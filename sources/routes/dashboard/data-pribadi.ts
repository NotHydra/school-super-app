import express, { Router } from "express";
import bcrypt from "bcrypt";

import { localMoment, upperCaseFirst } from "../../utility";

import { app } from "../..";
import { headTitle } from ".";

import { JenisKelamin, Rombel, Siswa, TahunMasuk, TempatLahir, User } from "../../models";

export const dashboardDataPribadiRouter = Router();

const navActive = [1, 2];

dashboardDataPribadiRouter.use(express.static("sources/public"));
dashboardDataPribadiRouter.use(express.urlencoded({ extended: false }));

dashboardDataPribadiRouter.get("/", async (req, res) => {
    const id = req.session.userId;
    const type = req.session.userType;

    let dataExist = null;

    if (type == "user") {
        dataExist = await User.exists({ _id: id }).lean();
    } else if (type == "siswa") {
        dataExist = await Siswa.exists({ _id: id }).lean();
    }

    if (dataExist != null) {
        const itemObject = app.locals.userObject;

        let detailedInputArray: any = [];

        if (type == "user") {
            detailedInputArray = [
                {
                    id: 1,
                    name: "username",
                    display: "Username",
                    type: "text",
                    value: itemObject.username,
                    placeholder: "Input username disini",
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
                    name: "nomor_telepon",
                    display: "Nomor Telepon",
                    type: "number",
                    value: itemObject.nomor_telepon,
                    placeholder: "Input nomor telepon disini",
                    enable: false,
                },
                {
                    id: 4,
                    name: "email",
                    display: "Email",
                    type: "email",
                    value: itemObject.email,
                    placeholder: "Input email disini",
                    enable: false,
                },
                {
                    id: 5,
                    name: "role",
                    display: "Role",
                    type: "text",
                    value: upperCaseFirst(itemObject.role),
                    placeholder: "Input role disini",
                    enable: false,
                },
                {
                    id: 6,
                    name: "aktif",
                    display: "Status",
                    type: "text",
                    value: itemObject.aktif == true ? "Aktif" : "Tidak Aktif",
                    placeholder: "Input status disini",
                    enable: false,
                },
            ];
        } else if (type == "siswa") {
            detailedInputArray = [
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
            ];
        }

        res.render("pages/dashboard/data-pribadi/index", {
            headTitle,
            navActive,
            detailedInputArray,
        });
    } else if (dataExist == null) {
        res.redirect("/logout?type=exist");
    }
});

dashboardDataPribadiRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.session.userId;
        const type = req.session.userType;

        let dataExist = null;

        if (type == "user") {
            dataExist = await User.exists({ _id: id }).lean();
        } else if (type == "siswa") {
            dataExist = await Siswa.exists({ _id: id }).lean();
        }

        if (dataExist != null) {
            const itemObject = app.locals.userObject;

            let detailedInputArray: any = [];

            if (type == "user") {
                detailedInputArray = [
                    {
                        id: 1,
                        name: "username",
                        display: "Username",
                        type: "text",
                        value: itemObject.username,
                        placeholder: "Input username disini",
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
                        name: "nomor_telepon",
                        display: "Nomor Telepon",
                        type: "number",
                        value: itemObject.nomor_telepon,
                        placeholder: "Input nomor telepon disini",
                        enable: true,
                    },
                    {
                        id: 4,
                        name: "email",
                        display: "Email",
                        type: "email",
                        value: itemObject.email,
                        placeholder: "Input email disini",
                        enable: true,
                    },
                ];
            } else if (type == "siswa") {
                detailedInputArray = [
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
                            itemObject.id_tempat_lahir._id,
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
                            itemObject.id_jenis_kelamin._id,
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
                            itemObject.id_tahun_masuk._id,
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
                            itemObject.id_rombel._id,
                        ],
                        placeholder: "Input rombel disini",
                        enable: true,
                    },
                ];
            }

            res.render("pages/dashboard/data-pribadi/update", {
                headTitle,
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Diubah" : "Data Gagal Diubah",
                toastText: req.query.text,
                detailedInputArray,
            });
        } else if (dataExist == null) {
            res.redirect("/logout?type=exist");
        }
    })
    .post(async (req, res) => {
        const id = req.session.userId;
        const type = req.session.userType;

        let dataExist = null;

        if (type == "user") {
            dataExist = await User.exists({ _id: id }).lean();
        } else if (type == "siswa") {
            dataExist = await Siswa.exists({ _id: id }).lean();
        }

        if (dataExist != null) {
            let inputArray: any = [];

            if (type == "user") {
                inputArray = [req.body.username, req.body.nama_lengkap, req.body.nomor_telepon, req.body.email];
            } else if (type == "siswa") {
                inputArray = [
                    req.body.nisn,
                    req.body.nama_lengkap,
                    req.body.id_tempat_lahir,
                    req.body.tanggal_lahir,
                    req.body.id_jenis_kelamin,
                    req.body.id_tahun_masuk,
                    req.body.id_rombel,
                ];
            }

            if (!inputArray.includes(undefined)) {
                try {
                    if (type == "user") {
                        await User.updateOne(
                            { _id: id },
                            {
                                username: req.body.username,
                                nama_lengkap: req.body.nama_lengkap,
                                nomor_telepon: req.body.nomor_telepon,
                                email: req.body.email,

                                diubah: new Date(),
                            }
                        ).lean();
                    } else if (type == "siswa") {
                        await Siswa.updateOne(
                            { _id: id },
                            {
                                nisn: req.body.nisn,
                                nama_lengkap: req.body.nama_lengkap,
                                id_tempat_lahir: req.body.id_tempat_lahir,
                                tanggal_lahir: req.body.tanggal_lahir,
                                id_jenis_kelamin: req.body.id_jenis_kelamin,
                                id_tahun_masuk: req.body.id_tahun_masuk,
                                id_rombel: req.body.id_rombel,

                                diubah: new Date(),
                            }
                        ).lean();
                    }

                    res.redirect("update?response=success");
                } catch (error: any) {
                    if (error.code == 11000) {
                        if (type == "user") {
                            if (error.keyPattern.username) {
                                res.redirect("update?response=error&text=Username sudah digunakan");
                            } else if (error.keyPattern.nomor_telepon) {
                                res.redirect("update?response=error&text=Nomor telepon sudah digunakan");
                            } else if (error.keyPattern.email) {
                                res.redirect("update?response=error&text=Email sudah digunakan");
                            }
                        } else if (type == "siswa") {
                            if (error.keyPattern.nisn) {
                                res.redirect("update?response=error&text=NISN sudah digunakan");
                            }
                        }
                    } else {
                        res.redirect("update?response=error");
                    }
                }
            } else if (inputArray.includes(undefined)) {
                res.redirect("update?response=error&text=Data tidak lengkap");
            }
        } else if (dataExist == null) {
            res.redirect("/logout?type=exist");
        }
    });

dashboardDataPribadiRouter
    .route("/update-password")
    .get(async (req, res) => {
        const type = req.session.userType;

        if (type == "user") {
            const id = req.session.userId;
            const dataExist = await User.exists({ _id: id }).lean();

            if (dataExist != null) {
                res.render("pages/dashboard/data-pribadi/update-password", {
                    headTitle,
                    navActive,
                    toastResponse: req.query.response,
                    toastTitle: req.query.response == "success" ? "Password Berhasil Diubah" : "Password Gagal Diubah",
                    toastText: req.query.text,
                    detailedInputArray: [
                        {
                            id: 1,
                            name: "new_password",
                            display: "Password Baru",
                            type: "password",
                            value: null,
                            placeholder: "Input password baru disini",
                            enable: true,
                        },
                        {
                            id: 2,
                            name: "confirmation_password",
                            display: "Password Konfirmasi",
                            type: "password",
                            value: null,
                            placeholder: "Input password konfirmasi disini",
                            enable: true,
                        },
                    ],
                });
            } else if (dataExist == null) {
                res.redirect("/logout?type=exist");
            }
        } else if (type == "siswa") {
            res.redirect("/");
        }
    })
    .post(async (req, res) => {
        const type = req.session.userType;

        if (type == "user") {
            const id = req.session.userId;
            const dataExist = await User.exists({ _id: id }).lean();

            if (dataExist != null) {
                const inputArray: any = [req.body.new_password, req.body.confirmation_password];

                if (!inputArray.includes(undefined)) {
                    if (req.body.new_password == req.body.confirmation_password) {
                        try {
                            await User.updateOne(
                                { _id: id },
                                {
                                    password: await bcrypt.hash(req.body.new_password, 12),

                                    diubah: new Date(),
                                }
                            ).lean();

                            res.redirect("update-password?response=success");
                        } catch (error: any) {
                            res.redirect("update-password?response=error");
                        }
                    } else if (req.body.new_password != req.body.confirmation_password) {
                        res.redirect("update-password?response=error&text=Password konfirmasi salah");
                    }
                } else if (inputArray.includes(undefined)) {
                    res.redirect("update-password?response=error&text=Data tidak lengkap");
                }
            } else if (dataExist == null) {
                res.redirect("/logout?type=exist");
            }
        } else if (type == "siswa") {
            res.redirect("/");
        }
    });
