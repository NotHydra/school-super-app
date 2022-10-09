import { Router } from "express";

import { lulusanAlumniRouter } from "./alumni";
import { lulusanTahunLulusRouter } from "./tahun-lulus";

export const lulusanRouter = Router();
export const headTitle = "Lulusan";
const navActive = [3, 0];

lulusanRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
    });
});

lulusanRouter.use("/alumni", lulusanAlumniRouter);
lulusanRouter.use("/tahun-lulus", lulusanTahunLulusRouter);
