import { NextFunction, Request, Response } from "express";

import { app } from "../..";

import { User } from "../../models";

export async function sessionData(req: Request, res: Response, next: NextFunction) {
    const userObject = (await User.find().lean()).find((itemObject) => {
        if (itemObject._id == req.session.userId) {
            return itemObject;
        }
    });

    app.locals.userObject = userObject;

    next();
}
