import json
import random

from datetime import datetime


class Utility:
    def readJSON(path):
        return json.load(open(path))

    def writeJSON(path, data):
        with open(path, "w") as outfile:
            outfile.write(json.dumps(data, indent=4))

    def currentDate():
        return str(int(datetime.today().timestamp()) * 1000)


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


class Pengajar:
    def main():
        Pengajar.jabatan()

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
        Instansi.tingkat()
        Instansi.jurusan()
        Instansi.tahunRombel()

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
