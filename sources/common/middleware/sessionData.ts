import { NextFunction, Request, Response } from "express";

import { app } from "../..";

import { userArray } from "../../authentication/login";

export function sessionData(req: Request, res: Response, next: NextFunction) {
    const userObject = userArray.find((userObject) => {
        if (userObject._id == req.session.userId) {
            return userObject;
        }
    });

    app.locals.userObject = userObject;

    next();
}
