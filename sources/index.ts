import express, { Express } from "express";
import mongoose from "mongoose";

import { mongoDBURI, pageItemArray } from "./depedency";
import { localMoment } from "./utility";

import { bukuIndukRouter } from "./routes/buku-induk";
import { Siswa } from "./models";

const app: Express = express();
const port: number = 3000;

const headTitle = "Dashboard";
const partialPath = "./..";
const navActive = [0, 0];

app.locals.moment = localMoment;
app.locals.pageItemArray = pageItemArray;

app.set("view engine", "ejs");
app.set("views", "sources/views");
app.use(express.static("sources/public"));

app.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        partialPath,
        navActive,
        boxItemArray: [
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
    });
});

app.use("/buku-induk", bukuIndukRouter);

mongoose.connect(mongoDBURI, () => {
    console.log("Connected to database");

    app.listen(port, async () => {
        console.log(`Listening on http://localhost:${port}`);
    });
});
