import express, { Router } from "express";

import { MataPelajaran, Raport, Rombel, TahunMasuk } from "../../models";

import { headTitle } from ".";

export const penilaianRaportRouter = Router();
const navActive = [2, 1];

penilaianRaportRouter.use(express.static("sources/public"));
penilaianRaportRouter.use(express.urlencoded({ extended: false }));

penilaianRaportRouter.route("/").get(async (req, res) => {
    let tableItemArray: any = await Raport.find()
        .populate({
            path: "id_siswa",
            select: "nama_lengkap id_rombel id_tahun_masuk",
            populate: [
                { path: "id_rombel", select: "rombel" },
                { path: "id_tahun_masuk", select: "tahun_masuk" },
            ],
        })
        .sort({ jenis_kelamin: 1 });

    const rombelValue = req.query.rombel;

    if (rombelValue != undefined && rombelValue != "semua") {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            return tableItemObject.id_siswa.id_rombel._id == rombelValue;
        });
    }

    const tahunMasukValue = req.query.tahunMasuk;

    if (tahunMasukValue != undefined && tahunMasukValue != "semua") {
        tableItemArray = tableItemArray.filter((tableItemObject: any) => {
            return tableItemObject.id_siswa.id_tahun_masuk._id == tahunMasukValue;
        });
    }

    const mataPelajaranArray = await MataPelajaran.find().select("mata_pelajaran bobot_pengetahuan bobot_keterampilan");

    tableItemArray = tableItemArray.map((tableItemObject: any) => {
        const scoreSemesterArray: any = [];
        tableItemObject.semester = tableItemObject.semester.map((tableItemSemesterObject: any) => {
            const scoreMataPelajaranArray: number[] = [];
            tableItemSemesterObject.mata_pelajaran = tableItemSemesterObject.mata_pelajaran.map((tableItemMataPelajaranObject: any) => {
                const idMataPelajaran = tableItemMataPelajaranObject.id_mata_pelajaran;
                const pengetahuan = tableItemMataPelajaranObject.pengetahuan;
                const keterampilan = tableItemMataPelajaranObject.keterampilan;

                const mataPelajaran: any = mataPelajaranArray.find((mataPelajaranObject) => {
                    return mataPelajaranObject._id == idMataPelajaran;
                });

                const scoreMataPelajaran = Math.round(
                    (mataPelajaran.bobot_pengetahuan / 100) * pengetahuan + (mataPelajaran.bobot_keterampilan / 100) * keterampilan
                );

                scoreMataPelajaranArray.push(scoreMataPelajaran);

                return {
                    ...tableItemMataPelajaranObject,
                    mata_pelajaran: mataPelajaran.mata_pelajaran,
                    score_mata_pelajaran: scoreMataPelajaran,
                };
            });

            let scoreSemesterTotal = 0;
            scoreMataPelajaranArray.forEach((scoreMataPelajaranValue) => {
                scoreSemesterTotal += scoreMataPelajaranValue;
            });

            const scoreSemester = Math.round(scoreSemesterTotal / scoreMataPelajaranArray.length);

            scoreSemesterArray.push(scoreSemester);

            return {
                ...tableItemSemesterObject,
                total_semester: scoreSemesterTotal,
                score_semester: scoreSemester,
            };
        });

        let scoreRaportTotal: number = 0;
        scoreSemesterArray.forEach((scoreSemesterValue: number) => {
            scoreRaportTotal += scoreSemesterValue;
        });

        const scoreRaport = Math.round(scoreRaportTotal / scoreSemesterArray.length);

        return { ...tableItemObject.toObject(), total_raport: scoreRaportTotal, score_raport: scoreRaport };
    });

    res.render("pages/penilaian/raport/table", {
        headTitle,
        navActive,
        toastResponse: req.query.response,
        toastTitle: req.query.response == "success" ? "Data Berhasil Dihapus" : "Data Gagal Dihapus",
        toastText: req.query.text,
        cardItemArray: [
            // {
            //     id: 1,
            //     cardItemChild: [
            //         {
            //             id: 1,
            //             title: "Jenis Kelamin",
            //             icon: "venus-mars",
            //             value: await JenisKelamin.countDocuments(),
            //         },
            //         {
            //             id: 2,
            //             title: "Dibuat",
            //             icon: "circle-plus",
            //             value: (await JenisKelamin.findOne().sort({ dibuat: -1 })).jenis_kelamin,
            //         },
            //         {
            //             id: 3,
            //             title: "Diupdate",
            //             icon: "circle-exclamation",
            //             value: (await JenisKelamin.findOne().sort({ diubah: -1 })).jenis_kelamin,
            //         },
            //     ],
            // },
        ],
        tableItemArray,
        rombelValue,
        rombelArray: await Rombel.find(),
        tahunMasukValue,
        tahunMasukArray: await TahunMasuk.find(),
    });
});
