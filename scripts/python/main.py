import json

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
    class DataUmum:
        tempatLahirArray = Utility.readJSON(
            "scripts/json/dependency/data-umum/tempat_lahir.json"
        )

        jenisKelaminArray = Utility.readJSON(
            "scripts/json/dependency/data-umum/jenis_kelamin.json"
        )


class DataUmum:
    def main():
        DataUmum.tempatLahir()
        DataUmum.jenisKelamin()

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


class Main:
    DataUmum.main()
