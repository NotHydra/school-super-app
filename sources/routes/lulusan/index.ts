import { Router } from "express";

import { datasetYear } from "../../utility";

import { Alumni, TahunLulus } from "../../models";

import { lulusanAlumniRouter } from "./alumni";
import { lulusanTahunLulusRouter } from "./tahun-lulus";

export const lulusanRouter = Router();
export const headTitle = "Lulusan";
const navActive = [3, 0];

lulusanRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const alumniChartData: any = await datasetYear(Alumni, currentYear);
    const tahunLulusChartData: any = await datasetYear(TahunLulus, currentYear);

    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Alumni",
                        icon: "user-graduate",
                        value: await Alumni.countDocuments().lean(),
                        link: "lulusan/alumni",
                    },
                    {
                        id: 2,
                        title: "Tahun Lulus",
                        icon: "calendar-days",
                        value: await TahunLulus.countDocuments().lean(),
                        link: "lulusan/tahun-lulus",
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
                        title: "Statistik Alumni Baru",
                        link: { link: "lulusan/alumni", title: "Alumni", subTitle: "Lulusan" },
                        value: alumniChartData.currentYearValue,
                        text: "Alumni Baru",
                        percentage: alumniChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: alumniChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                    {
                        id: 2,
                        title: "Statistik Tahun Lulus Baru",
                        link: { link: "lulusan/tahun-lulus", title: "Tahun Lulus", subTitle: "Lulusan" },
                        value: tahunLulusChartData.currentYearValue,
                        text: "Tahun Lulus Baru",
                        percentage: tahunLulusChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: tahunLulusChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                ],
            },
        ],
    });
});

lulusanRouter.use("/alumni", lulusanAlumniRouter);
lulusanRouter.use("/tahun-lulus", lulusanTahunLulusRouter);
