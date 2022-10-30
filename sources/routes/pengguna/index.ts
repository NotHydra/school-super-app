import { Router } from "express";

import { penggunaUserRouter } from "./user";

export const penggunaRouter = Router();
export const headTitle = "Pengguna";
const navActive = [1, 0];

penggunaRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
        lineChartArray: [],
        donutChartArray: [],
    });
});

penggunaRouter.use("/user", penggunaUserRouter);
