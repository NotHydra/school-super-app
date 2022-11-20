import { NextFunction, Request, Response } from "express";
import { User } from "../../models";

export async function isActive(req: Request, res: Response, next: NextFunction) {
    if (req.session.userType == "user") {
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
    } else if (["siswa", "alumni"].includes(req.session.userType)) {
        next();
    }
}
