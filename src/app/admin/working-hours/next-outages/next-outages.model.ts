export interface WH_ProposedOutageFilter{
    regionId:number;
    siteId:number;
    equipmentId:number;
    outageId:number
}

export class OT_SiteNextOutage {
    snoId: number;
    siteId: number;
    regionId:number;
    regionTitle:string;
    siteTitle: string;
    equipmentId: number;
    unit: string;
    outageId: number;
    outageTitle: string;
    nextOutageDate: string;
    nextOutageEndDate:Date;
    runningHours:number;
    wceHours:number;
    outageDurationInDays:number;
    clusterId:number;
    clusterTitle:string;
    actualStartDate:Date;
    actualEndDate:Date;
    constructor(reg) {
        this.snoId = reg.snoId ? reg.snoId : -1;
    }
}