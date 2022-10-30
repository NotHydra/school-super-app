import { Router } from "express";

import { blueColorPattern, datasetYear } from "../../utility";
import { roleGuard } from "../../authentication/guard/role.guard";

import { User } from "../../models";

import { penggunaUserRouter } from "./user";

export const penggunaRouter = Router();
export const headTitle = "Pengguna";
const navActive = [2, 1];

penggunaRouter.get("/", roleGuard(4), async (req, res) => {
    const currentYear = new Date().getFullYear();

    const userChartData: any = await datasetYear(User, currentYear);

    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [
                    {
                        id: 1,
                        title: "User",
                        icon: "user",
                        value: await User.countDocuments().lean(),
                        link: "pengguna/user",
                    },
                ],
            },
        ],
        lineChartArray: [
            {
                id: 1,
                lineChartChild: [
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
                ],
            },
        ],
        donutChartArray: [
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
        ],
    });
});

penggunaRouter.use("/user", penggunaUserRouter);
