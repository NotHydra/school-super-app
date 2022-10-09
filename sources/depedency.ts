import "dotenv/config";
import { pageItemType } from "./typings/types/nav-item";

export const mongoDBURI: string = process.env.MONGO_DB_URI as string;

export const pageItemArray: pageItemType[] = [
    {
        id: 1,
        title: "Dashboard",
        icon: "gauge",
        child: [
            {
                id: 1,
                title: "Utama",
                link: "",
                icon: "circle",
            },
        ],
    },
    {
        id: 2,
        title: "Pengajar",
        icon: "chalkboard-user",
        child: [
            {
                id: 1,
                title: "Utama",
                link: "pengajar",
                icon: "circle",
            },
            {
                id: 2,
                title: "Guru",
                link: "pengajar/guru",
                icon: "user-tie",
            },
            {
                id: 3,
                title: "Jabatan",
                link: "pengajar/jabatan",
                icon: "tag",
            },
        ],
    },
    {
        id: 3,
        title: "Pelajar",
        icon: "address-card",
        child: [
            {
                id: 1,
                title: "Utama",
                link: "pelajar",
                icon: "circle",
            },
            {
                id: 2,
                title: "Siswa",
                link: "pelajar/siswa",
                icon: "user",
            },
            {
                id: 3,
                title: "Tahun Masuk",
                link: "pelajar/tahun-masuk",
                icon: "calendar-days",
            },
        ],
    },
    {
        id: 4,
        title: "Lulusan",
        icon: "graduation-cap",
        child: [
            {
                id: 1,
                title: "Utama",
                link: "lulusan",
                icon: "circle",
            },
            {
                id: 2,
                title: "Alumni",
                link: "lulusan/alumni",
                icon: "user-graduate",
            },
            {
                id: 3,
                title: "Tahun Lulus",
                link: "lulusan/tahun-lulus",
                icon: "calendar-days",
            },
        ],
    },
    {
        id: 5,
        title: "Penilaian",
        icon: "pen-nib",
        child: [
            {
                id: 1,
                title: "Utama",
                link: "penilaian",
                icon: "circle",
            },
            {
                id: 2,
                title: "Raport (WIP)",
                link: "penilaian/raport",
                icon: "address-book",
            },
            {
                id: 3,
                title: "Mata Pelajaran",
                link: "penilaian/mata-pelajaran",
                icon: "book-bookmark",
            },
            {
                id: 4,
                title: "Kehadiran (WIP)",
                link: "penilaian/kehadiran",
                icon: "clipboard",
            },
            {
                id: 5,
                title: "Pelanggaran (WIP)",
                link: "penilaian/pelanggaran",
                icon: "circle-exclamation",
            },
        ],
    },
    {
        id: 6,
        title: "Instansi",
        icon: "building",
        child: [
            {
                id: 1,
                title: "Utama",
                link: "instansi",
                icon: "circle",
            },
            {
                id: 2,
                title: "Rombel (WIP)",
                link: "instansi/rombel",
                icon: "archway",
            },
            {
                id: 3,
                title: "Tingkat",
                link: "instansi/tingkat",
                icon: "layer-group",
            },
            {
                id: 4,
                title: "Jurusan",
                link: "instansi/jurusan",
                icon: "wrench",
            },
            {
                id: 5,
                title: "Tahun Rombel",
                link: "instansi/tahun-rombel",
                icon: "calendar-days",
            },
        ],
    },
    {
        id: 7,
        title: "Data Umum",
        icon: "globe",
        child: [
            {
                id: 1,
                title: "Utama",
                link: "data-umum",
                icon: "circle",
            },
            {
                id: 2,
                title: "Tempat Lahir",
                link: "data-umum/tempat-lahir",
                icon: "city",
            },
            {
                id: 3,
                title: "Jenis Kelamin",
                link: "data-umum/jenis-kelamin",
                icon: "venus-mars",
            },
            {
                id: 4,
                title: "Universitas",
                link: "data-umum/universitas",
                icon: "school",
            },
            {
                id: 5,
                title: "Pendidikan",
                link: "data-umum/pendidikan",
                icon: "tag",
            },
        ],
    },
];
