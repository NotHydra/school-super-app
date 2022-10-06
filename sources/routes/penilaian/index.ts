import { Router } from "express";

export const penilaianRouter = Router();
export const headTitle = "Penilaian";
const navActive = [2, 0];

penilaianRouter.get("/", async (req, res) => {
    res.render("pages/index", {
        headTitle,
        navActive,
        cardItemArray: [
            {
                id: 1,
                cardItemChild: [],
            },
        ],
    });
});
