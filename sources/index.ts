import express, { Express } from "express";
import mongoose from "mongoose";
import { loggerMiddleware } from "./common/middleware/loggerMiddleware";
import { mongoDBURI, navItemArray } from "./depedency";
import { bukuIndukRouter } from "./routes/buku-induk";

const app: Express = express();
const port: number = 3000;
const headTitle = "Dashboard";
const partialPath = "./..";

app.set("view engine", "ejs");
app.set("views", "sources/views");

app.use(loggerMiddleware);

app.use(express.static("sources/public"));

app.get("/", (req, res) => {
    res.render("pages/index", { headTitle, partialPath, navItemArray, navActive: [0, 0] });
});

app.use("/buku-induk", bukuIndukRouter);

mongoose.connect(mongoDBURI, () => {
    console.log("Connected to database");

    app.listen(port, async () => {
        console.log(`Listening on http://localhost:${port}`);
    });
});
