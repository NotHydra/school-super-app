import express, { Router } from "express";

import { isNotAuthenticated } from "../common/middleware/isNotAuthenticated";

import { Siswa } from "../models";

export const authenticationLoginSiswaRouter = Router();
const headTitle = "Login Siswa";

authenticationLoginSiswaRouter.use(express.static("sources/public"));
authenticationLoginSiswaRouter.use(express.urlencoded({ extended: false }));

authenticationLoginSiswaRouter.use(isNotAuthenticated);

authenticationLoginSiswaRouter
    .route("/")
    .get(async (req, res) => {
        res.render("pages/authentication/login-siswa", {
            headTitle,
            toastResponse: req.query.response,
            toastTitle: req.query.response == "success" ? "Login Berhasil" : "Login Gagal",
            toastText: req.query.text,
        });
    })
    .post(async (req, res) => {
        const siswaObject = await Siswa.findOne({ nisn: req.body.nisn, tanggal_lahir: req.body.tanggal_lahir }).select("_id").lean();

        if (siswaObject != null) {
            req.session.regenerate(() => {
                req.session.userId = siswaObject._id;
                req.session.userType = "siswa";

                req.session.save(() => {
                    res.redirect("/?response=success");
                });
            });
        } else if (siswaObject == null) {
            res.redirect("/login-siswa?response=error&text=NISN atau tanggal lahir salah");
        }
    });
