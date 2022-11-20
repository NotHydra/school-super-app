import { NextFunction, Request, Response } from "express";
import { User } from "../../models";

const pathActionArray = ["/update-password", "/update-lulus", "/active", "/status", "/access", "/create", "/update", "/delete"];

export async function isAccessible(req: Request, res: Response, next: NextFunction) {
    if (req.session.userType == "user") {
        if (!req.originalUrl.includes("dist") && !req.originalUrl.includes("plugins") && !req.originalUrl.includes("css")) {
            const userObject: any = await User.findOne({ _id: req.session.userId }).select("akses").lean();

            if (userObject != null) {
                if (userObject.akses.length >= 1) {
                    let path = req.path;

                    if (path.charAt(0) == "/") {
                        path = path.slice(1);
                    }

                    if (path.charAt(path.length - 1) == "/") {
                        path = path.slice(0, -1);
                    }

                    pathActionArray.forEach((pathActionObject) => {
                        path = path.replace(pathActionObject, "");
                    });

                    if (userObject.akses.includes(path)) {
                        next();
                    } else if (!userObject.akses.includes(path)) {
                        res.redirect(`/${userObject.akses[0]}`);
                    }
                } else if (userObject.akses.length < 1) {
                    res.redirect("/logout?type=access");
                }
            } else if (userObject == null) {
                res.redirect("/logout?type=exist");
            }
        } else if (!(!req.originalUrl.includes("dist") && !req.originalUrl.includes("plugins") && !req.originalUrl.includes("css"))) {
            next();
        }
    } else if (["siswa", "alumni"].includes(req.session.userType)) {
        next();
    }
}
