import express, { Express } from "express";
import mongoose from "mongoose";

import { mongoDBURI, navItemArray } from "./depedency";
import { localMoment } from "./utility";

import { bukuIndukRouter } from "./routes/buku-induk";

const app: Express = express();
const port: number = 3000;
const headTitle = "Dashboard";
const partialPath = "./..";
const navActive = [0, 0];

app.locals.moment = localMoment;
app.locals.navItemArray = navItemArray;

app.set("view engine", "ejs");
app.set("views", "sources/views");
app.use(express.static("sources/public"));

app.get("/", (req, res) => {
    res.render("pages/index", { headTitle, partialPath, navActive });
});

app.use("/buku-induk", bukuIndukRouter);

mongoose.connect(mongoDBURI, () => {
    console.log("Connected to database");

    app.listen(port, async () => {
        console.log(`Listening on http://localhost:${port}`);
    });
});
