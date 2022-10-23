import { Router } from "express";

import { datasetYear } from "../../utility";

import { Guru, Jabatan } from "../../models";

import { pengajarGuruRouter } from "./guru";
import { pengajarJabatanRouter } from "./jabatan";

export const pengajarRouter = Router();
export const headTitle = "Pengajar";
const navActive = [1, 0];

pengajarRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const guruChartData: any = await datasetYear(Guru, currentYear);
    const jabatanChartData: any = await datasetYear(Jabatan, currentYear);

    res.render("pages/index", {
        headTitle,
        navActive,
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
                        title: "Jabatan",
                        icon: "tag",
                        value: await Jabatan.countDocuments().lean(),
                        link: "pengajar/jabatan",
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
                        title: "Statistik Jabatan Baru",
                        link: { link: "pengajar/jabatan", title: "Jabatan", subTitle: "Pengajar" },
                        value: jabatanChartData.currentYearValue,
                        text: "Jabatan Baru",
                        percentage: jabatanChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: jabatanChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                ],
            },
        ],
    });
});

pengajarRouter.use("/guru", pengajarGuruRouter);
pengajarRouter.use("/jabatan", pengajarJabatanRouter);
