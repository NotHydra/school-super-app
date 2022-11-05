import { Router } from "express";

import { roleGuard } from "../../authentication/guard/role.guard";

import { datasetYear } from "../../utility";
import { TahunAjaran } from "../../models";

import { sekolahIndentitasRouter } from "./indentitas";
import { sekolahTahunAjaranRouter } from "./tahun-ajaran";

export const sekolahRouter = Router();
export const headTitle = "Sekolah";
const navActive = [3, 1];

sekolahRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const tahunAjaranChartData: any = await datasetYear(TahunAjaran, currentYear);

    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Tahun Ajaran",
                        icon: "calendar-days",
                        value: await TahunAjaran.countDocuments().lean(),
                        link: "sekolah/tahun-ajaran",
                    },
                ],
            },
        ],
        lineChartArray: [
            {
                id: 2,
                lineChartChild: [
                    {
                        id: 1,
                        title: "Statistik Tahun Ajaran Baru",
                        link: { link: "sekolah/tahun-ajaran", title: "Tahun Ajaran", subTitle: "Sekolah" },
                        value: tahunAjaranChartData.currentYearValue,
                        text: "Tahun Ajaran Baru",
                        percentage: tahunAjaranChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: tahunAjaranChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                ],
            },
        ],
        donutChartArray: [],
    });
});

sekolahRouter.use("/indentitas", roleGuard(4), sekolahIndentitasRouter);
sekolahRouter.use("/tahun-ajaran", sekolahTahunAjaranRouter);
