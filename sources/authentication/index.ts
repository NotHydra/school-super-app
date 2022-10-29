import { Router } from "express";

import { authenticationLoginRouter } from "./login";
import { authenticationLoginSiswaRouter } from "./login-siswa";
import { authenticationLogoutRouter } from "./logout";

export const authenticationRouter = Router();

authenticationRouter.use("/login", authenticationLoginRouter);
authenticationRouter.use("/login-siswa", authenticationLoginSiswaRouter);
authenticationRouter.use("/logout", authenticationLogoutRouter);
