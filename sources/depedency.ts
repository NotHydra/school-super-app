import "dotenv/config";
import { navItemType } from "./typings/types/navItem";

export const mongoDBURI: string = process.env.MONGO_DB_URI as string;

export const navItemArray: navItemType[] = [
    {
        id: 1,
        title: "Dashboard",
        icon: "gauge",
        child: [
            {
                id: 1,
                title: "Utama",
                link: "",
            },
        ],
    },
    {
        id: 2,
        title: "Buku Induk",
        icon: "address-card",
        child: [
            {
                id: 1,
                title: "Siswa",
                link: "buku-induk/siswa",
            },
            {
                id: 2,
                title: "Tempat Lahir",
                link: "buku-induk/tempat-lahir",
            },
            {
                id: 3,
                title: "Jenis Kelamin",
                link: "buku-induk/jenis-kelamin",
            },
            {
                id: 4,
                title: "Tahun Masuk",
                link: "buku-induk/tahun-masuk",
            },
            {
                id: 5,
                title: "Tingkat",
                link: "buku-induk/tingkat",
            },
            {
                id: 6,
                title: "Jurusan",
                link: "buku-induk/jurusan",
            },
            {
                id: 7,
                title: "Rombel",
                link: "buku-induk/rombel",
            },
        ],
    },
];
