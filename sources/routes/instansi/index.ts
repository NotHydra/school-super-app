import { Router } from "express";

import { Jurusan, Rombel, TahunRombel, Tingkat } from "../../models";

import { blueColorPattern, datasetYear } from "../../utility";

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

    const tingkatTotal = await Tingkat.countDocuments().lean();
    const jurusanTotal = await Jurusan.countDocuments().lean();
    const tahunRombelTotal = await TahunRombel.countDocuments().lean();

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
        donutChartArray: [
            {
                id: 1,
                donutChartChild: [
                    {
                        id: 1,
                        title: "Statistik Rombel Berdasarkan Tingkat",
                        dataset: await Promise.all(
                            (
                                await Tingkat.find().select("tingkat").sort({ tingkat: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.tingkat,
                                    value: await Rombel.countDocuments({ id_tingkat: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, tingkatTotal),
                                };
                            })
                        ),
                    },
                    {
                        id: 2,
                        title: "Statistik Rombel Berdasarkan Jurusan",
                        dataset: await Promise.all(
                            (
                                await Jurusan.find().select("jurusan").sort({ jurusan: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.jurusan,
                                    value: await Rombel.countDocuments({ id_jurusan: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, jurusanTotal),
                                };
                            })
                        ),
                    },
                    {
                        id: 3,
                        title: "Statistik Rombel Berdasarkan Tahun Rombel",
                        dataset: await Promise.all(
                            (
                                await TahunRombel.find().select("tahun_rombel").sort({ tahun_rombel: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.tahun_rombel,
                                    value: await Rombel.countDocuments({ id_tahun_rombel: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, tahunRombelTotal),
                                };
                            })
                        ),
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
