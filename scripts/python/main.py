import json
import random
import time

from datetime import datetime


class Dependency:
    def readJSON(path):
        return json.load(open(path))

    tempatLahirArray = readJSON("scripts/json/dependency/tempat_lahir.json")
    jenisKelaminArray = readJSON("scripts/json/dependency/jenis_kelamin.json")
    tahunMasukArray = readJSON("scripts/json/dependency/tahun_masuk.json")
    tingkatArray = readJSON("scripts/json/dependency/tingkat.json")
    jurusanArray = readJSON("scripts/json/dependency/jurusan.json")
    rombelArray = readJSON("scripts/json/dependency/rombel.json")
    nameArray = readJSON("scripts/json/dependency/name.json")


class Utility:
    nisnObject = {}
    tahunMasukToTingkat = {2020: "XII", 2021: "XI", 2022: "X"}

    def readJSON(path):
        return json.load(open(path))

    def writeJSON(path, data):
        with open(path, "w") as outfile:
            outfile.write(json.dumps(data, indent=4))

    def randomNISN(start, end):
        enrollmentNumber = str(random.randint(start, end))

        newEnrollmentNumber = True
        for nisKey in Utility.nisnObject.items():
            if enrollmentNumber == nisKey[0]:
                newEnrollmentNumber = False

        if newEnrollmentNumber:
            Utility.nisnObject[enrollmentNumber] = 1

        elif not newEnrollmentNumber:
            Utility.nisnObject[enrollmentNumber] += 1

        idkNumber = str(719)
        countNumber = str(Utility.nisnObject[enrollmentNumber]).zfill(3)

        nis = int(enrollmentNumber + idkNumber + countNumber)

        return nis

    def randomTempatLahir():
        return (random.choice(Utility.tempatLahirArray))["_id"]

    def randomBirthDate(start, end):
        timeFormat = "%Y/%m/%d"

        stime = time.mktime(time.strptime(start, timeFormat))
        etime = time.mktime(time.strptime(end, timeFormat))

        ptime = stime + random.random() * (etime - stime)

        return time.strftime(timeFormat, time.localtime(ptime))

    def randomJenisKelamin():
        return (random.choice(Utility.jenisKelaminArray))["_id"]

    def randomTahunMasuk():
        return (random.choice(Utility.tahunMasukArray))["_id"]

    def randomTingkat():
        return (random.choice(Utility.tingkatArray))["_id"]

    def randomJurusan():
        return (random.choice(Utility.jurusanArray))["_id"]

    def randomRombel():
        return (random.choice(Utility.rombelArray))["_id"]

    def dateToUnix(date):
        return str(int(datetime.strptime(date, "%Y/%m/%d").timestamp()) * 1000)

    def currentDate():
        return str(int(datetime.today().timestamp()) * 1000)

    tempatLahirArray = readJSON("scripts/json/tempat_lahir.json")
    jenisKelaminArray = readJSON("scripts/json/jenis_kelamin.json")
    tahunMasukArray = readJSON("scripts/json/tahun_masuk.json")
    tingkatArray = readJSON("scripts/json/tingkat.json")
    jurusanArray = readJSON("scripts/json/jurusan.json")
    rombelArray = readJSON("scripts/json/rombel.json")


