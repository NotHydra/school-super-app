import { Router } from "express";

import { authenticationLoginRouter } from "./login";

export const authenticationRouter = Router();

authenticationRouter.use("/login", authenticationLoginRouter);
