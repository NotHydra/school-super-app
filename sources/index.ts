import express, { Express } from "express";
import mongoose from "mongoose";

import { mongoDBURI, pageItemArray } from "./depedency";
import { localMoment } from "./utility";

import { JenisKelamin, Jurusan, MataPelajaran, Raport, Rombel, Siswa, TahunMasuk, TempatLahir, Tingkat } from "./models";

import { bukuIndukRouter } from "./routes/buku-induk";
import { penilaianRouter } from "./routes/penilaian";

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
                        value: await Siswa.countDocuments(),
                    },
                    {
                        id: 2,
                        title: "Alumni",
                        icon: "user",
                        value: await Siswa.countDocuments(),
                    },
                    {
                        id: 3,
                        title: "Guru",
                        icon: "user",
                        value: await Siswa.countDocuments(),
                    },
                    {
                        id: 4,
                        title: "Buku",
                        icon: "user",
                        value: await Siswa.countDocuments(),
                    },
                ],
            },
        ],
    });
});

app.get("/reset-database", async (req, res) => {
    await Siswa.deleteMany();
    await TempatLahir.deleteMany();
    await JenisKelamin.deleteMany();
    await TahunMasuk.deleteMany();
    await Tingkat.deleteMany();
    await Jurusan.deleteMany();
    await Rombel.deleteMany();

    await Raport.deleteMany();
    await MataPelajaran.deleteMany();

    res.send("done");
});

app.use("/buku-induk", bukuIndukRouter);
app.use("/penilaian", penilaianRouter);

mongoose.connect(mongoDBURI, () => {
    console.log("Connected to database");

    app.listen(port, async () => {
        console.log(`Listening on http://localhost:${port}`);
    });
});
