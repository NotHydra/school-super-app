import { Router } from "express";

import { blueColorPattern, datasetYear } from "../../utility";
import { roleGuard } from "../../authentication/guard/role.guard";

import { Guru, Siswa, Alumni, User } from "../../models";

import { dashboardDataPribadiRouter } from "./data-pribadi";

export const dashboardRouter = Router();
export const headTitle = "Dashboard";
const navActive = [1, 1];

dashboardRouter.get("/", roleGuard(3), async (req, res) => {
    const currentYear = new Date().getFullYear();

    const userChartData: any = await datasetYear(User, currentYear);
    const siswaChartData: any = await datasetYear(Siswa, currentYear);

    res.render("pages/index", {
        headTitle,
        navActive,
        toastResponse: req.query.response,
        toastTitle: req.query.response == "success" ? "Login Berhasil" : "Login Gagal",
        toastText: req.query.text,
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
                    {
                        id: 2,
                        title: "Guru",
                        icon: "user-tie",
                        value: await Guru.countDocuments().lean(),
                        link: "pengajar/guru",
                    },
                    {
                        id: 3,
                        title: "Siswa",
                        icon: "user",
                        value: await Siswa.countDocuments().lean(),
                        link: "pelajar/siswa",
                    },
                    {
                        id: 4,
                        title: "Alumni",
                        icon: "user-graduate",
                        value: await Alumni.countDocuments().lean(),
                        link: "lulusan/alumni",
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
                    {
                        id: 2,
                        title: "Statistik Siswa Baru",
                        link: { link: "pelajar/siswa", title: "Siswa", subTitle: "Pelajar" },
                        value: siswaChartData.currentYearValue,
                        text: "Siswa Baru",
                        percentage: siswaChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: siswaChartData.dataset,
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

dashboardRouter.use("/data-pribadi", dashboardDataPribadiRouter);
