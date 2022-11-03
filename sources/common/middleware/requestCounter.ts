import { NextFunction, Request, Response } from "express";

import { Aktivitas } from "../../models";

export async function requestCounter(req: Request, res: Response, next: NextFunction) {
    if (req.session.userType == "user") {
        res.on("finish", async () => {
            if (!req.originalUrl.includes("dist") && !req.originalUrl.includes("plugins") && !req.originalUrl.includes("css")) {
                const itemObject = new Aktivitas({
                    _id: (await Aktivitas.findOne().select("_id").sort({ _id: -1 }).lean())?._id + 1 || 1,

                    id_user: req.session.userId,
                    aktivitas: req.originalUrl,
                    method: req.method,

                    dibuat: new Date(),
                    diubah: new Date(),
                });

                try {
                    await itemObject.save();
                } catch (error: any) {}
            }
        });
    }

    next();
}
