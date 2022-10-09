import json
import random
import time

from datetime import datetime, timedelta


class Utility:
    tingkatToTahunMasuk = {1: 5, 2: 4, 3: 3}
    tingkatToSemesterCount = {"X": 1, "XI": 3, "XII": 5}

    def readJSON(path):
        return json.load(open(path))

    def writeJSON(path, data):
        with open(path, "w") as outfile:
            outfile.write(json.dumps(data, indent=4))

    def currentDate():
        return str(int(datetime.today().timestamp()) * 1000)

    def dateToUnix(date):
        return str(int(datetime.strptime(date, "%Y/%m/%d").timestamp()) * 1000)


class Dependency:
    class Pengajar:
        jabatanArray = Utility.readJSON("scripts/json/dependency/pengajar/jabatan.json")

    class Pelajar:
        tahunMasukArray = Utility.readJSON(
            "scripts/json/dependency/pelajar/tahun_masuk.json"
        )

    class Lulusan:
        tahunLulusArray = Utility.readJSON(
            "scripts/json/dependency/lulusan/tahun_lulus.json"
        )

    class Penilaian:
        mataPelajaranArray = Utility.readJSON(
            "scripts/json/dependency/penilaian/mata_pelajaran.json"
        )

    class Instansi:
        rombelArray = Utility.readJSON("scripts/json/dependency/instansi/rombel.json")
        tingkatArray = Utility.readJSON("scripts/json/dependency/instansi/tingkat.json")
        jurusanArray = Utility.readJSON("scripts/json/dependency/instansi/jurusan.json")
        tahunRombelArray = Utility.readJSON(
            "scripts/json/dependency/instansi/tahun_rombel.json"
        )

    class DataUmum:
        tempatLahirArray = Utility.readJSON(
            "scripts/json/dependency/data-umum/tempat_lahir.json"
        )

        jenisKelaminArray = Utility.readJSON(
            "scripts/json/dependency/data-umum/jenis_kelamin.json"
        )

        universitasArray = Utility.readJSON(
            "scripts/json/dependency/data-umum/universitas.json"
        )

        pendidikanArray = Utility.readJSON(
            "scripts/json/dependency/data-umum/pendidikan.json"
        )

    namaArray = Utility.readJSON("scripts/json/dependency/nama.json")

    tempatLahirArray = Utility.readJSON("scripts/json/data-umum/tempat_lahir.json")
    jenisKelaminArray = Utility.readJSON("scripts/json/data-umum/jenis_kelamin.json")
    jabatanArray = Utility.readJSON("scripts/json/pengajar/jabatan.json")
    universitasArray = Utility.readJSON("scripts/json/data-umum/universitas.json")
    pendidikanArray = Utility.readJSON("scripts/json/data-umum/pendidikan.json")

    guruArray = Utility.readJSON("scripts/json/pengajar/guru.json")

    mataPelajaranArray = Utility.readJSON("scripts/json/penilaian/mata_pelajaran.json")

    tingkatArray = Utility.readJSON("scripts/json/instansi/tingkat.json")
    jurusanArray = Utility.readJSON("scripts/json/instansi/jurusan.json")


class Random:
    nipCount = 0

    def nip(tanggalLahir: str, jenisKelamin: int):
        Random.nipCount += 1

        return f"{tanggalLahir.replace('/', '')} {datetime.strftime(datetime.strptime(tanggalLahir, '%Y/%m/%d') + timedelta(days=random.randint(6935, 7602)), '%Y%m')} {jenisKelamin} {str(Random.nipCount).zfill(3)}"

    def tempatLahir():
        return random.choice(Dependency.tempatLahirArray)["_id"]

    def tanggalLahir(start, end):
        timeFormat = "%Y/%m/%d"

        stime = time.mktime(time.strptime(start, timeFormat))
        etime = time.mktime(time.strptime(end, timeFormat))

        ptime = stime + random.random() * (etime - stime)

        return time.strftime(timeFormat, time.localtime(ptime))

    def jenisKelamin():
        return random.choice(Dependency.jenisKelaminArray)["_id"]

    def jabatan():
        return random.choice(Dependency.jabatanArray)["_id"]

    def universitas():
        return random.choice(Dependency.universitasArray)["_id"]

    def pendidikan():
        return random.choice(Dependency.pendidikanArray)["_id"]

    def nomorTelepon():
        phoneNumberLength = random.randint(11, 13) - 2

        phoneNumber = "08" + str(random.randint(0, int("9" * phoneNumberLength))).zfill(
            phoneNumberLength
        )

        return phoneNumber


