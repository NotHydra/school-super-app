import { Router } from "express";

import { authenticationLoginRouter } from "./login";
import { authenticationLoginSiswaRouter } from "./login-siswa";
import { authenticationRegisterRouter } from "./register";
import { authenticationLogoutRouter } from "./logout";

export const authenticationRouter = Router();

authenticationRouter.use("/login", authenticationLoginRouter);
authenticationRouter.use("/login-siswa", authenticationLoginSiswaRouter);
authenticationRouter.use("/register", authenticationRegisterRouter);
authenticationRouter.use("/logout", authenticationLogoutRouter);
