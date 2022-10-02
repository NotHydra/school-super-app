import { Router } from "express";

import { bukuIndukSiswaRouter } from "./siswa";

export const bukuIndukRouter = Router();
export const headTitle = "Buku Induk";
export const partialPath = "./../../..";

bukuIndukRouter.use("/siswa", bukuIndukSiswaRouter);
