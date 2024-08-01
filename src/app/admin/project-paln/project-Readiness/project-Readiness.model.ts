export class ProjectReadiness{
    planId:number;
    title:string;
    createdOn:Date; 
    createdBy:number;
    isDeleted:number; 
    assignTo:number; 
    siteId: number; 
    constructor(reg){
        this.planId=reg.planId?reg.planId:-1;
        this.title=reg.title?reg.title:"";
        this.assignTo=reg.assignTo?reg.assignTo:-1;
        this.siteId=reg.siteId?reg.siteId:-1;
    } 
}


export class ProjectReadinessPhase{
    title:string;
    weightage:number;
    planId:number;
    phaseId:number; 
    createdBy:number;
    displayOrder:number
    constructor(reg:any){
     
        this.planId=reg.planId?reg.planId:-1;
        this.title=reg.title?reg.title:"";
        this.weightage=reg.weightage?reg.weightage:"";
        this.phaseId=reg.phaseId?reg.phaseId:-1;
        this.displayOrder=reg.displayOrder?reg.displayOrder:"";
        
    } 
}



export class ProjectReadinessTask{
    taskId:number;
    title:string;
    planId:number;
    phaseId:number; 
    createdBy:number;
    idealScore:number;
    actualScore:number;
    responsibility:number;
    targetdate:Date;
    remarks:string;
    constructor(reg:any){
        this.taskId=reg.taskId?reg.taskId:-1;
        this.planId=reg.planId?reg.planId:-1;
        this.title=reg.title?reg.title:"";
        this.phaseId=reg.phaseId?reg.phaseId:"";
        this.idealScore=reg.idealScore?reg.idealScore:"";
        this.actualScore=reg.actualScore?reg.actualScore:"";
        this.responsibility=reg.responsibility?reg.responsibility:-1;
        this.targetdate=reg.targetdate?reg.targetdate:null;
        this.remarks=reg.remarks?reg.remarks:"";
    } 
}

export class ReadinessInfo
{
    planId:number;
    siteId:number;
    startDate:Date;
    site:string;
    plan:string;
    region:string;
    cluster:string;
    Weightage:number;
    TotalIdealScore:number;

    constructor(reg:any){
  
    } 

}



export class DocInfo{
    Date:Date;
    siteId:number;
    type:number;
    taskId:number;
    constructor(reg) {
        this.Date = reg.startDate ? new Date(reg.startDate) : new Date();
        this.siteId = reg.siteId ? reg.siteId : -1;
        this.type = reg.type ? reg.type : -1;
        this.taskId = reg.taskId ? reg.taskId : -1;
    } 
}