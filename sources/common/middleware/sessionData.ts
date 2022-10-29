import { NextFunction, Request, Response } from "express";

import { app } from "../..";

import { User } from "../../models";

export async function sessionData(req: Request, res: Response, next: NextFunction) {
    const userObject = await User.findOne({ _id: req.session.userId }).lean();

    if (userObject != null) {
        app.locals.userObject = userObject;

        next();
    } else if (userObject == null) {
        res.redirect("/logout?type=exist");
    }
}
