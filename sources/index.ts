import express, { Express } from "express";
import mongoose from "mongoose";

import { mongoDBURI, pageItemArray } from "./depedency";
import { datasetYear, localMoment } from "./utility";

import {
    Alumni,
    Anggota,
    Buku,
    Guru,
    Jabatan,
    JenisKelamin,
    Jurusan,
    Kategori,
    MataPelajaran,
    Peminjaman,
    PeminjamanBuku,
    Pendidikan,
    Penerbit,
    Penulis,
    Petugas,
    Rombel,
    RombelMataPelajaran,
    RombelSemester,
    Siswa,
    TahunLulus,
    TahunMasuk,
    TahunRombel,
    TempatLahir,
    Tingkat,
    Universitas,
} from "./models";

import { pengajarRouter } from "./routes/pengajar";
import { pelajarRouter } from "./routes/pelajar";
import { lulusanRouter } from "./routes/lulusan";
import { penilaianRouter } from "./routes/penilaian";
import { instansiRouter } from "./routes/instansi";
import { perpustakaanRouter } from "./routes/perpustakaan";
import { dataUmumRouter } from "./routes/data-umum";

const app: Express = express();
const port: number = 3000;

const headTitle = "Dashboard";
const navActive = [0, 0];

app.locals.moment = localMoment;
app.locals.pageItemArray = pageItemArray;

app.set("view engine", "ejs");
app.set("views", "sources/views");
app.use(express.static("sources/public"));

app.get("/", async (req, res) => {
    const currentYear = new Date().getFullYear();

    const guruChartData: any = await datasetYear(Guru, currentYear);
    const siswaChartData: any = await datasetYear(Siswa, currentYear);

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
                        title: "Siswa",
                        icon: "user",
                        value: await Siswa.countDocuments().lean(),
                        link: "pelajar/siswa",
                    },
                    {
                        id: 3,
                        title: "Alumni",
                        icon: "user-graduate",
                        value: await Alumni.countDocuments().lean(),
                        link: "lulusan/alumni",
                    },
                    {
                        id: 4,
                        title: "Rombel",
                        icon: "archway",
                        value: await Rombel.countDocuments().lean(),
                        link: "instansi/rombel",
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
                ],
            },
        ],
        donutChartArray: [],
    });
});

app.get("/reset-database", async (req, res) => {
    await Guru.deleteMany();
    await Jabatan.deleteMany();

    await Siswa.deleteMany();
    await TahunMasuk.deleteMany();

    await Alumni.deleteMany();
    await TahunLulus.deleteMany();

    await MataPelajaran.deleteMany();

    await Rombel.deleteMany();
    await RombelSemester.deleteMany();
    await RombelMataPelajaran.deleteMany();
    await Tingkat.deleteMany();
    await Jurusan.deleteMany();
    await TahunRombel.deleteMany();

    await TempatLahir.deleteMany();
    await JenisKelamin.deleteMany();
    await Universitas.deleteMany();
    await Pendidikan.deleteMany();

    await Anggota.deleteMany();
    await Petugas.deleteMany();
    await Buku.deleteMany();
    await Kategori.deleteMany();
    await Penulis.deleteMany();
    await Penerbit.deleteMany();
    await Peminjaman.deleteMany();
    await PeminjamanBuku.deleteMany();

    res.send("done");
});

app.use("/pengajar", pengajarRouter);
app.use("/pelajar", pelajarRouter);
app.use("/lulusan", lulusanRouter);
app.use("/penilaian", penilaianRouter);
app.use("/instansi", instansiRouter);
app.use("/perpustakaan", perpustakaanRouter);
app.use("/data-umum", dataUmumRouter);

mongoose.connect(mongoDBURI, () => {
    console.log("Connected to database");

    app.listen(port, async () => {
        console.log(`Listening on http://localhost:${port}`);
    });
});
