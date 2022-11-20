import { NextFunction, Request, Response } from "express";

import { app } from "../..";

import { upperCaseFirst } from "../../utility";

import { Alumni, JenisKelamin, Keterangan, Pendidikan, Rombel, Siswa, TahunAjaran, TahunLulus, TahunMasuk, TempatLahir, Universitas, User } from "../../models";

export async function sessionData(req: Request, res: Response, next: NextFunction) {
    let userObject: any = null;

    if (req.session.userType == "user") {
        userObject = await User.findOne({ _id: req.session.userId }).lean();

        userObject.fullDisplay = userObject.nama_lengkap;
        userObject.usernameDisplay = userObject.username;
        userObject.roleDisplay = upperCaseFirst(userObject.role);
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

        userObject.fullDisplay = userObject.nama_lengkap;
        userObject.usernameDisplay = userObject.nama_lengkap;
        userObject.roleDisplay = "Siswa";

        userObject.role = "user";
        userObject.akses = ["data-pribadi"];
    } else if (req.session.userType == "alumni") {
        userObject = await Alumni.findOne({ _id: req.session.userId })
            .populate({
                path: "id_siswa",
                select: "nisn nama_lengkap id_rombel id_tahun_ajaran id_tahun_masuk aktif id_keterangan",
                populate: [
                    {
                        path: "id_rombel",
                        select: "rombel id_tahun_ajaran",
                        populate: [{ path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran }],
                        model: Rombel,
                    },
                    { path: "id_tahun_ajaran", select: "tahun_ajaran", model: TahunAjaran },
                    { path: "id_tahun_masuk", select: "tahun_masuk", model: TahunMasuk },
                    { path: "id_keterangan", select: "keterangan", model: Keterangan },
                ],
                model: Siswa,
            })
            .populate({
                path: "id_tahun_lulus",
                select: "tahun_lulus",
                model: TahunLulus,
            })
            .populate({
                path: "id_universitas",
                select: "universitas",
                model: Universitas,
            })
            .populate({
                path: "id_pendidikan",
                select: "pendidikan singkatan",
                model: Pendidikan,
            })
            .lean();

        userObject.fullDisplay = userObject.id_siswa.nama_lengkap;
        userObject.usernameDisplay = userObject.id_siswa.nama_lengkap;
        userObject.roleDisplay = "Alumni";

        userObject.role = "user";
        userObject.akses = ["data-pribadi"];
    }

    if (userObject != null) {
        app.locals.userType = req.session.userType;
        app.locals.userObject = userObject;

        next();
    } else if (userObject == null) {
        res.redirect("/logout?type=exist");
    }
}
