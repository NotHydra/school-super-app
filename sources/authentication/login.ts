import express, { Router } from "express";
import bcrypt from "bcrypt";

import { isNotAuthenticated } from "../common/middleware/isNotAuthenticated";

import { User } from "../models";

export const authenticationLoginRouter = Router();
const headTitle = "Login";

authenticationLoginRouter.use(express.static("sources/public"));
authenticationLoginRouter.use(express.urlencoded({ extended: false }));

authenticationLoginRouter.use(isNotAuthenticated);

authenticationLoginRouter
    .route("/")
    .get(async (req, res) => {
        res.render("pages/login", {
            headTitle,
            toastResponse: req.query.response,
            toastTitle:
                req.query.type == "login"
                    ? req.query.response == "success"
                        ? "Login Berhasil"
                        : "Login Gagal"
                    : req.query.response == "success"
                    ? "Logout Berhasil"
                    : "Logout Gagal",
            toastText: req.query.text,
        });
    })
    .post(async (req, res) => {
        const userObject = await User.findOne({ username: req.body.username }).select("username password").lean();

        if (userObject != null) {
            const passwordIsValid = await bcrypt.compare(req.body.password, userObject.password);

            if (passwordIsValid) {
                req.session.regenerate(() => {
                    req.session.userId = userObject._id;
                    req.session.userType = "user";

                    req.session.save(() => {
                        res.redirect("/?response=success");
                    });
                });
            } else if (!passwordIsValid) {
                res.redirect("/login?type=login&response=error&text=Username atau password salah");
            }
        } else if (userObject == null) {
            res.redirect("/login?type=login&response=error&text=Username atau password salah");
        }
    });
