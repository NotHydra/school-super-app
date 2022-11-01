import { Router } from "express";

import { datasetYear } from "../../utility";

import { JenisKelamin, Pendidikan, TempatLahir, Universitas } from "../../models";

import { dataUmumTempatLahirRouter } from "./tempat-lahir";
import { dataUmumJenisKelaminRouter } from "./jenis-kelamin";
import { dataUmumUniversitasRouter } from "./universitas";
import { dataUmumPendidikanRouter } from "./pendidikan";

export const dataUmumRouter = Router();
export const headTitle = "Data Umum";
const navActive = [10, 1];

dataUmumRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const tempatLahirChartData: any = await datasetYear(TempatLahir, currentYear);
    const jenisKelaminChartData: any = await datasetYear(JenisKelamin, currentYear);
    const universitasChartData: any = await datasetYear(Universitas, currentYear);
    const pendidikanChartData: any = await datasetYear(Pendidikan, currentYear);

    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Tempat Lahir",
                        icon: "city",
                        value: await TempatLahir.countDocuments().lean(),
                        link: "data-umum/tempat-lahir",
                    },
                    {
                        id: 2,
                        title: "Jenis Kelamin",
                        icon: "venus-mars",
                        value: await JenisKelamin.countDocuments().lean(),
                        link: "data-umum/jenis-kelamin",
                    },
                    {
                        id: 3,
                        title: "Universitas",
                        icon: "school",
                        value: await Universitas.countDocuments().lean(),
                        link: "data-umum/universitas",
                    },
                    {
                        id: 4,
                        title: "Pendidikan",
                        icon: "tag",
                        value: await Pendidikan.countDocuments().lean(),
                        link: "data-umum/pendidikan",
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
                        title: "Statistik Tempat Lahir Baru",
                        link: { link: "data-umum/tempat-lahir", title: "Tempat Lahir", subTitle: "Data Umum" },
                        value: tempatLahirChartData.currentYearValue,
                        text: "Tempat Lahir Baru",
                        percentage: tempatLahirChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: tempatLahirChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                    {
                        id: 2,
                        title: "Statistik Jenis Kelamin Baru",
                        link: { link: "data-umum/jenis-kelamin", title: "Jenis Kelamin", subTitle: "Data Umum" },
                        value: jenisKelaminChartData.currentYearValue,
                        text: "Jenis Kelamin Baru",
                        percentage: jenisKelaminChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: jenisKelaminChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                ],
            },
            {
                id: 2,
                lineChartChild: [
                    {
                        id: 1,
                        title: "Statistik Universitas Baru",
                        link: { link: "data-umum/universitas", title: "Universitas", subTitle: "Data Umum" },
                        value: universitasChartData.currentYearValue,
                        text: "Universitas Baru",
                        percentage: universitasChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: universitasChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                    {
                        id: 2,
                        title: "Statistik Pendidikan Baru",
                        link: { link: "data-umum/pendidikan", title: "Pendidikan", subTitle: "Data Umum" },
                        value: pendidikanChartData.currentYearValue,
                        text: "Pendidikan Baru",
                        percentage: pendidikanChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: pendidikanChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                ],
            },
        ],
        donutChartArray: [],
    });
});

dataUmumRouter.use("/tempat-lahir", dataUmumTempatLahirRouter);
dataUmumRouter.use("/jenis-kelamin", dataUmumJenisKelaminRouter);
dataUmumRouter.use("/universitas", dataUmumUniversitasRouter);
dataUmumRouter.use("/pendidikan", dataUmumPendidikanRouter);
