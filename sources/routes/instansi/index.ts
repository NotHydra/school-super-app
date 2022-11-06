import { Router } from "express";

import { Jurusan, Rombel, TahunAjaran, Tingkat } from "../../models";

import { blueColorPattern, datasetYear } from "../../utility";

import { instansiRombelRouter } from "./rombel";
import { instansiTingkatRouter } from "./tingkat";
import { instansiJurusanRouter } from "./jurusan";

export const instansiRouter = Router();
export const headTitle = "Instansi";
const navActive = [8, 1];

instansiRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const rombelChartData: any = await datasetYear(Rombel, currentYear);
    const tingkatChartData: any = await datasetYear(Tingkat, currentYear);
    const jurusanChartData: any = await datasetYear(Jurusan, currentYear);

    const tingkatTotal = await Tingkat.countDocuments().lean();
    const jurusanTotal = await Jurusan.countDocuments().lean();
    const tahunAjaranTotal = await TahunAjaran.countDocuments().lean();

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
                    {
                        id: 3,
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
                        link: { link: "instansi/rombel", title: "Rombel", subTitle: "Instansi" },
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
                        link: { link: "instansi/rombel", title: "Rombel", subTitle: "Instansi" },
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
                        title: "Statistik Rombel Berdasarkan Tahun Ajaran",
                        link: { link: "instansi/rombel", title: "Rombel", subTitle: "Instansi" },
                        dataset: await Promise.all(
                            (
                                await TahunAjaran.find().select("tahun_ajaran").sort({ tahun_ajaran: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.tahun_ajaran,
                                    value: await Rombel.countDocuments({ id_tahun_ajaran: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, tahunAjaranTotal),
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
