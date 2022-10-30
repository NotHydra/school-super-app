import { Router } from "express";

import { roleGuard } from "../../authentication/guard/role.guard";

import { penggunaUserRouter } from "./user";

export const penggunaRouter = Router();
export const headTitle = "Pengguna";
const navActive = [2, 1];

penggunaRouter.get("/", roleGuard(4), async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
        lineChartArray: [],
        donutChartArray: [],
    });
});

penggunaRouter.use("/user", penggunaUserRouter);
