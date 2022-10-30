import { Router } from "express";

import { blueColorPattern, datasetYear } from "../../utility";

import { Alumni, Rombel, Siswa, TahunLulus, TahunMasuk, TahunRombel } from "../../models";

import { lulusanAlumniRouter } from "./alumni";
import { lulusanTahunLulusRouter } from "./tahun-lulus";

export const lulusanRouter = Router();
export const headTitle = "Lulusan";
const navActive = [5, 1];

lulusanRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const alumniChartData: any = await datasetYear(Alumni, currentYear);
    const tahunLulusChartData: any = await datasetYear(TahunLulus, currentYear);

    const alumniDonutChartData: any = await Alumni.find().select("id_siswa").populate({ path: "id_siswa", select: "id_rombel id_tahun_masuk", model: Siswa }).lean();
    const rombelTotal = await Rombel.countDocuments().lean();
    const tahunMasukTotal = await TahunMasuk.countDocuments().lean();
    const tahunLulusTotal = await TahunLulus.countDocuments().lean();

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
        donutChartArray: [
            {
                id: 1,
                donutChartChild: [
                    {
                        id: 1,
                        title: "Statistik Alumni Berdasarkan Rombel",
                        link: { link: "lulusan/alumni", title: "Alumni", subTitle: "Lulusan" },
                        dataset: await Promise.all(
                            (
                                await Rombel.find()
                                    .select("rombel id_tahun_rombel")
                                    .populate({ path: "id_tahun_rombel", select: "tahun_rombel", model: TahunRombel })
                                    .sort({ rombel: 1 })
                                    .lean()
                            ).map(async (itemObject: any, itemIndex) => {
                                let itemValue = 0;
                                alumniDonutChartData.forEach((alumniDonutChartObject: any) => {
                                    if (alumniDonutChartObject.id_siswa.id_rombel == itemObject._id) {
                                        itemValue += 1;
                                    }
                                });
                                return {
                                    id: itemIndex + 1,
                                    label: `${itemObject.rombel} - ${itemObject.id_tahun_rombel.tahun_rombel}`,
                                    value: itemValue,
                                    color: blueColorPattern(itemIndex + 1, rombelTotal),
                                };
                            })
                        ),
                    },
                    {
                        id: 2,
                        title: "Statistik Alumni Berdasarkan Tahun Masuk",
                        link: { link: "lulusan/alumni", title: "Alumni", subTitle: "Lulusan" },
                        dataset: await Promise.all(
                            (
                                await TahunMasuk.find().select("tahun_masuk").sort({ tahun_masuk: 1 }).lean()
                            ).map(async (itemObject: any, itemIndex) => {
                                let itemValue = 0;
                                alumniDonutChartData.forEach((alumniDonutChartObject: any) => {
                                    if (alumniDonutChartObject.id_siswa.id_tahun_masuk == itemObject._id) {
                                        itemValue += 1;
                                    }
                                });
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.tahun_masuk,
                                    value: itemValue,
                                    color: blueColorPattern(itemIndex + 1, tahunMasukTotal),
                                };
                            })
                        ),
                    },
                    {
                        id: 3,
                        title: "Statistik Alumni Berdasarkan Tahun Lulus",
                        link: { link: "lulusan/alumni", title: "Alumni", subTitle: "Lulusan" },
                        dataset: await Promise.all(
                            (
                                await TahunLulus.find().select("tahun_lulus").sort({ tahun_lulus: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.tahun_lulus,
                                    value: await Alumni.countDocuments({ id_tahun_lulus: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, tahunLulusTotal),
                                };
                            })
                        ),
                    },
                ],
            },
        ],
    });
});

lulusanRouter.use("/alumni", lulusanAlumniRouter);
lulusanRouter.use("/tahun-lulus", lulusanTahunLulusRouter);
