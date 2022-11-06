import { NextFunction, Request, Response } from "express";

import { app } from "../..";

import { JenisKelamin, Keterangan, Rombel, Siswa, TahunAjaran, TahunMasuk, TempatLahir, User } from "../../models";

export async function sessionData(req: Request, res: Response, next: NextFunction) {
    let userObject: any = null;

    if (req.session.userType == "user") {
        userObject = await User.findOne({ _id: req.session.userId }).lean();
    } else if (req.session.userType == "siswa") {
        userObject = await Siswa.findOne({ _id: req.session.userId })
            .populate({ path: "id_tempat_lahir", select: "tempat_lahir", model: TempatLahir })
            .populate({ path: "id_jenis_kelamin", select: "jenis_kelamin", model: JenisKelamin })
            .populate({ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran })
            .populate({ path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk })
            .populate({
                path: "id_rombel",
                select: "rombel id_tahun_ajaran",
                populate: [{ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran }],
                model: Rombel,
            })
            .populate({ path: "id_keterangan", select: "keterangan", model: Keterangan })
            .lean();

        userObject.role = "user";
    }

    if (userObject != null) {
        app.locals.userType = req.session.userType;
        app.locals.userObject = userObject;

        next();
    } else if (userObject == null) {
        res.redirect("/logout?type=exist");
    }
}
