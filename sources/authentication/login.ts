import express, { Router } from "express";

import { isNotAuthenticated } from "../common/middleware/isNotAuthenticated";

export const authenticationLoginRouter = Router();
const headTitle = "Login";

authenticationLoginRouter.use(express.static("sources/public"));
authenticationLoginRouter.use(express.urlencoded({ extended: false }));

authenticationLoginRouter.use(isNotAuthenticated);

const userArray = [
    {
        _id: 1,
        username: "Username123",
        password: "Password123",
    },
    {
        _id: 2,
        username: "Username456",
        password: "Password456",
    },
];

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
        const userObject = userArray.find((userObject) => {
            if (userObject.username == req.body.username && userObject.password == req.body.password) {
                return userObject;
            }
        });

        if (userObject != undefined) {
            req.session.regenerate(() => {
                req.session.userId = userObject._id;
                req.session.userType = "user";

                req.session.save(() => {
                    res.redirect("/?response=success");
                });
            });
        } else if (userObject == undefined) {
            res.redirect("/login?type=login&response=error&text=Username atau password salah");
        }
    });
