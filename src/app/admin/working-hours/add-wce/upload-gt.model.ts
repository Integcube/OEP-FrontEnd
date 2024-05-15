export interface UploadGt {
    regionId: number,
    regionTitle: string,
    siteId: number,
    siteTitle: string,
    unitTitle: string,
    unitId: number;
    endOfContract: Date;
    startingHours: Date;
}

export interface MonthlyHoursGt {
    monthlyHourId: number;
    monthId: number;
    yearId: number;
    runningHour: number;
    wce_runningHour: number;
    unitId:number
}