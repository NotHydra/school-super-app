import { Router } from "express";

import { datasetYear } from "../../utility";
import { roleGuard } from "../../authentication/guard/role.guard";

import { Guru, Siswa, Alumni, Rombel } from "../../models";

import { dashboardDataPribadiRouter } from "./data-pribadi";

export const dashboardRouter = Router();
export const headTitle = "Dashboard";
const navActive = [1, 1];

dashboardRouter.get("/", roleGuard(3), async (req, res) => {
    const currentYear = new Date().getFullYear();

    const guruChartData: any = await datasetYear(Guru, currentYear);
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
                        title: "Guru",
                        icon: "user-tie",
                        value: await Guru.countDocuments().lean(),
                        link: "pengajar/guru",
                    },
                    {
                        id: 2,
                        title: "Siswa",
                        icon: "user",
                        value: await Siswa.countDocuments().lean(),
                        link: "pelajar/siswa",
                    },
                    {
                        id: 3,
                        title: "Alumni",
                        icon: "user-graduate",
                        value: await Alumni.countDocuments().lean(),
                        link: "lulusan/alumni",
                    },
                    {
                        id: 4,
                        title: "Rombel",
                        icon: "archway",
                        value: await Rombel.countDocuments().lean(),
                        link: "instansi/rombel",
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
                        title: "Statistik Guru Baru",
                        link: { link: "pengajar/guru", title: "Guru", subTitle: "Pengajar" },
                        value: guruChartData.currentYearValue,
                        text: "Guru Baru",
                        percentage: guruChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: guruChartData.dataset,
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
        donutChartArray: [],
    });
});

dashboardRouter.use("/data-pribadi", dashboardDataPribadiRouter);
