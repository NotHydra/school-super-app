import express, { Express } from "express";
import session from "express-session";
import mongoose from "mongoose";

import { mongoDBURI, pageItemArray, sessionSecret } from "./depedency";
import { findPageItem, findPageItemChild, localMoment, upperCaseFirst, zeroPad } from "./utility";
import { isAuthenticated } from "./common/middleware/isAuthenticated";
import { isActive } from "./common/middleware/isActive";
import { sessionData } from "./common/middleware/sessionData";
import { roleCheck, roleGuard } from "./authentication/guard/role.guard";

import { authenticationRouter } from "./authentication";
import { dashboardRouter } from "./routes/dashboard";
import { penggunaRouter } from "./routes/pengguna";
import { pengajarRouter } from "./routes/pengajar";
import { pelajarRouter } from "./routes/pelajar";
import { lulusanRouter } from "./routes/lulusan";
import { penilaianRouter } from "./routes/penilaian";
import { instansiRouter } from "./routes/instansi";
import { perpustakaanRouter } from "./routes/perpustakaan";
import { dataUmumRouter } from "./routes/data-umum";

declare module "express-session" {
    interface Session {
        userId: number;
        userType: string;
    }
}

export const app: Express = express();
const port: number = 3000;

app.locals.roleCheck = roleCheck;
app.locals.moment = localMoment;
app.locals.pageItemArray = pageItemArray;
app.locals.findPageItem = findPageItem;
app.locals.findPageItemChild = findPageItemChild;
app.locals.zeroPad = zeroPad;
app.locals.upperCaseFirst = upperCaseFirst;

app.set("view engine", "ejs");
app.set("views", "sources/views");
app.use(express.static("sources/public"));
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 3600000 },
    })
);

app.use(authenticationRouter);

app.use(isAuthenticated);
app.use(isActive);
app.use(sessionData);

app.use("/", roleGuard(1), dashboardRouter);

app.use("/pengajar", roleGuard(2), pengajarRouter);
app.use("/pelajar", roleGuard(2), pelajarRouter);
app.use("/lulusan", roleGuard(2), lulusanRouter);
app.use("/penilaian", roleGuard(2), penilaianRouter);
app.use("/instansi", roleGuard(2), instansiRouter);
app.use("/perpustakaan", roleGuard(2), perpustakaanRouter);
app.use("/data-umum", roleGuard(2), dataUmumRouter);

app.use("/pengguna", roleGuard(3), penggunaRouter);

mongoose.connect(mongoDBURI, () => {
    console.log("Connected to database");

    app.listen(port, async () => {
        console.log(`Listening on http://localhost:${port}`);
    });
});
