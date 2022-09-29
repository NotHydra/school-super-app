import express, { Express } from "express";
import path from "path";

const app: Express = express();
const port: number = 3000;

app.set("view engine", "ejs");
app.set("views", "sources//views");

app.use(express.static("sources/public"));

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.render("index");
});
