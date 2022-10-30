import express, { Router } from "express";
import bcrypt from "bcrypt";

import { isNotAuthenticated } from "../common/middleware/isNotAuthenticated";

import { User } from "../models";

export const authenticationRegisterRouter = Router();
const headTitle = "Register";

authenticationRegisterRouter.use(express.static("sources/public"));
authenticationRegisterRouter.use(express.urlencoded({ extended: false }));

authenticationRegisterRouter.use(isNotAuthenticated);

authenticationRegisterRouter
    .route("/")
    .get(async (req, res) => {
        res.render("pages/authentication/register", {
            headTitle,
            toastResponse: req.query.response,
            toastTitle: req.query.response == "success" ? "Register Berhasil" : "Register Gagal",
            toastText: req.query.text,
        });
    })
    .post(async (req, res) => {
        const inputArray: any = [req.body.username, req.body.nama_lengkap, req.body.password, req.body.nomor_telepon, req.body.email, req.body.role];

        if (!inputArray.includes(undefined)) {
            const itemObject = new User({
                _id: (await User.findOne().select("_id").sort({ _id: -1 }).lean())._id + 1 || 1,

                username: req.body.username,
                nama_lengkap: req.body.nama_lengkap,
                password: await bcrypt.hash(req.body.password, 12),
                nomor_telepon: req.body.nomor_telepon,
                email: req.body.email,
                role: req.body.role,
                aktif: false,

                dibuat: new Date(),
                diubah: new Date(),
            });

            try {
                await itemObject.save();
                res.redirect("/register?response=success");
            } catch (error: any) {
                if (error.code == 11000) {
                    if (error.keyPattern.username) {
                        res.redirect("register?response=error&text=Username sudah digunakan");
                    } else if (error.keyPattern.nomor_telepon) {
                        res.redirect("register?response=error&text=Nomor telepon sudah digunakan");
                    } else if (error.keyPattern.email) {
                        res.redirect("register?response=error&text=Email sudah digunakan");
                    }
                } else {
                    res.redirect("register?response=error");
                }
            }
        } else if (inputArray.includes(undefined)) {
            res.redirect("register?response=error&text=Data tidak lengkap");
        }
    });
