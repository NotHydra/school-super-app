import "dotenv/config";
import { pageItemType } from "./typings/types/nav-item";

export const mongoDBURI: string = process.env.MONGO_DB_URI as string;
export const sessionSecret: string = process.env.SESSION_SECRET as string;

export const pageItemArray: pageItemType[] = [
    {
        id: 1,
        title: "Dashboard",
        icon: "gauge",
        level: 1,
        child: [
            {
                id: 1,
                title: "Utama",
                link: "",
                icon: "circle",
                level: 3,
                confirm: false,
            },
            {
                id: 2,
                title: "Data Pribadi",
                link: "data-pribadi",
                icon: "circle-user",
                level: 1,
                confirm: false,
            },
        ],
    },
    {
        id: 2,
        title: "Pengguna",
        icon: "users",
        level: 3,
        child: [
            {
                id: 1,
                title: "Utama",
                link: "pengguna",
                icon: "circle",
                level: 4,
                confirm: false,
            },
            {
                id: 2,
                title: "User",
                link: "pengguna/user",
                icon: "user",
                level: 3,
                confirm: false,
            },
            {
                id: 3,
                title: "Aktivitas",
                link: "pengguna/aktivitas",
                icon: "eye",
                level: 4,
                confirm: false,
            },
        ],
    },
    {
        id: 3,
        title: "Pengajar",
        icon: "chalkboard-user",
        level: 2,
        child: [
            {
                id: 1,
                title: "Utama",
                link: "pengajar",
                icon: "circle",
                level: 2,
                confirm: false,
            },
            {
                id: 2,
                title: "Guru",
                link: "pengajar/guru",
                icon: "user-tie",
                level: 2,
                confirm: false,
            },
            {
                id: 3,
                title: "Jabatan",
                link: "pengajar/jabatan",
                icon: "tag",
                level: 2,
                confirm: false,
            },
        ],
    },
    {
        id: 4,
        title: "Pelajar",
        icon: "address-card",
        level: 2,
        child: [
            {
                id: 1,
                title: "Utama",
                link: "pelajar",
                icon: "circle",
                level: 2,
                confirm: false,
            },
            {
                id: 2,
                title: "Siswa",
                link: "pelajar/siswa",
                icon: "user",
                level: 2,
                confirm: false,
            },
            {
                id: 3,
                title: "Tahun Masuk",
                link: "pelajar/tahun-masuk",
                icon: "calendar-days",
                level: 2,
                confirm: false,
            },
        ],
    },
    {
        id: 5,
        title: "Lulusan",
        icon: "graduation-cap",
        level: 2,
        child: [
            {
                id: 1,
                title: "Utama",
                link: "lulusan",
                icon: "circle",
                level: 2,
                confirm: false,
            },
            {
                id: 2,
                title: "Alumni",
                link: "lulusan/alumni",
                icon: "user-graduate",
                level: 2,
                confirm: false,
            },
            {
                id: 3,
                title: "Tahun Lulus",
                link: "lulusan/tahun-lulus",
                icon: "calendar-days",
                level: 2,
                confirm: false,
            },
        ],
    },
    {
        id: 6,
        title: "Penilaian",
        icon: "pen-nib",
        level: 2,
        child: [
            {
                id: 1,
                title: "Utama",
                link: "penilaian",
                icon: "circle",
                level: 2,
                confirm: false,
            },
            {
                id: 2,
                title: "Raport (WIP)",
                link: "penilaian/raport",
                icon: "address-book",
                level: 2,
                confirm: false,
            },
            {
                id: 3,
                title: "Mata Pelajaran",
                link: "penilaian/mata-pelajaran",
                icon: "book-bookmark",
                level: 2,
                confirm: false,
            },
            {
                id: 4,
                title: "Kehadiran (WIP)",
                link: "penilaian/kehadiran",
                icon: "clipboard",
                level: 2,
                confirm: false,
            },
            {
                id: 5,
                title: "Pelanggaran (WIP)",
                link: "penilaian/pelanggaran",
                icon: "circle-exclamation",
                level: 2,
                confirm: false,
            },
        ],
    },
    {
        id: 7,
        title: "Instansi",
        icon: "building",
        level: 2,
        child: [
            {
                id: 1,
                title: "Utama",
                link: "instansi",
                icon: "circle",
                level: 2,
                confirm: false,
            },
            {
                id: 2,
                title: "Rombel",
                link: "instansi/rombel",
                icon: "archway",
                level: 2,
                confirm: false,
            },
            {
                id: 3,
                title: "Tingkat",
                link: "instansi/tingkat",
                icon: "layer-group",
                level: 2,
                confirm: false,
            },
            {
                id: 4,
                title: "Jurusan",
                link: "instansi/jurusan",
                icon: "wrench",
                level: 2,
                confirm: false,
            },
            {
                id: 5,
                title: "Tahun Rombel",
                link: "instansi/tahun-rombel",
                icon: "calendar-days",
                level: 2,
                confirm: false,
            },
        ],
    },
    {
        id: 8,
        title: "Perpustakaan",
        icon: "book-open",
        level: 2,
        child: [
            {
                id: 1,
                title: "Utama",
                link: "perpustakaan",
                icon: "circle",
                level: 2,
                confirm: false,
            },
            {
                id: 2,
                title: "Anggota",
                link: "perpustakaan/anggota",
                icon: "user",
                level: 2,
                confirm: false,
            },
            {
                id: 3,
                title: "Petugas",
                link: "perpustakaan/petugas",
                icon: "user-tie",
                level: 2,
                confirm: false,
            },
            {
                id: 4,
                title: "Buku",
                link: "perpustakaan/buku",
                icon: "book",
                level: 2,
                confirm: false,
            },
            {
                id: 5,
                title: "Kategori",
                link: "perpustakaan/kategori",
                icon: "tag",
                level: 2,
                confirm: false,
            },
            {
                id: 6,
                title: "Penulis",
                link: "perpustakaan/penulis",
                icon: "pen-nib",
                level: 2,
                confirm: false,
            },
            {
                id: 7,
                title: "Penerbit",
                link: "perpustakaan/penerbit",
                icon: "globe",
                level: 2,
                confirm: false,
            },
            {
                id: 8,
                title: "Peminjaman",
                link: "perpustakaan/peminjaman",
                icon: "list",
                level: 2,
                confirm: false,
            },
            {
                id: 9,
                title: "Pengembalian",
                link: "perpustakaan/pengembalian",
                icon: "list-check",
                level: 2,
                confirm: false,
            },
        ],
    },
    {
        id: 9,
        title: "Data Umum",
        icon: "globe",
        level: 2,
        child: [
            {
                id: 1,
                title: "Utama",
                link: "data-umum",
                icon: "circle",
                level: 2,
                confirm: false,
            },
            {
                id: 2,
                title: "Tempat Lahir",
                link: "data-umum/tempat-lahir",
                icon: "city",
                level: 2,
                confirm: false,
            },
            {
                id: 3,
                title: "Jenis Kelamin",
                link: "data-umum/jenis-kelamin",
                icon: "venus-mars",
                level: 2,
                confirm: false,
            },
            {
                id: 4,
                title: "Universitas",
                link: "data-umum/universitas",
                icon: "school",
                level: 2,
                confirm: false,
            },
            {
                id: 5,
                title: "Pendidikan",
                link: "data-umum/pendidikan",
                icon: "tag",
                level: 2,
                confirm: false,
            },
        ],
    },
    {
        id: 10,
        title: "Pengaturan",
        icon: "gear",
        level: 1,
        child: [
            {
                id: 1,
                title: "Logout",
                link: "logout",
                icon: "right-from-bracket",
                level: 1,
                confirm: true,
            },
        ],
    },
];
