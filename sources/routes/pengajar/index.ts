import { Router } from "express";

import { blueColorPattern, datasetYear } from "../../utility";

import { Guru, Jabatan, JenisKelamin, TempatLahir } from "../../models";

import { pengajarGuruRouter } from "./guru";
import { pengajarWaliKelasRouter } from "./wali-kelas";
import { pengajarJabatanRouter } from "./jabatan";

export const pengajarRouter = Router();
export const headTitle = "Pengajar";
const navActive = [4, 1];

pengajarRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const guruChartData: any = await datasetYear(Guru, currentYear);
    const jabatanChartData: any = await datasetYear(Jabatan, currentYear);

    const jenisKelaminTotal = await JenisKelamin.countDocuments().lean();
    const tempatLahirTotal = await TempatLahir.countDocuments().lean();

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
        donutChartArray: [
            {
                id: 1,
                donutChartChild: [
                    {
                        id: 1,
                        title: "Statistik Guru Berdasarkan Jenis Kelamin",
                        link: { link: "pengajar/guru", title: "Guru", subTitle: "Pengajar" },
                        dataset: await Promise.all(
                            (
                                await JenisKelamin.find().select("jenis_kelamin").sort({ jenis_kelamin: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.jenis_kelamin,
                                    value: await Guru.countDocuments({ id_jenis_kelamin: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, jenisKelaminTotal),
                                };
                            })
                        ),
                    },
                    {
                        id: 2,
                        title: "Statistik Guru Berdasarkan Tempat Lahir",
                        link: { link: "pengajar/guru", title: "Guru", subTitle: "Pengajar" },
                        dataset: await Promise.all(
                            (
                                await TempatLahir.find().select("tempat_lahir").sort({ tempat_lahir: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.tempat_lahir,
                                    value: await Guru.countDocuments({ id_tempat_lahir: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, tempatLahirTotal),
                                };
                            })
                        ),
                    },
                ],
            },
        ],
    });
});

pengajarRouter.use("/guru", pengajarGuruRouter);
pengajarRouter.use("/wali-kelas", pengajarWaliKelasRouter);
pengajarRouter.use("/jabatan", pengajarJabatanRouter);
