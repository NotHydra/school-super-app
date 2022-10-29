import { NextFunction, Request, Response } from "express";

import { app } from "../..";

import { Siswa, User } from "../../models";

export async function sessionData(req: Request, res: Response, next: NextFunction) {
    let userObject = null;

    if (req.session.userType == "user") {
        userObject = await User.findOne({ _id: req.session.userId }).lean();
    } else if (req.session.userType == "siswa") {
        userObject = await Siswa.findOne({ _id: req.session.userId }).lean();
    }

    if (userObject != null) {
        app.locals.userType = req.session.userType;
        app.locals.userObject = userObject;

        next();
    } else if (userObject == null) {
        res.redirect("/logout?type=exist");
    }
}
