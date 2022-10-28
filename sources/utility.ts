import moment from "moment";
import fs from "fs";

export const localMoment = moment;
localMoment.locale("id");

export function readJSON(path: string) {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
}

export async function datasetYear(model: any, currentYear: number): Promise<any> {
    const currentYearValue = await model.countDocuments({ dibuat: { $gte: new Date(currentYear, 0, 0), $lte: new Date(currentYear, 12, 31) } }).lean();
    const lastYearValue = await model.countDocuments({ dibuat: { $gte: new Date(currentYear - 1, 0, 0), $lte: new Date(currentYear - 1, 12, 31) } }).lean();
    const percentageIncrease = (currentYearValue / (lastYearValue == 0 ? 1 : lastYearValue)) * 100;

    const dataset = [
        {
            id: 1,
            label: "Jan",
            current: 0,
            last: 0,
        },
        {
            id: 2,
            label: "Feb",
            current: 0,
            last: 0,
        },
        {
            id: 3,
            label: "Mar",
            current: 0,
            last: 0,
        },
        {
            id: 4,
            label: "Apr",
            current: 0,
            last: 0,
        },
        {
            id: 5,
            label: "Mei",
            current: 0,
            last: 0,
        },
        {
            id: 6,
            label: "Jun",
            current: 0,
            last: 0,
        },
        {
            id: 7,
            label: "Jul",
            current: 0,
            last: 0,
        },

        {
            id: 8,
            label: "Agt",
            current: 0,
            last: 0,
        },
        {
            id: 9,
            label: "Sep",
            current: 0,
            last: 0,
        },
        {
            id: 10,
            label: "Okt",
            current: 0,
            last: 0,
        },
        {
            id: 11,
            label: "Nov",
            current: 0,
            last: 0,
        },
        {
            id: 12,
            label: "Des",
            current: 0,
            last: 0,
        },
    ];

    const currentYearArray = await model.find({ dibuat: { $gte: new Date(currentYear, 0, 0), $lte: new Date(currentYear, 12, 31) } }).lean();
    const lastYearArray = await model.find({ dibuat: { $gte: new Date(currentYear - 1, 0, 0), $lte: new Date(currentYear - 1, 12, 31) } }).lean();

    currentYearArray.forEach((itemObject: any) => {
        dataset.find((datasetObject) => {
            if (localMoment(itemObject.dibuat).format("MMM") == datasetObject.label) {
                datasetObject.current += 1;
            }
        });
    });

    lastYearArray.forEach((itemObject: any) => {
        dataset.find((datasetObject) => {
            if (localMoment(itemObject.dibuat).format("MMM") == datasetObject.label) {
                datasetObject.last += 1;
            }
        });
    });

    return { currentYearValue, percentageIncrease, dataset };
}

export function blueColorPattern(current: number, total: number): string {
    return `rgb(${(current / total) * 255 - 255}, ${(current / total) * 255}, 255)`;
}

export function zeroPad(number: number, zero: number): string {
    return String(number).padStart(zero, "0");
}
