import { Router } from "express";

import { roleGuard } from "../../authentication/guard/role.guard";

import {} from "../../models";

import { sekolahIndentitasRouter } from "./indentitas";

export const sekolahRouter = Router();
export const headTitle = "Sekolah";
const navActive = [3, 1];

sekolahRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
        lineChartArray: [],
        donutChartArray: [],
    });
});

sekolahRouter.use("/indentitas", roleGuard(4), sekolahIndentitasRouter);
