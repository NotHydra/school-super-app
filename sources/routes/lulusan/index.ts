import { Router } from "express";

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

lulusanRouter.use("/tahun-lulus", lulusanTahunLulusRouter);
