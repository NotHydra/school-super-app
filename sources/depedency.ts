import { navItemType } from "./typings/types/navItem";

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
                id: 1,
                title: "Tempat Lahir",
                link: "buku-induk/tempat-lahir",
            },
            {
                id: 1,
                title: "Jenis Kelamin",
                link: "buku-induk/jenis-kelamin",
            },
            {
                id: 1,
                title: "Tahun Masuk",
                link: "buku-induk/tahun-masuk",
            },
            {
                id: 1,
                title: "Tingkat",
                link: "buku-induk/tingkat",
            },
            {
                id: 1,
                title: "Jurusan",
                link: "buku-induk/jurusan",
            },
            {
                id: 1,
                title: "Rombel",
                link: "buku-induk/rombel",
            },
        ],
    },
];
