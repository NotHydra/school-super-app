import { Router } from "express";

import { blueColorPattern, datasetYear } from "../../utility";

import { JenisKelamin, Keterangan, Klasifikasi, Pelanggar, Rombel, Siswa, TahunAjaran, TahunMasuk, TempatLahir, Tipe } from "../../models";

import { pelanggaranPelanggarRouter } from "./pelanggar";
import { pelanggaranTipeRouter } from "./tipe";
import { pelanggaranKlasifikasiRouter } from "./klasifikasi";

export const pelanggaranRouter = Router();
export const headTitle = "Pelanggaran";
const navActive = [12, 1];

pelanggaranRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const pelanggarChartData: any = await datasetYear(Pelanggar, currentYear);
    const tipeChartData: any = await datasetYear(Tipe, currentYear);
    const klasifikasiChartData: any = await datasetYear(Klasifikasi, currentYear);

    const klasifikasiTotal = await Klasifikasi.countDocuments().lean();

    const pelanggarScoreArray: any = [];

    (
        await Pelanggar.find()
            .select("id_siswa id_klasifikasi")
            .populate({
                path: "id_siswa",
                select: "nisn nama_lengkap id_rombel aktif id_keterangan",
                populate: [
                    {
                        path: "id_rombel",
                        select: "rombel id_tahun_ajaran",
                        populate: [{ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran }],
                        model: Rombel,
                    },
                    { path: "id_keterangan", select: "keterangan", model: Keterangan },
                ],
                model: Siswa,
            })
            .populate({
                path: "id_klasifikasi",
                select: "id_tipe",
                populate: [{ path: "id_tipe", select: "skor", model: Tipe }],
                model: Klasifikasi,
            })
            .sort({ id_siswa: 1 })
            .lean()
    ).forEach((itemObject: any) => {
        let pelanggarScoreIsNew = true;
        pelanggarScoreArray.find((pelanggarScoreObject: any) => {
            if (itemObject.id_siswa._id == pelanggarScoreObject.id) {
                pelanggarScoreIsNew = false;

                pelanggarScoreObject.value += itemObject.id_klasifikasi.id_tipe.skor;
            }
        });

        if (pelanggarScoreIsNew) {
            pelanggarScoreArray.push({
                id: itemObject.id_siswa._id,
                label: `${itemObject.id_siswa.nisn} - ${itemObject.id_siswa.nama_lengkap} - ${itemObject.id_siswa.id_rombel.rombel} ${
                    itemObject.id_siswa.id_rombel.id_tahun_ajaran.tahun_ajaran
                } - ${
                    itemObject.id_siswa.aktif == true
                        ? "Aktif"
                        : "Tidak Aktif" + (itemObject.id_siswa.id_keterangan.keterangan == "-" ? "" : " - " + itemObject.id_siswa.id_keterangan.keterangan)
                } - Skor`,
                value: itemObject.id_klasifikasi.id_tipe.skor,
            });
        }
    });

    pelanggarScoreArray.sort((a: any, b: any) => {
        return b.value - a.value;
    });

    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Pelanggar",
                        icon: "user-slash",
                        value: await Pelanggar.countDocuments().lean(),
                        link: "pelanggaran/pelanggar",
                    },
                    {
                        id: 2,
                        title: "Tipe",
                        icon: "clipboard",
                        value: await Tipe.countDocuments().lean(),
                        link: "pelanggaran/tipe",
                    },
                    {
                        id: 3,
                        title: "Klasifikasi",
                        icon: "ban",
                        value: await Klasifikasi.countDocuments().lean(),
                        link: "pelanggaran/klasifikasi",
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
                        title: "Statistik Pelanggar Baru",
                        link: { link: "pelanggaran/pelanggar", title: "Pelanggar", subTitle: "Pelanggaran" },
                        value: pelanggarChartData.currentYearValue,
                        text: "Pelanggar Baru",
                        percentage: pelanggarChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: pelanggarChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                    {
                        id: 2,
                        title: "Statistik Tipe Baru",
                        link: { link: "pelanggaran/tipe", title: "Tipe", subTitle: "Pelanggaran" },
                        value: tipeChartData.currentYearValue,
                        text: "Tipe Baru",
                        percentage: tipeChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: tipeChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                    {
                        id: 3,
                        title: "Statistik Klasifikasi Baru",
                        link: { link: "pelanggaran/klasifikasi", title: "Klasifikasi", subTitle: "Pelanggaran" },
                        value: klasifikasiChartData.currentYearValue,
                        text: "Klasifikasi Baru",
                        percentage: klasifikasiChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: klasifikasiChartData.dataset,
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
                        title: "Statistik Pelanggar Berdasarkan Klasifikasi",
                        link: { link: "pelanggaran/pelanggar", title: "Pelanggar", subTitle: "Pelanggaran" },
                        dataset: await Promise.all(
                            (
                                await Klasifikasi.find()
                                    .select("id_tipe klasifikasi")
                                    .populate({ path: "id_tipe", select: "tipe", model: Tipe })
                                    .sort({ klasifikasi: 1 })
                                    .lean()
                            )
                                .sort((a: any, b: any) => {
                                    return a.id_tipe.tipe.localeCompare(b.id_tipe.tipe);
                                })
                                .map(async (itemObject: any, itemIndex) => {
                                    return {
                                        id: itemIndex + 1,
                                        label: `Tipe ${itemObject.id_tipe.tipe} - ${itemObject.klasifikasi}`,
                                        value: await Pelanggar.countDocuments({ id_klasifikasi: itemObject._id }).lean(),
                                        color: blueColorPattern(itemIndex + 1, klasifikasiTotal),
                                    };
                                })
                        ),
                    },
                    {
                        id: 2,
                        title: "Statistik Pelanggar Berdasarkan Skor",
                        link: { link: "pelanggaran/pelanggar", title: "Pelanggar", subTitle: "Pelanggaran" },
                        dataset: pelanggarScoreArray.map((itemObject: any, itemIndex: number) => {
                            return {
                                id: itemIndex + 1,
                                label: itemObject.label,
                                value: itemObject.value,
                                color: blueColorPattern(itemIndex + 1, pelanggarScoreArray.length),
                            };
                        }),
                    },
                ],
            },
        ],
    });
});

pelanggaranRouter.use("/pelanggar", pelanggaranPelanggarRouter);
pelanggaranRouter.use("/tipe", pelanggaranTipeRouter);
pelanggaranRouter.use("/klasifikasi", pelanggaranKlasifikasiRouter);
