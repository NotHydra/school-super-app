import express, { Express } from "express";
import session from "express-session";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import path from "path";

import { mongoDBURI, pageItemArray, sessionSecret } from "./depedency";
import { findPageItem, findPageItemChild, localMoment, upperCaseFirst, userAccessAll, zeroPad } from "./utility";

import { roleCheck, roleConvert, roleGuard } from "./authentication/guard/role.guard";
import { isAuthenticated } from "./common/middleware/isAuthenticated";
import { isActive } from "./common/middleware/isActive";
import { isAccessible } from "./common/middleware/isAccessible";
import { sessionData } from "./common/middleware/sessionData";
import { requestCounter } from "./common/middleware/requestCounter";

import { authenticationRouter } from "./authentication";
import { utamaRouter } from "./routes/utama";
import { penggunaRouter } from "./routes/pengguna";
import { sekolahRouter } from "./routes/sekolah";
import { instansiRouter } from "./routes/instansi";
import { perpustakaanRouter } from "./routes/perpustakaan";
import { pengajarRouter } from "./routes/pengajar";
import { pelajarRouter } from "./routes/pelajar";
import { lulusanRouter } from "./routes/lulusan";
import { penilaianRouter } from "./routes/penilaian";
import { pelanggaranRouter } from "./routes/pelanggaran";
import { dataUmumRouter } from "./routes/data-umum";

import { Indentitas } from "./models";
import { serverIsActive } from "./common/middleware/serverIsActive";

declare module "express-session" {
    interface Session {
        userId: number;
        userType: string;
    }
}

export const app: Express = express();
const port: any = process.env.PORT || 3000;

app.locals.moment = localMoment;
app.locals.pageItemArray = pageItemArray;

app.locals.roleConvert = roleConvert;
app.locals.roleCheck = roleCheck;
app.locals.findPageItem = findPageItem;
app.locals.findPageItemChild = findPageItemChild;
app.locals.zeroPad = zeroPad;
app.locals.upperCaseFirst = upperCaseFirst;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 3600000 },
    })
);

app.use(serverIsActive);

app.use(authenticationRouter);

app.use(isAuthenticated);
app.use(isActive);
app.use(isAccessible);
app.use(sessionData);
app.use(requestCounter);

app.use(roleGuard(1));
app.use("/", utamaRouter);

app.use(roleGuard(2));
app.use("/sekolah", sekolahRouter);
app.use("/instansi", instansiRouter);
app.use("/perpustakaan", perpustakaanRouter);
app.use("/pengajar", pengajarRouter);
app.use("/pelajar", pelajarRouter);
app.use("/lulusan", lulusanRouter);
app.use("/penilaian", penilaianRouter);
app.use("/pelanggaran", pelanggaranRouter);
app.use("/data-umum", dataUmumRouter);

app.use(roleGuard(3));
app.use("/pengguna", penggunaRouter);

app.use(roleGuard(4));
app.use(require("express-status-monitor")());

app.use((req, res) => {
    res.redirect("/");
});

mongoose.connect(mongoDBURI, async () => {
    console.log("Connected to database");

    const indentitasObject = await Indentitas.findOne({ _id: 1 }).select("nama_aplikasi aktif").lean();

    if (indentitasObject != null) {
        if (indentitasObject.aktif) {
            app.locals.applicationName = indentitasObject.nama_aplikasi || "School Super App";
            app.listen(port, async () => {
                console.log(`Listening on http://localhost:${port}`);
            });
        } else if (!indentitasObject.aktif) {
            console.log("Server is deactivated");
            process.exit();
        }
    } else if (indentitasObject == null) {
        console.log("Server is deactivated");
        process.exit();
    }
});
