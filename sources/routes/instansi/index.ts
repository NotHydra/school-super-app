import { Router } from "express";

import { Jurusan, Rombel, TahunRombel, Tingkat } from "../../models";

import { datasetYear } from "../../utility";

import { instansiRombelRouter } from "./rombel";
import { instansiTingkatRouter } from "./tingkat";
import { instansiJurusanRouter } from "./jurusan";
import { instansiTahunRombelRouter } from "./tahun-rombel";

export const instansiRouter = Router();
export const headTitle = "Instansi";
const navActive = [5, 0];

instansiRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const rombelChartData: any = await datasetYear(Rombel, currentYear);
    const tingkatChartData: any = await datasetYear(Tingkat, currentYear);
    const jurusanChartData: any = await datasetYear(Jurusan, currentYear);
    const tahunRombelChartData: any = await datasetYear(TahunRombel, currentYear);

    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Rombel",
                        icon: "archway",
                        value: await Rombel.countDocuments().lean(),
                        link: "instansi/rombel",
                    },
                    {
                        id: 2,
                        title: "Tingkat",
                        icon: "layer-group",
                        value: await Tingkat.countDocuments().lean(),
                        link: "instansi/tingkat",
                    },
                    {
                        id: 3,
                        title: "Jurusan",
                        icon: "wrench",
                        value: await Jurusan.countDocuments().lean(),
                        link: "instansi/jurusan",
                    },
                    {
                        id: 4,
                        title: "Tahun Rombel",
                        icon: "calendar-days",
                        value: await TahunRombel.countDocuments().lean(),
                        link: "instansi/tahun-rombel",
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
                        title: "Statistik Rombel Baru",
                        link: { link: "instansi/rombel", title: "Rombel", subTitle: "Instansi" },
                        value: rombelChartData.currentYearValue,
                        text: "Rombel Baru",
                        percentage: rombelChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: rombelChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                    {
                        id: 2,
                        title: "Statistik Tingkat Baru",
                        link: { link: "instansi/tingkat", title: "Tingkat", subTitle: "Instansi" },
                        value: tingkatChartData.currentYearValue,
                        text: "Tingkat Baru",
                        percentage: tingkatChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: tingkatChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                ],
            },
            {
                id: 1,
                lineChartChild: [
                    {
                        id: 1,
                        title: "Statistik Jurusan Baru",
                        link: { link: "instansi/jurusan", title: "Jurusan", subTitle: "Instansi" },
                        value: jurusanChartData.currentYearValue,
                        text: "Jurusan Baru",
                        percentage: jurusanChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: jurusanChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                    {
                        id: 2,
                        title: "Statistik Tahun Rombel Baru",
                        link: { link: "instansi/tahun-rombel", title: "Tahun Rombel", subTitle: "Instansi" },
                        value: tahunRombelChartData.currentYearValue,
                        text: "Tahun Rombel Baru",
                        percentage: tahunRombelChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: tahunRombelChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                ],
            },
        ],
    });
});

instansiRouter.use("/rombel", instansiRombelRouter);
instansiRouter.use("/tingkat", instansiTingkatRouter);
instansiRouter.use("/jurusan", instansiJurusanRouter);
instansiRouter.use("/tahun-rombel", instansiTahunRombelRouter);
