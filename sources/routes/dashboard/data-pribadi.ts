import express, { Router } from "express";
import bcrypt from "bcrypt";

import { upperCaseFirst } from "../../utility";

import { app } from "../..";
import { headTitle } from ".";

import { User } from "../../models";

export const dashboardDataPribadiRouter = Router();

const navActive = [0, 1];

dashboardDataPribadiRouter.use(express.static("sources/public"));
dashboardDataPribadiRouter.use(express.urlencoded({ extended: false }));

dashboardDataPribadiRouter.get("/", async (req, res) => {
    const id = req.session.userId;
    const dataExist = await User.exists({ _id: id }).lean();

    if (dataExist != null) {
        const itemObject = app.locals.userObject;

        res.render("pages/dashboard/data-pribadi/index", {
            headTitle,
            navActive,
            detailedInputArray: [
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
            ],
        });
    } else if (dataExist == null) {
        res.redirect("/logout?type=exist");
    }
});

dashboardDataPribadiRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.session.userId;
        const dataExist = await User.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = app.locals.userObject;

            res.render("pages/dashboard/data-pribadi/update", {
                headTitle,
                navActive,
                toastResponse: req.query.response,
                toastTitle: req.query.response == "success" ? "Data Berhasil Diubah" : "Data Gagal Diubah",
                toastText: req.query.text,
                detailedInputArray: [
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
                ],
            });
        } else if (dataExist == null) {
            res.redirect("/logout?type=exist");
        }
    })
    .post(async (req, res) => {
        const id = req.session.userId;
        const dataExist = await User.exists({ _id: id }).lean();

        if (dataExist != null) {
            const inputArray: any = [req.body.username, req.body.nama_lengkap, req.body.nomor_telepon, req.body.email];

            if (!inputArray.includes(undefined)) {
                try {
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

                    res.redirect("update?response=success");
                } catch (error: any) {
                    if (error.code == 11000) {
                        if (error.keyPattern.username) {
                            res.redirect("update?response=error&text=Username sudah digunakan");
                        } else if (error.keyPattern.nomor_telepon) {
                            res.redirect("update?response=error&text=Nomor telepon sudah digunakan");
                        } else if (error.keyPattern.email) {
                            res.redirect("update?response=error&text=Email sudah digunakan");
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
    })
    .post(async (req, res) => {
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
    });
