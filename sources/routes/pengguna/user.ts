import express, { Router } from "express";
import bcrypt from "bcrypt";

import { app } from "../..";
import { headTitle } from ".";

import { Aktivitas, User } from "../../models";
import { localMoment, upperCaseFirst } from "../../utility";
import { roleCheck, roleConvert } from "../../authentication/guard/role.guard";

export const penggunaUserRouter = Router();

const navActive = [2, 2];
const tableAttributeArray = [
    {
        id: 1,
        label: "Username",
        value: ["username"],
        type: "text",
    },
    {
        id: 2,
        label: "Nama Lengkap",
        value: ["nama_lengkap"],
        type: "text",
    },
    {
        id: 3,
        label: "Nomor Telepon",
        value: ["nomor_telepon"],
        type: "text",
    },
    {
        id: 4,
        label: "Email",
        value: ["email"],
        type: "text",
    },
    {
        id: 5,
        label: "Role",
        value: ["role"],
        type: "text",
    },
    {
        id: 6,
        label: "Status",
        value: ["aktif"],
        type: "text",
    },
];

penggunaUserRouter.use(express.static("sources/public"));
penggunaUserRouter.use(express.urlencoded({ extended: false }));

penggunaUserRouter.route("/").get(async (req, res) => {
    const roleValue: any = req.query.role;
    const aktifValue: any = req.query.aktif;
    let filterValue = {};

    if (roleValue != undefined) {
        filterValue = { ...filterValue, role: roleValue };
    }

    if (aktifValue != undefined) {
        filterValue = { ...filterValue, aktif: aktifValue };
    }

    let tableItemArray: any = await User.find(filterValue).sort({ username: 1 }).lean();
    const aktivitasArray = await Aktivitas.find().select("id_user dibuat").sort({ dibuat: -1 }).lean();

    tableItemArray = await Promise.all(
        tableItemArray.map(async (tableItemObject: any) => {
            const aktivitasObject = aktivitasArray.find((aktivitasObject) => {
                if (aktivitasObject.id_user == tableItemObject._id) {
                    return aktivitasObject;
                }
            });

            tableItemObject.role = upperCaseFirst(tableItemObject.role);
            tableItemObject.aktif = tableItemObject.aktif == 1 ? "Aktif" : "Tidak Aktif";
            tableItemObject.aktivitas = aktivitasObject == undefined ? "Tidak Ada" : upperCaseFirst(localMoment(aktivitasObject.dibuat).fromNow());

            return tableItemObject;
        })
    );

    const documentCount = await User.countDocuments().lean();
    res.render("pages/pengguna/user/table", {
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
                        title: "User",
                        icon: "user",
                        value: documentCount,
                    },
                    {
                        id: 2,
                        title: "Dibuat",
                        icon: "circle-plus",
                        value: documentCount >= 1 ? (await User.findOne().select("username").sort({ dibuat: -1 }).lean()).username : "Tidak Ada",
                    },
                    {
                        id: 3,
                        title: "Diubah",
                        icon: "circle-exclamation",
                        value: documentCount >= 1 ? (await User.findOne().select("username").sort({ diubah: -1 }).lean()).username : "Tidak Ada",
                    },
                ],
            },
        ],
        filterArray: [
            {
                id: 1,
                display: "Role",
                name: "role",
                query: "role",
                placeholder: "Pilih role",
                value: roleValue,
                option: [
                    {
                        value: "superadmin",
                        display: "Superadmin",
                    },
                    {
                        value: "admin",
                        display: "Admin",
                    },
                    {
                        value: "operator",
                        display: "Operator",
                    },
                ],
            },
            {
                id: 2,
                display: "Status",
                name: "aktif",
                query: "aktif",
                placeholder: "Pilih status",
                value: aktifValue,
                option: [
                    {
                        value: "true",
                        display: "Aktif",
                    },
                    {
                        value: "false",
                        display: "Tidak Aktif",
                    },
                ],
            },
        ],
        tableAttributeArray,
        tableItemArray,
    });
});

