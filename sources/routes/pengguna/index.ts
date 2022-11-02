import { Router } from "express";

import { blueColorPattern, datasetYear } from "../../utility";
import { roleCheck, roleGuard } from "../../authentication/guard/role.guard";

import { Aktivitas, User } from "../../models";

import { penggunaUserRouter } from "./user";
import { penggunaAktivitasRouter } from "./aktivitas";
import { app } from "../..";

export const penggunaRouter = Router();
export const headTitle = "Pengguna";
const navActive = [2, 1];

penggunaRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const cardItemChild = [
        {
            id: 1,
            title: "User",
            icon: "user",
            value: await User.countDocuments().lean(),
            link: "pengguna/user",
        },
    ];

    const userChartData: any = await datasetYear(User, currentYear);
    const lineChartChild = [
        {
            id: 1,
            title: "Statistik User Baru",
            link: { link: "pengguna/user", title: "User", subTitle: "Pengguna" },
            value: userChartData.currentYearValue,
            text: "User Baru",
            percentage: userChartData.percentageIncrease,
            timeRange: "Sejak Tahun Lalu",
            dataset: userChartData.dataset,
            firstLegend: "Tahun Ini",
            secondLegend: "Tahun Lalu",
        },
    ];

    const userTotal = await User.countDocuments().lean();
    const donutChartArray = [
        {
            id: 1,
            donutChartChild: [
                {
                    id: 1,
                    title: "Statistik User Berdasarkan Role",
                    link: { link: "pengguna/user", title: "User", subTitle: "Pengguna" },
                    dataset: [
                        {
                            id: 1,
                            label: "Superadmin",
                            value: await User.countDocuments({ role: "superadmin" }).lean(),
                            color: blueColorPattern(1, 3),
                        },
                        {
                            id: 2,
                            label: "Admin",
                            value: await User.countDocuments({ role: "admin" }).lean(),
                            color: blueColorPattern(2, 3),
                        },
                        {
                            id: 3,
                            label: "Operator",
                            value: await User.countDocuments({ role: "operator" }).lean(),
                            color: blueColorPattern(3, 3),
                        },
                    ],
                },
                {
                    id: 2,
                    title: "Statistik User Berdasarkan Status",
                    link: { link: "pengguna/user", title: "User", subTitle: "Pengguna" },
                    dataset: [
                        {
                            id: 1,
                            label: "Aktif",
                            value: await User.countDocuments({ aktif: true }).lean(),
                            color: blueColorPattern(1, 2),
                        },
                        {
                            id: 2,
                            label: "Tidak Aktif",
                            value: await User.countDocuments({ aktif: false }).lean(),
                            color: blueColorPattern(2, 2),
                        },
                    ],
                },
            ],
        },
    ];

    if (roleCheck(app.locals.userObject.role, 4)) {
        cardItemChild.push({
            id: 2,
            title: "Aktivitas",
            icon: "eye",
            value: await Aktivitas.countDocuments().lean(),
            link: "pengguna/aktivitas",
        });

        const aktivitasChartData: any = await datasetYear(Aktivitas, currentYear);
        lineChartChild.push({
            id: 2,
            title: "Statistik Aktivitas Baru",
            link: { link: "pengguna/aktivitas", title: "Aktivitas", subTitle: "Pengguna" },
            value: aktivitasChartData.currentYearValue,
            text: "Aktivitas Baru",
            percentage: aktivitasChartData.percentageIncrease,
            timeRange: "Sejak Tahun Lalu",
            dataset: aktivitasChartData.dataset,
            firstLegend: "Tahun Ini",
            secondLegend: "Tahun Lalu",
        });

        donutChartArray.push({
            id: 2,
            donutChartChild: [
                {
                    id: 1,
                    title: "Statistik Aktivitas Berdasarkan User",
                    link: { link: "pengguna/aktivitas", title: "Aktivitas", subTitle: "Pengguna" },
                    dataset: await Promise.all(
                        (
                            await User.find().select("_id username").sort({ username: 1 }).lean()
                        ).map(async (itemObject, itemIndex) => {
                            return {
                                id: itemIndex + 1,
                                label: itemObject.username,
                                value: await Aktivitas.countDocuments({ id_user: itemObject._id }).lean(),
                                color: blueColorPattern(itemIndex + 1, userTotal),
                            };
                        })
                    ),
                },
                {
                    id: 2,
                    title: "Statistik Aktivitas Berdasarkan Method",
                    link: { link: "pengguna/aktivitas", title: "Aktivitas", subTitle: "Pengguna" },
                    dataset: [
                        {
                            id: 1,
                            label: "GET",
                            value: await Aktivitas.countDocuments({ method: "GET" }).lean(),
                            color: blueColorPattern(1, 2),
                        },
                        {
                            id: 2,
                            label: "POST",
                            value: await Aktivitas.countDocuments({ method: "POST" }).lean(),
                            color: blueColorPattern(2, 2),
                        },
                    ],
                },
            ],
        });
    }

    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                cardItemChild,
            },
        ],
        lineChartArray: [
            {
                id: 1,
                lineChartChild,
            },
        ],
        donutChartArray,
    });
});

penggunaRouter.use("/user", penggunaUserRouter);
penggunaRouter.use("/aktivitas", roleGuard(4), penggunaAktivitasRouter);
