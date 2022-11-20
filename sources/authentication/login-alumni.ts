import express, { Router } from "express";

import { isNotAuthenticated } from "../common/middleware/isNotAuthenticated";

import { Alumni, Siswa } from "../models";

export const authenticationLoginAlumniRouter = Router();
const headTitle = "Login Alumni";

authenticationLoginAlumniRouter.use(express.static("sources/public"));
authenticationLoginAlumniRouter.use(express.urlencoded({ extended: false }));

authenticationLoginAlumniRouter.use(isNotAuthenticated);

authenticationLoginAlumniRouter
    .route("/")
    .get(async (req, res) => {
        res.render("pages/authentication/login-alumni", {
            headTitle,
            toastResponse: req.query.response,
            toastTitle: req.query.response == "success" ? "Login Berhasil" : "Login Gagal",
            toastText: req.query.text,
        });
    })
    .post(async (req, res) => {
        const tanggalLahirStart = new Date(`${req.body.tanggal_lahir}`);
        const tanggalLahirEnd = new Date(new Date(`${req.body.tanggal_lahir}`).setDate(new Date(`${req.body.tanggal_lahir}`).getDate() + 1));

        const siswaObject = await Siswa.findOne({
            nisn: req.body.nisn,
            tanggal_lahir: {
                $gte: tanggalLahirStart,
                $lt: tanggalLahirEnd,
            },
        })
            .select("_id aktif id_keterangan")
            .lean();

        if (siswaObject != null) {
            if (siswaObject.aktif == false && siswaObject.id_keterangan == 3) {
                const alumniObject = await Alumni.findOne({ id_siswa: siswaObject._id }).select("_id").lean();
                if (alumniObject != null) {
                    req.session.regenerate(() => {
                        req.session.userId = alumniObject._id;
                        req.session.userType = "alumni";
                        req.session.save(() => {
                            res.redirect("/?response=success");
                        });
                    });
                } else if (alumniObject == null) {
                    res.redirect("/login-alumni?response=error&text=Siswa belum lulus");
                }
            } else if (siswaObject.aktif == true || siswaObject.id_keterangan != 3) {
                res.redirect("/login-alumni?response=error&text=Siswa belum lulus");
            }
        } else if (siswaObject == null) {
            res.redirect("/login-alumni?response=error&text=NISN atau tanggal lahir salah");
        }
    });
