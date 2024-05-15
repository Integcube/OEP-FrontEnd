export interface APITimeline {
    timeline: GroupedHoursItems[]
    outages: GroupedOutagesItems[]
}
//Dont remove before testing
// export interface WH_TimelapseModel {
//     equipmentId: number
//     unit:string
//     yearData: WH_timelapseYear[]
// }
export interface WH_TimelapseModel {
    startHour: number
    startHoursWce: number
    equipmentId: number
    unit: string
    eqType: string
    startDate: Date
    yearData: WH_timelapseYear[]
    yearWCE: WH_timelapseYear[]
}
export class WH_timelapseYear {
    yearlyTotal: number
    outages: WH_timelapseOutage[]
    yearId: number
    constructor(reg) {
        this.yearlyTotal = reg.yearlyTotal ? reg.yearlyTotal : null
        this.yearId = reg.yearId ? reg.yearId : null
        this.outages = reg.outages ? reg.outages : []

    }
}
export interface WH_timelapseOutage {

    outageTitle: string
    outageCode: string
}
export interface GroupedHours {
    equipmentId,
    Items: GroupedHoursItems[]
}
export interface WH_Timeline {
    regionId: number;
    siteId: number;
    equipmentId: number;
    clusterId: number
}
export interface GroupedHoursItems {
    siteId,
    equipmentId,
    unit,
    startDate,
    startHours,
    yearId,
    runningHour,
    monthId,
    onmContractExpiry,
    startHoursWce,
    wceRunningHour,
    eqType,
}
export interface GroupedOutges {
    equipmentId,
    Items: GroupedOutagesItems[]
}
export interface GroupedOutagesItems {
    siteId
    equipmentId
    unit
    outageId
    outageTitle
    runningHours
    nextOutageDate
    colorCode
    counter: number
    counterWce: number
    validate: string
    validateWce: string
    wceHours
}
