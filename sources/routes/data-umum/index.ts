import { Router } from "express";

export const dataUmumRouter = Router();
export const headTitle = "Data Umum";
const navActive = [6, 0];

dataUmumRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [],
    });
});
