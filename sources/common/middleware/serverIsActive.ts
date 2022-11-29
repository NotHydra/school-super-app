import { NextFunction, Request, Response } from "express";
import { Indentitas } from "../../models";

export async function serverIsActive(req: Request, res: Response, next: NextFunction) {
    const indentitasObject = await Indentitas.findOne({ _id: 1 }).select("aktif").lean();

    if (indentitasObject != null) {
        if (indentitasObject.aktif) {
            next();
        } else if (!indentitasObject.aktif) {
            console.log("Server is deactivated");
            process.exit();
        }
    } else if (indentitasObject == null) {
        console.log("Server is deactivated");
        process.exit();
    }
}
