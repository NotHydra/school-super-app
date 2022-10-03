import { Router } from "express";

import { bukuIndukSiswaRouter } from "./siswa";

export const bukuIndukRouter = Router();
export const headTitle = "Buku Induk";
export const partialPath = "./../../..";
export const navActive = [1, 0];

bukuIndukRouter.use("/siswa", bukuIndukSiswaRouter);
