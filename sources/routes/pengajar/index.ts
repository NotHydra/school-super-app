import { Router } from "express";

import { pengajarGuruRouter } from "./guru";
import { pengajarJabatanRouter } from "./jabatan";

export const pengajarRouter = Router();
export const headTitle = "Pengajar";
const navActive = [1, 0];

pengajarRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
    });
});

pengajarRouter.use("/guru", pengajarGuruRouter);
pengajarRouter.use("/jabatan", pengajarJabatanRouter);
