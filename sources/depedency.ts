import "dotenv/config";
import { navItemType } from "./typings/types/nav-item";

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
                title: "Utama",
                link: "buku-induk",
            },
            {
                id: 2,
                title: "Siswa",
                link: "buku-induk/siswa",
            },
            {
                id: 3,
                title: "Tempat Lahir",
                link: "buku-induk/tempat-lahir",
            },
            {
                id: 4,
                title: "Jenis Kelamin",
                link: "buku-induk/jenis-kelamin",
            },
            {
                id: 5,
                title: "Tahun Masuk",
                link: "buku-induk/tahun-masuk",
            },
            {
                id: 6,
                title: "Tingkat",
                link: "buku-induk/tingkat",
            },
            {
                id: 7,
                title: "Jurusan",
                link: "buku-induk/jurusan",
            },
            {
                id: 8,
                title: "Rombel",
                link: "buku-induk/rombel",
            },
        ],
    },
];