penggunaUserRouter
    .route("/create")
    .get(async (req, res) => {
        res.render("pages/create", {
            headTitle,
            navActive,
            toastResponse: req.query.response,
            toastTitle: req.query.response == "success" ? "Data Berhasil Dibuat" : "Data Gagal Dibuat",
            toastText: req.query.text,
            detailedInputArray: [
                {
                    id: 1,
                    name: "username",
                    display: "Username",
                    type: "text",
                    value: null,
                    placeholder: "Input username disini",
                    enable: true,
                },
                {
                    id: 2,
                    name: "nama_lengkap",
                    display: "Nama Lengkap",
                    type: "text",
                    value: null,
                    placeholder: "Input nama lengkap disini",
                    enable: true,
                },
                {
                    id: 3,
                    name: "nomor_telepon",
                    display: "Nomor Telepon",
                    type: "number",
                    value: null,
                    placeholder: "Input nomor telepon disini",
                    enable: true,
                },
                {
                    id: 4,
                    name: "email",
                    display: "Email",
                    type: "email",
                    value: null,
                    placeholder: "Input email disini",
                    enable: true,
                },
                {
                    id: 5,
                    name: "role",
                    display: "Role",
                    type: "select",
                    value: [
                        [
                            ["admin", "Admin"],
                            ["operator", "Operator"],
                        ],
                        null,
                    ],
                    placeholder: "Input role disini",
                    enable: true,
                },
                {
                    id: 6,
                    name: "aktif",
                    display: "Status",
                    type: "select",
                    value: [
                        [
                            [true, "Aktif"],
                            [false, "Tidak Aktif"],
                        ],
                        null,
                    ],
                    placeholder: "Input status disini",
                    enable: true,
                },
                {
                    id: 7,
                    name: "password",
                    display: "Password",
                    type: "password",
                    value: null,
                    placeholder: "Input password disini",
                    enable: true,
                },
                {
                    id: 8,
                    name: "confirmation_password",
                    display: "Password Konfirmasi",
                    type: "password",
                    value: null,
                    placeholder: "Input password konfirmasi disini",
                    enable: true,
                },
            ],
        });
    })
    .post(async (req, res) => {
        if (req.body.password == req.body.confirmation_password) {
            const attributeArray: any = {};
            const inputArray = tableAttributeArray.map((tableAttributeObject) => {
                const attributeCurrent = tableAttributeObject.value[0];

                attributeArray[attributeCurrent] = req.body[attributeCurrent];

                return req.body[attributeCurrent];
            });

            attributeArray.password = req.body.password;
            inputArray.push(req.body.password);

            if (!inputArray.includes(undefined)) {
                attributeArray.password = await bcrypt.hash(attributeArray.password, 12);

                const itemObject = new User({
                    _id: (await User.findOne().select("_id").sort({ _id: -1 }).lean())._id + 1 || 1,

                    ...attributeArray,

                    dibuat: new Date(),
                    diubah: new Date(),
                });

                try {
                    await itemObject.save();
                    res.redirect("create?response=success");
                } catch (error: any) {
                    if (error.code == 11000) {
                        if (error.keyPattern.username) {
                            res.redirect("create?response=error&text=Username sudah digunakan");
                        } else if (error.keyPattern.nomor_telepon) {
                            res.redirect("create?response=error&text=Nomor telepon sudah digunakan");
                        } else if (error.keyPattern.email) {
                            res.redirect("create?response=error&text=Email sudah digunakan");
                        }
                    } else {
                        res.redirect("create?response=error");
                    }
                }
            } else if (inputArray.includes(undefined)) {
                res.redirect("create?response=error&text=Data tidak lengkap");
            }
        } else if (req.body.password != req.body.confirmation_password) {
            res.redirect("create?response=error&text=Password konfirmasi salah");
        }
    });

penggunaUserRouter.route("/active").get(async (req, res) => {
    const id = req.query.id;
    const dataExist = await User.exists({ _id: id }).lean();

    if (dataExist != null) {
        const roleIsValid = roleCheck(app.locals.userObject.role, roleConvert((await User.findOne({ _id: id }).select("role").lean()).role) + 1);

        if (roleIsValid) {
            try {
                await User.updateOne(
                    { _id: id },
                    {
                        aktif: (await User.findOne({ _id: id }).select("aktif").lean()).aktif == true ? false : true,

                        diubah: new Date(),
                    }
                ).lean();

                res.redirect("./?response=success");
            } catch (error: any) {
                res.redirect("./?response=error");
            }
        } else if (!roleIsValid) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    } else if (dataExist == null) {
        res.redirect("./?response=error&text=Data tidak valid");
    }
});

