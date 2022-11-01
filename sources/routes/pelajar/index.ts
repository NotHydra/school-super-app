import { Router } from "express";

import { blueColorPattern, datasetYear } from "../../utility";

import { JenisKelamin, Rombel, Siswa, TahunMasuk, TahunRombel, TempatLahir } from "../../models";

import { pelajarSiswaRouter } from "./siswa";
import { pelajarTahunMasukRouter } from "./tahun-masuk";

export const pelajarRouter = Router();
export const headTitle = "Pelajar";
const navActive = [5, 1];

pelajarRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const siswaChartData: any = await datasetYear(Siswa, currentYear);
    const tahunMasukChartData: any = await datasetYear(TahunMasuk, currentYear);

    const jenisKelaminTotal = await JenisKelamin.countDocuments().lean();
    const tempatLahirTotal = await TempatLahir.countDocuments().lean();
    const tahunMasukTotal = await TahunMasuk.countDocuments().lean();
    const rombelTotal = await Rombel.countDocuments().lean();

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
        donutChartArray: [
            {
                id: 1,
                donutChartChild: [
                    {
                        id: 1,
                        title: "Statistik Siswa Berdasarkan Jenis Kelamin",
                        link: { link: "pelajar/siswa", title: "Siswa", subTitle: "Pelajar" },
                        dataset: await Promise.all(
                            (
                                await JenisKelamin.find().select("jenis_kelamin").sort({ jenis_kelamin: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.jenis_kelamin,
                                    value: await Siswa.countDocuments({ id_jenis_kelamin: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, jenisKelaminTotal),
                                };
                            })
                        ),
                    },
                    {
                        id: 2,
                        title: "Statistik Siswa Berdasarkan Tempat Lahir",
                        link: { link: "pelajar/siswa", title: "Siswa", subTitle: "Pelajar" },
                        dataset: await Promise.all(
                            (
                                await TempatLahir.find().select("tempat_lahir").sort({ tempat_lahir: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.tempat_lahir,
                                    value: await Siswa.countDocuments({ id_tempat_lahir: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, tempatLahirTotal),
                                };
                            })
                        ),
                    },
                ],
            },
            {
                id: 2,
                donutChartChild: [
                    {
                        id: 1,
                        title: "Statistik Siswa Berdasarkan Tahun Masuk",
                        link: { link: "pelajar/siswa", title: "Siswa", subTitle: "Pelajar" },
                        dataset: await Promise.all(
                            (
                                await TahunMasuk.find().select("tahun_masuk").sort({ tahun_masuk: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.tahun_masuk,
                                    value: await Siswa.countDocuments({ id_tahun_masuk: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, tahunMasukTotal),
                                };
                            })
                        ),
                    },
                    {
                        id: 2,
                        title: "Statistik Siswa Berdasarkan Rombel",
                        link: { link: "pelajar/siswa", title: "Siswa", subTitle: "Pelajar" },
                        dataset: await Promise.all(
                            (
                                await Rombel.find()
                                    .select("rombel id_tahun_rombel")
                                    .populate({ path: "id_tahun_rombel", select: "tahun_rombel", model: TahunRombel })
                                    .sort({ rombel: 1 })
                                    .lean()
                            ).map(async (itemObject: any, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: `${itemObject.rombel} - ${itemObject.id_tahun_rombel.tahun_rombel}`,
                                    value: await Siswa.countDocuments({ id_rombel: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, rombelTotal),
                                };
                            })
                        ),
                    },
                ],
            },
        ],
    });
});

pelajarRouter.use("/siswa", pelajarSiswaRouter);
pelajarRouter.use("/tahun-masuk", pelajarTahunMasukRouter);