class Pengajar:
    def main():
        Pengajar.guru()
        Pengajar.jabatan()

    def guru():
        guruArray = []
        for namaIndex, nama in enumerate(random.sample(Dependency.namaArray, k=45)):
            tanggalLahir = Random.tanggalLahir("1970/01/02", "2000/12/31")
            jenisKelamin = Random.jenisKelamin()

            guruObject = {
                "_id": namaIndex + 1,
                "nip": Random.nip(tanggalLahir, jenisKelamin),
                "nama_lengkap": nama,
                "id_tempat_lahir": Random.tempatLahir(),
                "tanggal_lahir": {
                    "$date": {"$numberLong": Utility.dateToUnix(tanggalLahir)}
                },
                "id_jenis_kelamin": jenisKelamin,
                "id_jabatan": Random.jabatan(),
                "id_universitas": Random.universitas(),
                "id_pendidikan": Random.pendidikan(),
                "nomor_telepon": Random.nomorTelepon(),
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            guruArray.append(guruObject)

        Utility.writeJSON("scripts/json/pengajar/guru.json", guruArray)

    def jabatan():
        jabatanArray = []
        for jabatanIndex, jabatan in enumerate(Dependency.Pengajar.jabatanArray):
            jabatanObject = {
                "_id": jabatanIndex + 1,
                "jabatan": jabatan,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            jabatanArray.append(jabatanObject)

        Utility.writeJSON("scripts/json/pengajar/jabatan.json", jabatanArray)


class Pelajar:
    def main():
        Pelajar.tahunMasuk()

    def tahunMasuk():
        tahunMasukArray = []
        for tahunMasukIndex, tahunMasuk in enumerate(
            Dependency.Pelajar.tahunMasukArray
        ):
            tahunMasukObject = {
                "_id": tahunMasukIndex + 1,
                "tahun_masuk": tahunMasuk,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            tahunMasukArray.append(tahunMasukObject)

        Utility.writeJSON("scripts/json/pelajar/tahun_masuk.json", tahunMasukArray)


class Lulusan:
    def main():
        Lulusan.tahunLulus()

    def tahunLulus():
        tahunLulusArray = []
        for tahunLulusIndex, tahunLulus in enumerate(
            Dependency.Lulusan.tahunLulusArray
        ):
            tahunLulusObject = {
                "_id": tahunLulusIndex + 1,
                "tahun_lulus": tahunLulus,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            tahunLulusArray.append(tahunLulusObject)

        Utility.writeJSON("scripts/json/lulusan/tahun_lulus.json", tahunLulusArray)


class Penilaian:
    def main():
        Penilaian.mataPelajaran()

    def mataPelajaran():
        mataPelajaranArray = []
        for mataPelajaranIndex, mataPelajaran in enumerate(
            Dependency.Penilaian.mataPelajaranArray
        ):
            randomBobot = random.randint(4, 6) * 10

            mataPelajaranObject = {
                "_id": mataPelajaranIndex + 1,
                "mata_pelajaran": mataPelajaran,
                "bobot_pengetahuan": randomBobot,
                "bobot_keterampilan": 100 - randomBobot,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            mataPelajaranArray.append(mataPelajaranObject)

        Utility.writeJSON(
            "scripts/json/penilaian/mata_pelajaran.json", mataPelajaranArray
        )


class Instansi:
    def main():
        Instansi.rombel()
        Instansi.tingkat()
        Instansi.jurusan()
        Instansi.tahunRombel()

    def rombel():
        rombelArray = []
        rombelCount = 0

        randomWaliKelas = random.sample(
            Dependency.guruArray,
            k=(len(Dependency.tingkatArray) * len(Dependency.Instansi.rombelArray)),
        )

        for tingkat in Dependency.tingkatArray:
            for rombel in Dependency.Instansi.rombelArray:

                validJurusan = None
                for jurusan in Dependency.jurusanArray:
                    if jurusan["jurusan"] in rombel:
                        validJurusan = jurusan["_id"]

                mataPelajaranSample = random.sample(
                    Dependency.mataPelajaranArray, k=random.randint(9, 11)
                )

                guruSample = random.sample(Dependency.guruArray, k=len(mataPelajaranSample))

                semesterArray = []
                for i in range(Utility.tingkatToSemesterCount[tingkat["tingkat"]]):

                    mataPelajaranArray = []
                    for mataPelajaranIndex, mataPelajaran in enumerate(
                        mataPelajaranSample
                    ):
                        mataPelajaranObject = {
                            "_id": mataPelajaranIndex + 1,
                            "id_mata_pelajaran": mataPelajaran["_id"],
                            "id_guru": guruSample[mataPelajaranIndex]["_id"]
                        }

                        mataPelajaranArray.append(mataPelajaranObject)

                    semesterObject = {
                        "_id": i + 1,
                        "semester": i + 1,
                        "mata_pelajaran": mataPelajaranArray,
                    }

                    semesterArray.append(semesterObject)

                rombelObject = {
                    "_id": rombelCount + 1,
                    "rombel": f"{tingkat['tingkat']} {rombel}",
                    "id_wali_kelas": randomWaliKelas[rombelCount]["_id"],
                    "id_tingkat": tingkat["_id"],
                    "id_jurusan": validJurusan,
                    "id_tahun_rombel": Utility.tingkatToTahunMasuk[tingkat["_id"]],
                    "semester": semesterArray,
                    "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                    "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
                }

                rombelCount += 1

                rombelArray.append(rombelObject)

        Utility.writeJSON("scripts/json/instansi/rombel.json", rombelArray)

    def tingkat():
        tingkatArray = []
        for tingkatIndex, tingkat in enumerate(Dependency.Instansi.tingkatArray):
            tingkatObject = {
                "_id": tingkatIndex + 1,
                "tingkat": tingkat,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            tingkatArray.append(tingkatObject)

        Utility.writeJSON("scripts/json/instansi/tingkat.json", tingkatArray)

    def jurusan():
        jurusanArray = []
        for jurusanIndex, jurusan in enumerate(Dependency.Instansi.jurusanArray):
            jurusanObject = {
                "_id": jurusanIndex + 1,
                "jurusan": jurusan,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            jurusanArray.append(jurusanObject)

        Utility.writeJSON("scripts/json/instansi/jurusan.json", jurusanArray)

    def tahunRombel():
        tahunRombelArray = []
        for tahunRombelIndex, tahunRombel in enumerate(
            Dependency.Instansi.tahunRombelArray
        ):
            tahunRombelObject = {
                "_id": tahunRombelIndex + 1,
                "tahun_rombel": tahunRombel,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            tahunRombelArray.append(tahunRombelObject)

        Utility.writeJSON("scripts/json/instansi/tahun_rombel.json", tahunRombelArray)


class DataUmum:
    def main():
        DataUmum.tempatLahir()
        DataUmum.jenisKelamin()
        DataUmum.universitas()
        DataUmum.pendidikan()

    def tempatLahir():
        tempatLahirArray = []
        for tempatLahirIndex, tempatLahir in enumerate(
            Dependency.DataUmum.tempatLahirArray
        ):
            tempatLahirObject = {
                "_id": tempatLahirIndex + 1,
                "tempat_lahir": tempatLahir,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            tempatLahirArray.append(tempatLahirObject)

        Utility.writeJSON("scripts/json/data-umum/tempat_lahir.json", tempatLahirArray)

    def jenisKelamin():
        jenisKelaminArray = []
        for jenisKelaminIndex, jenisKelamin in enumerate(
            Dependency.DataUmum.jenisKelaminArray
        ):
            jenisKelaminObject = {
                "_id": jenisKelaminIndex + 1,
                "jenis_kelamin": jenisKelamin,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            jenisKelaminArray.append(jenisKelaminObject)

        Utility.writeJSON(
            "scripts/json/data-umum/jenis_kelamin.json", jenisKelaminArray
        )

    def universitas():
        universitasArray = []
        for universitasIndex, universitas in enumerate(
            Dependency.DataUmum.universitasArray
        ):
            universitasObject = {
                "_id": universitasIndex + 1,
                "universitas": universitas,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            universitasArray.append(universitasObject)

        Utility.writeJSON("scripts/json/data-umum/universitas.json", universitasArray)

    def pendidikan():
        pendidikanArray = []
        for pendidikanIndex, pendidikan in enumerate(
            Dependency.DataUmum.pendidikanArray
        ):
            pendidikanObject = {
                "_id": pendidikanIndex + 1,
                "pendidikan": pendidikan[1],
                "singkatan": pendidikan[0],
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            pendidikanArray.append(pendidikanObject)

        Utility.writeJSON("scripts/json/data-umum/pendidikan.json", pendidikanArray)


class Main:
    def main():
        Pengajar.main()
        Pelajar.main()
        Lulusan.main()
        Penilaian.main()
        Instansi.main()
        DataUmum.main()


Main.main()
