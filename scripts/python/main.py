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

        universitasArray = Utility.readJSON(
            "scripts/json/dependency/data-umum/universitas.json"
        )

        pendidikanArray = Utility.readJSON(
            "scripts/json/dependency/data-umum/pendidikan.json"
        )


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
    DataUmum.main()
