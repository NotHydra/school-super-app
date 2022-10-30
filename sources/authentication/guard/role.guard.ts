import { NextFunction, Request, Response } from "express";

import { app } from "../..";

const roleObject: any = {
    user: 1,
    operator: 2,
    admin: 3,
    superadmin: 4,
};

export function roleConvert(role: string): number {
    return roleObject[role];
}

export function roleCheck(role: string, minimumLevel: number): boolean {
    return roleConvert(role) >= minimumLevel ? true : false;
}

export function roleGuard(minimumLevel: any) {
    return function (req: Request, res: Response, next: NextFunction) {
        const isValid: boolean = roleCheck(app.locals.userObject.role, minimumLevel);

        if (isValid) {
            next();
        } else if (!isValid) {
            res.redirect("/");
        }
    };
}
