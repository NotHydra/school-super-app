import express, { Router } from "express";

import { headTitle } from ".";

import { Aktivitas, User } from "../../models";
import {} from "../../utility";

export const penggunaAktivitasRouter = Router();

const navActive = [2, 3];
const tableAttributeArray = [
    {
        id: 1,
        label: "Username",
        value: ["id_user", "username"],
        type: "text",
    },
    {
        id: 2,
        label: "Aktivitas",
        value: ["aktivitas"],
        type: "text",
    },
    {
        id: 3,
        label: "Method",
        value: ["method"],
        type: "text",
    },
];

penggunaAktivitasRouter.use(express.static("sources/public"));
penggunaAktivitasRouter.use(express.urlencoded({ extended: false }));

penggunaAktivitasRouter.route("/").get(async (req, res) => {
    const userValue: any = req.query.user;
    const methodValue: any = req.query.method;
    let filterValue = {};

    if (methodValue != undefined && isNaN(methodValue)) {
        filterValue = { ...filterValue, method: methodValue };
    }

    let tableItemArray: any = await Aktivitas.find(filterValue).populate({ path: "id_user", select: "username", model: User }).sort({ dibuat: -1 }).lean();

    if (userValue != undefined && !isNaN(userValue)) {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            if (tableItemObject.id_user._id == userValue) {
                return tableItemObject;
            }
        });
    }

    const documentCount = await Aktivitas.countDocuments().lean();

    res.render("pages/pengguna/aktivitas/table", {
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
                        title: "Aktivitas",
                        icon: "eye",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value:
                            documentCount >= 1
                                ? (
                                      (await Aktivitas.findOne()
                                          .select("id_user")
                                          .populate({ path: "id_user", select: "username", model: User })
                                          .sort({ dibuat: -1 })
                                          .lean()) as any
                                  ).id_user.username
                                : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [
            {
                id: 1,
                display: "User",
                name: "user",
                query: "user",
                placeholder: "Pilih user",
                value: userValue,
                option: (await User.find().select("username").sort({ username: 1 }).lean()).map((itemObject: any) => {
                    return {
                        value: itemObject._id,
                        display: itemObject.username,
                    };
                }),
            },
            {
                id: 2,
                display: "Method",
                name: "method",
                query: "method",
                placeholder: "Pilih method",
                value: userValue,
                option: [
                    {
                        value: "GET",
                        display: "GET",
                    },
                    {
                        value: "POST",
                        display: "POST",
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});
