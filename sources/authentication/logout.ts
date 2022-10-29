import { Router } from "express";

import { isAuthenticated } from "../common/middleware/isAuthenticated";

export const authenticationLogoutRouter = Router();

authenticationLogoutRouter.use(isAuthenticated);

authenticationLogoutRouter.route("/").get(async (req, res) => {
    req.session.userId = undefined;
    req.session.userType = undefined;

    req.session.save(() => {
        req.session.regenerate(() => {
            res.redirect("/login?type=logout&response=success");
        });
    });
});
