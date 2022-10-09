import express, { Express } from "express";
import mongoose from "mongoose";

import { mongoDBURI, pageItemArray } from "./depedency";
import { localMoment } from "./utility";

import { JenisKelamin, Pendidikan, TempatLahir, Universitas } from "./models";
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
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
    });
});

app.get("/reset-collection", async (req, res) => {
    await TempatLahir.deleteMany();
    await JenisKelamin.deleteMany();
    await Universitas.deleteMany();
    await Pendidikan.deleteMany();

    res.send("done");
});

app.use("/data-umum", dataUmumRouter);

mongoose.connect(mongoDBURI, () => {
    console.log("Connected to database");

    app.listen(port, async () => {
        console.log(`Listening on http://localhost:${port}`);
    });
});
