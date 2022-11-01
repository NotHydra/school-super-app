import { Router } from "express";

import { blueColorPattern, datasetYear } from "../../utility";

import { Anggota, Buku, JenisKelamin, Kategori, Peminjaman, Penerbit, Pengembalian, Penulis, Petugas, TempatLahir } from "../../models";

import { perpustakaanAnggotaRouter } from "./anggota";
import { perpustakaanPetugasRouter } from "./petugas";
import { perpustakaanBukuRouter } from "./buku";
import { perpustakaanKategoriRouter } from "./kategori";
import { perpustakaanPenulisRouter } from "./penulis";
import { perpustakaanPenerbitRouter } from "./penerbit";
import { perpustakaanPeminjamanRouter } from "./peminjaman";
import { perpustakaanPengembalianRouter } from "./pengembalian";

export const perpustakaanRouter = Router();
export const headTitle = "Perpustakaan";
const navActive = [9, 1];

perpustakaanRouter.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const anggotaChartData: any = await datasetYear(Anggota, currentYear);
    const petugasChartData: any = await datasetYear(Petugas, currentYear);
    const bukuChartData: any = await datasetYear(Buku, currentYear);
    const kategoriChartData: any = await datasetYear(Kategori, currentYear);
    const penulisChartData: any = await datasetYear(Penulis, currentYear);
    const penerbitChartData: any = await datasetYear(Penerbit, currentYear);
    const peminjamanChartData: any = await datasetYear(Peminjaman, currentYear);
    const pengembalianChartData: any = await datasetYear(Pengembalian, currentYear);

    const tempatLahirTotal = await TempatLahir.countDocuments().lean();
    const jenisKelaminTotal = await JenisKelamin.countDocuments().lean();
    const kategoriTotal = await Kategori.countDocuments().lean();
    const penulisTotal = await Penulis.countDocuments().lean();
    const penerbitTotal = await Penerbit.countDocuments().lean();

    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Anggota",
                        icon: "user",
                        value: await Anggota.countDocuments().lean(),
                        link: "perpustakaan/anggota",
                    },
                    {
                        id: 2,
                        title: "Petugas",
                        icon: "user-tie",
                        value: await Petugas.countDocuments().lean(),
                        link: "perpustakaan/petugas",
                    },
                    {
                        id: 3,
                        title: "Buku",
                        icon: "book",
                        value: await Buku.countDocuments().lean(),
                        link: "perpustakaan/buku",
                    },
                    {
                        id: 4,
                        title: "Kategori",
                        icon: "tag",
                        value: await Kategori.countDocuments().lean(),
                        link: "perpustakaan/kategori",
                    },
                ],
            },
            {
                id: 2,
                cardItemChild: [
                    {
                        id: 1,
                        title: "Penulis",
                        icon: "pen-nib",
                        value: await Penulis.countDocuments().lean(),
                        link: "perpustakaan/penulis",
                    },
                    {
                        id: 2,
                        title: "Penerbit",
                        icon: "globe",
                        value: await Penerbit.countDocuments().lean(),
                        link: "perpustakaan/penerbit",
                    },
                    {
                        id: 3,
                        title: "Peminjaman",
                        icon: "list",
                        value: await Peminjaman.countDocuments().lean(),
                        link: "perpustakaan/peminjaman",
                    },
                    {
                        id: 4,
                        title: "Pengembalian",
                        icon: "list-check",
                        value: await Pengembalian.countDocuments().lean(),
                        link: "perpustakaan/pengembalian",
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
                        title: "Statistik Anggota Baru",
                        link: { link: "perpustakaan/anggota", title: "Anggota", subTitle: "Perpustakaan" },
                        value: anggotaChartData.currentYearValue,
                        text: "Anggota Baru",
                        percentage: anggotaChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: anggotaChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                    {
                        id: 2,
                        title: "Statistik Petugas Baru",
                        link: { link: "perpustakaan/petugas", title: "Petugas", subTitle: "Perpustakaan" },
                        value: petugasChartData.currentYearValue,
                        text: "Petugas Baru",
                        percentage: petugasChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: petugasChartData.dataset,
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
                        title: "Statistik Buku Baru",
                        link: { link: "perpustakaan/buku", title: "Buku", subTitle: "Perpustakaan" },
                        value: bukuChartData.currentYearValue,
                        text: "Buku Baru",
                        percentage: bukuChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: bukuChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                    {
                        id: 2,
                        title: "Statistik Kategori Baru",
                        link: { link: "perpustakaan/kategori", title: "Kategori", subTitle: "Perpustakaan" },
                        value: kategoriChartData.currentYearValue,
                        text: "Kategori Baru",
                        percentage: kategoriChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: kategoriChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                ],
            },
            {
                id: 3,
                lineChartChild: [
                    {
                        id: 1,
                        title: "Statistik Penulis Baru",
                        link: { link: "perpustakaan/penulis", title: "Penulis", subTitle: "Perpustakaan" },
                        value: penulisChartData.currentYearValue,
                        text: "Penulis Baru",
                        percentage: penulisChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: penulisChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                    {
                        id: 2,
                        title: "Statistik Penerbit Baru",
                        link: { link: "perpustakaan/penerbit", title: "Penerbit", subTitle: "Perpustakaan" },
                        value: penerbitChartData.currentYearValue,
                        text: "Penerbit Baru",
                        percentage: penerbitChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: penerbitChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                ],
            },
            {
                id: 4,
                lineChartChild: [
                    {
                        id: 1,
                        title: "Statistik Peminjaman Baru",
                        link: { link: "perpustakaan/peminjaman", title: "Peminjaman", subTitle: "Perpustakaan" },
                        value: peminjamanChartData.currentYearValue,
                        text: "Peminjaman Baru",
                        percentage: peminjamanChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: peminjamanChartData.dataset,
                        firstLegend: "Tahun Ini",
                        secondLegend: "Tahun Lalu",
                    },
                    {
                        id: 2,
                        title: "Statistik Pengembalian Baru",
                        link: { link: "perpustakaan/pengembalian", title: "Pengembalian", subTitle: "Perpustakaan" },
                        value: pengembalianChartData.currentYearValue,
                        text: "Pengembalian Baru",
                        percentage: pengembalianChartData.percentageIncrease,
                        timeRange: "Sejak Tahun Lalu",
                        dataset: pengembalianChartData.dataset,
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
                        title: "Statistik Petugas Berdasarkan Tempat Lahir",
                        link: { link: "perpustakaan/petugas", title: "Petugas", subTitle: "Perpustakaan" },
                        dataset: await Promise.all(
                            (
                                await TempatLahir.find().select("tempat_lahir").sort({ tempat_lahir: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.tempat_lahir,
                                    value: await Petugas.countDocuments({ id_tempat_lahir: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, tempatLahirTotal),
                                };
                            })
                        ),
                    },
                    {
                        id: 2,
                        title: "Statistik Petugas Berdasarkan Jenis Kelamin",
                        link: { link: "perpustakaan/petugas", title: "Petugas", subTitle: "Perpustakaan" },
                        dataset: await Promise.all(
                            (
                                await JenisKelamin.find().select("jenis_kelamin").sort({ jenis_kelamin: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.jenis_kelamin,
                                    value: await Petugas.countDocuments({ id_jenis_kelamin: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, jenisKelaminTotal),
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
                        title: "Statistik Buku Berdasarkan Kategori",
                        link: { link: "perpustakaan/buku", title: "Buku", subTitle: "Perpustakaan" },
                        dataset: await Promise.all(
                            (
                                await Kategori.find().select("kategori").sort({ kategori: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.kategori,
                                    value: await Buku.countDocuments({ id_kategori: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, kategoriTotal),
                                };
                            })
                        ),
                    },
                    {
                        id: 2,
                        title: "Statistik Buku Berdasarkan Penulis",
                        link: { link: "perpustakaan/buku", title: "Buku", subTitle: "Perpustakaan" },
                        dataset: await Promise.all(
                            (
                                await Penulis.find().select("penulis").sort({ penulis: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.penulis,
                                    value: await Buku.countDocuments({ id_penulis: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, penulisTotal),
                                };
                            })
                        ),
                    },
                ],
            },
            {
                id: 3,
                donutChartChild: [
                    {
                        id: 1,
                        title: "Statistik Buku Berdasarkan Penerbit",
                        link: { link: "perpustakaan/buku", title: "Buku", subTitle: "Perpustakaan" },
                        dataset: await Promise.all(
                            (
                                await Penerbit.find().select("penerbit").sort({ penerbit: 1 }).lean()
                            ).map(async (itemObject, itemIndex) => {
                                return {
                                    id: itemIndex + 1,
                                    label: itemObject.penerbit,
                                    value: await Buku.countDocuments({ id_penerbit: itemObject._id }).lean(),
                                    color: blueColorPattern(itemIndex + 1, penerbitTotal),
                                };
                            })
                        ),
                    },
                    {
                        id: 2,
                        title: "Statistik Peminjaman & Pengembalian",
                        link: { link: "perpustakaan/pengembalian", title: "Pengembalian", subTitle: "Perpustakaan" },
                        dataset: [
                            {
                                id: 1,
                                label: "Peminjaman",
                                value: await Peminjaman.countDocuments().lean(),
                                color: blueColorPattern(1, 2),
                            },
                            {
                                id: 2,
                                label: "Pengembalian",
                                value: await Pengembalian.countDocuments().lean(),
                                color: blueColorPattern(2, 2),
                            },
                        ],
                    },
                ],
            },
        ],
    });
});

perpustakaanRouter.use("/anggota", perpustakaanAnggotaRouter);
perpustakaanRouter.use("/petugas", perpustakaanPetugasRouter);
perpustakaanRouter.use("/buku", perpustakaanBukuRouter);
perpustakaanRouter.use("/kategori", perpustakaanKategoriRouter);
perpustakaanRouter.use("/penulis", perpustakaanPenulisRouter);
perpustakaanRouter.use("/penerbit", perpustakaanPenerbitRouter);
perpustakaanRouter.use("/peminjaman", perpustakaanPeminjamanRouter);
perpustakaanRouter.use("/pengembalian", perpustakaanPengembalianRouter);
