import { Router } from "express";
import { Siswa, TahunMasuk } from "../../models";

import { datasetYear } from "../../utility";

import { pelajarSiswaRouter } from "./siswa";
import { pelajarTahunMasukRouter } from "./tahun-masuk";

export const pelajarRouter = Router();
export const headTitle = "Pelajar";
const navActive = [2, 0];

pelajarRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const siswaChartData: any = await datasetYear(Siswa, currentYear);
    const tahunMasukChartData: any = await datasetYear(TahunMasuk, currentYear);

    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Siswa",
                        icon: "user",
                        value: await Siswa.countDocuments().lean(),
                        link: "pelajar/siswa",
                    },
                    {
                        id: 2,
                        title: "Tahun Masuk",
                        icon: "calendar-days",
                        value: await TahunMasuk.countDocuments().lean(),
                        link: "pelajar/tahun-masuk",
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
                    {
                        id: 2,
                        title: "Statistik Tahun Masuk Baru",
                        link: { link: "pelajar/tahun-masuk", title: "Tahun Masuk", subTitle: "Pelajar" },
                        value: tahunMasukChartData.currentYearValue,
                        text: "Tahun Masuk Baru",
                        percentage: tahunMasukChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: tahunMasukChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                ],
            },
        ],
    });
});

pelajarRouter.use("/siswa", pelajarSiswaRouter);
pelajarRouter.use("/tahun-masuk", pelajarTahunMasukRouter);
