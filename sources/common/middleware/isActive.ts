import { NextFunction, Request, Response } from "express";
import { User } from "../../models";

export async function isActive(req: Request, res: Response, next: NextFunction) {
    const userObject = await User.findOne({ _id: req.session.userId }).select("aktif").lean();

    if (userObject != null) {
        if (userObject.aktif) {
            next();
        } else if (!userObject.aktif) {
            res.redirect("/logout?type=active");
        }
    } else if (userObject == null) {
        res.redirect("/logout?type=exist");
    }
}
