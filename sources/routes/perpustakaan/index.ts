import { Router } from "express";

import { datasetYear } from "../../utility";

import { Anggota, Buku, Kategori, Peminjaman, Penerbit, Pengembalian, Penulis, Petugas } from "../../models";

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
const navActive = [6, 0];

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