class Main:
    def main():
        Main.tempatLahir()
        Main.jenisKelamin()
        Main.tahunMasuk()
        Main.tingkat()
        Main.jurusan()
        Main.rombel()
        Main.siswa()

    def tempatLahir():
        tempatLahirArray = []
        for tempatLahirIndex, tempatLahir in enumerate(Dependency.tempatLahirArray):
            tempatLahirObject = {
                "_id": tempatLahirIndex + 1,
                "tempat_lahir": tempatLahir,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            tempatLahirArray.append(tempatLahirObject)

        Utility.writeJSON("scripts/json/tempat_lahir.json", tempatLahirArray)

    def jenisKelamin():
        jenisKelaminArray = []
        for jenisKelaminIndex, jenisKelamin in enumerate(Dependency.jenisKelaminArray):
            jenisKelaminObject = {
                "_id": jenisKelaminIndex + 1,
                "jenis_kelamin": jenisKelamin,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            jenisKelaminArray.append(jenisKelaminObject)

        Utility.writeJSON("scripts/json/jenis_kelamin.json", jenisKelaminArray)

    def tahunMasuk():
        tahunMasukArray = []
        for tahunMasukIndex, tahunMasuk in enumerate(Dependency.tahunMasukArray):
            tahunMasukObject = {
                "_id": tahunMasukIndex + 1,
                "tahun_masuk": tahunMasuk,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            tahunMasukArray.append(tahunMasukObject)

        Utility.writeJSON("scripts/json/tahun_masuk.json", tahunMasukArray)

    def tingkat():
        tingkatArray = []
        for tingkatIndex, tingkat in enumerate(Dependency.tingkatArray):
            tingkatObject = {
                "_id": tingkatIndex + 1,
                "tingkat": tingkat,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            tingkatArray.append(tingkatObject)

        Utility.writeJSON("scripts/json/tingkat.json", tingkatArray)

    def jurusan():
        jurusanArray = []
        for jurusanIndex, jurusan in enumerate(Dependency.jurusanArray):
            jurusanObject = {
                "_id": jurusanIndex + 1,
                "jurusan": jurusan,
                "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
            }

            jurusanArray.append(jurusanObject)

        Utility.writeJSON("scripts/json/jurusan.json", jurusanArray)

    def rombel():
        rombelArray = []
        rombelCount = 0
        for tingkat in Dependency.tingkatArray:
            for rombel in Dependency.rombelArray:
                rombelObject = {
                    "_id": rombelCount + 1,
                    "rombel": f"{tingkat} {rombel}",
                    "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                    "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
                }

                rombelCount += 1

                rombelArray.append(rombelObject)

        Utility.writeJSON("scripts/json/rombel.json", rombelArray)

    def siswa():
        siswaArray = []
        siswaCount = 0
        for tahunMasuk in Utility.tahunMasukArray:
            tahunMasukValue = tahunMasuk["tahun_masuk"]
            tahunMasuk2Digit = int(str(tahunMasukValue)[-2:])
            birthDateStart = f"{2004 - 20 + tahunMasuk2Digit}/01/01"
            birthDateEnd = f"{2006 - 20 + tahunMasuk2Digit}/12/31"

            tingkatValue = Utility.tahunMasukToTingkat[tahunMasukValue]

            for tingkatObject in Utility.tingkatArray:
                if tingkatObject["tingkat"] in tingkatValue:
                    tingkat = tingkatObject

            for rombel in Dependency.rombelArray:
                namaUniqueArray = random.sample(
                    Dependency.nameArray, k=random.randint(1, 1)
                )

                for jurusanObject in Utility.jurusanArray:
                    if jurusanObject["jurusan"] in rombel:
                        jurusan = jurusanObject

                for rombelObject in Utility.rombelArray:
                    if rombelObject["rombel"] in f"{tingkat['tingkat']} {rombel}":
                        rombelValue = rombelObject

                for namaUnique in namaUniqueArray:
                    siswaObject = {
                        "_id": siswaCount + 1,
                        "nisn": Utility.randomNISN(tahunMasuk2Digit, tahunMasuk2Digit),
                        "nama_lengkap": namaUnique,
                        "id_tempat_lahir": Utility.randomTempatLahir(),
                        "tanggal_lahir": {
                            "$date": {
                                "$numberLong": Utility.dateToUnix(
                                    Utility.randomBirthDate(
                                        birthDateStart, birthDateEnd
                                    )
                                )
                            }
                        },
                        "id_jenis_kelamin": Utility.randomJenisKelamin(),
                        "id_tahun_masuk": tahunMasuk["_id"],
                        "id_tingkat": tingkat["_id"],
                        "id_jurusan": jurusan["_id"],
                        "id_rombel": rombelValue["_id"],
                        "dibuat": {"$date": {"$numberLong": Utility.currentDate()}},
                        "diubah": {"$date": {"$numberLong": Utility.currentDate()}},
                    }

                    siswaCount += 1

                    siswaArray.append(siswaObject)

        Utility.writeJSON("scripts/json/siswa.json", siswaArray)


Main.main()
