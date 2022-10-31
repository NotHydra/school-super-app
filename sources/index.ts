import express, { Express } from "express";
import session from "express-session";
import mongoose from "mongoose";

import { mongoDBURI, pageItemArray, sessionSecret } from "./depedency";
import { findPageItem, findPageItemChild, localMoment, upperCaseFirst, zeroPad } from "./utility";

import { roleCheck, roleGuard } from "./authentication/guard/role.guard";
import { isAuthenticated } from "./common/middleware/isAuthenticated";
import { isActive } from "./common/middleware/isActive";
import { sessionData } from "./common/middleware/sessionData";
import { requestCounter } from "./common/middleware/requestCounter";

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

app.locals.moment = localMoment;
app.locals.pageItemArray = pageItemArray;

app.locals.roleCheck = roleCheck;
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
app.use(requestCounter);

app.use(roleGuard(1));
app.use("/", dashboardRouter);

app.use(roleGuard(2));
app.use("/pengajar", pengajarRouter);
app.use("/pelajar", pelajarRouter);
app.use("/lulusan", lulusanRouter);
app.use("/penilaian", penilaianRouter);
app.use("/instansi", instansiRouter);
app.use("/perpustakaan", perpustakaanRouter);
app.use("/data-umum", dataUmumRouter);

app.use(roleGuard(3));
app.use("/pengguna", penggunaRouter);

app.use((req, res) => {
    res.redirect("/");
});

mongoose.connect(mongoDBURI, () => {
    console.log("Connected to database");

    app.listen(port, async () => {
        console.log(`Listening on http://localhost:${port}`);
    });
});