penggunaUserRouter
    .route("/update")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await User.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await User.findOne({ _id: id }).select("username nama_lengkap nomor_telepon email role").lean();
            const roleIsValid = roleCheck(app.locals.userObject.role, roleConvert(itemObject.role) + 1);

            if (roleIsValid) {
                res.render("pages/update", {
                    headTitle,
                    navActive,
                    toastResponse: req.query.response,
                    toastTitle: req.query.response == "success" ? "Data Berhasil Diubah" : "Data Gagal Diubah",
                    toastText: req.query.text,
                    id,
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
                        {
                            id: 5,
                            name: "role",
                            display: "Role",
                            type: "select",
                            value: [
                                [
                                    ["admin", "Admin"],
                                    ["operator", "Operator"],
                                ],
                                itemObject.role,
                            ],
                            placeholder: "Input role disini",
                            enable: true,
                        },
                    ],
                });
            } else if (!roleIsValid) {
                res.redirect("./?response=error&text=Data tidak valid");
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const dataExist = await User.exists({ _id: id }).lean();

        if (dataExist != null) {
            const roleIsValid = roleCheck(app.locals.userObject.role, roleConvert((await User.findOne({ _id: id }).select("role").lean()).role) + 1);

            if (roleIsValid) {
                const attributeArray: any = {};
                const inputArray = tableAttributeArray.slice(0, -1).map((tableAttributeObject) => {
                    const attributeCurrent = tableAttributeObject.value[0];

                    attributeArray[attributeCurrent] = req.body[attributeCurrent];

                    return req.body[attributeCurrent];
                });

                if (!inputArray.includes(undefined)) {
                    try {
                        await User.updateOne(
                            { _id: id },
                            {
                                ...attributeArray,

                                diubah: new Date(),
                            }
                        ).lean();
                        res.redirect(`update?id=${id}&response=success`);
                    } catch (error: any) {
                        if (error.code == 11000) {
                            if (error.keyPattern.username) {
                                res.redirect(`update?id=${id}&response=error&text=Username sudah digunakan`);
                            } else if (error.keyPattern.nomor_telepon) {
                                res.redirect(`update?id=${id}&response=error&text=Nomor telepon sudah digunakan`);
                            } else if (error.keyPattern.email) {
                                res.redirect(`update?id=${id}&response=error&text=Email sudah digunakan`);
                            }
                        } else {
                            res.redirect(`update?id=${id}&response=error`);
                        }
                    }
                } else if (inputArray.includes(undefined)) {
                    res.redirect(`update?id=${id}&response=error&text=Data tidak lengkap`);
                }
            } else if (!roleIsValid) {
                res.redirect("./?response=error&text=Data tidak valid");
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });

penggunaUserRouter
    .route("/update-password")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await User.exists({ _id: id }).lean();

        if (dataExist != null) {
            const roleIsValid = roleCheck(app.locals.userObject.role, roleConvert((await User.findOne({ _id: id }).select("role").lean()).role) + 1);

            if (roleIsValid) {
                res.render("pages/pengguna/user/update-password", {
                    headTitle,
                    navActive,
                    toastResponse: req.query.response,
                    toastTitle: req.query.response == "success" ? "Password Berhasil Diubah" : "Password Gagal Diubah",
                    toastText: req.query.text,
                    id,
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
            } else if (!roleIsValid) {
                res.redirect("./?response=error&text=Data tidak valid");
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const dataExist = await User.exists({ _id: id }).lean();

        if (dataExist != null) {
            const roleIsValid = roleCheck(app.locals.userObject.role, roleConvert((await User.findOne({ _id: id }).select("role").lean()).role) + 1);

            if (roleIsValid) {
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

                            res.redirect(`update-password?id=${id}&response=success`);
                        } catch (error: any) {
                            res.redirect(`update-password?id=${id}&response=error`);
                        }
                    } else if (req.body.new_password != req.body.confirmation_password) {
                        res.redirect(`update-password?id=${id}&response=error&text=Password konfirmasi salah`);
                    }
                } else if (inputArray.includes(undefined)) {
                    res.redirect(`update-password?id=${id}&response=error&text=Data tidak lengkap`);
                }
            } else if (!roleIsValid) {
                res.redirect("./?response=error&text=Data tidak valid");
            }
        } else if (dataExist == null) {
            res.redirect(`./?response=error&text=Data tidak valid`);
        }
    });

penggunaUserRouter
    .route("/delete")
    .get(async (req, res) => {
        const id = req.query.id;
        const dataExist = await User.exists({ _id: id }).lean();

        if (dataExist != null) {
            const itemObject = await User.findOne({ _id: id }).select("username nama_lengkap nomor_telepon email role aktif").lean();
            const roleIsValid = roleCheck(app.locals.userObject.role, roleConvert(itemObject.role) + 1);

            if (roleIsValid) {
                res.render("pages/delete", {
                    headTitle,
                    navActive,
                    toastResponse: req.query.response,
                    toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
                    toastText: req.query.text,
                    id,
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
            } else if (!roleIsValid) {
                res.redirect("./?response=error&text=Data tidak valid");
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    })
    .post(async (req, res) => {
        const id = req.query.id;
        const dataExist = await User.exists({ _id: id }).lean();

        if (dataExist != null) {
            const roleIsValid = roleCheck(app.locals.userObject.role, roleConvert((await User.findOne({ _id: id }).select("role").lean()).role) + 1);

            if (roleIsValid) {
                try {
                    await Aktivitas.deleteMany({ id_user: id }).lean();
                    await User.deleteOne({ _id: id }).lean();

                    res.redirect("./?response=success");
                } catch (error: any) {
                    res.redirect(`delete?id=${id}&response=error`);
                }
            } else if (!roleIsValid) {
                res.redirect("./?response=error&text=Data tidak valid");
            }
        } else if (dataExist == null) {
            res.redirect("./?response=error&text=Data tidak valid");
        }
    });
