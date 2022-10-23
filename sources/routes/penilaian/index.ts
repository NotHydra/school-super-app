import { Router } from "express";

import { datasetYear } from "../../utility";

import { MataPelajaran } from "../../models";

import { instansiMataPelajaranRouter } from "./mata-pelajaran";

export const penilaianRouter = Router();
export const headTitle = "Penilaian";
const navActive = [4, 0];

penilaianRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const mataPelajaranChartData: any = await datasetYear(MataPelajaran, currentYear);

    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Mata Pelajaran",
                        icon: "book-bookmark",
                        value: await MataPelajaran.countDocuments().lean(),
                        link: "penilaian/mata-pelajaran",
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
                        title: "Statistik Mata Pelajaran Baru",
                        link: { link: "penilaian/mata-pelajaran", title: "Mata Pelajaran", subTitle: "Penilaian" },
                        value: mataPelajaranChartData.currentYearValue,
                        text: "Mata Pelajaran Baru",
                        percentage: mataPelajaranChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: mataPelajaranChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                ],
            },
        ],
    });
});

penilaianRouter.use("/mata-pelajaran", instansiMataPelajaranRouter);
