import express, { Express } from "express";
import { loggerMiddleware } from "./common/middleware/loggerMiddleware";
import { navItemArray } from "./depedency";

const app: Express = express();
const port: number = 3000;
const headTitle = "Dashboard";
const partialPath = "./..";

app.set("view engine", "ejs");
app.set("views", "sources/views");

app.use(loggerMiddleware);

app.use(express.static("sources/public"));

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.render("pages/index", { headTitle, partialPath, navItemArray, navActive: [0, 0] });
});
