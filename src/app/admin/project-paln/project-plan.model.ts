export class ProjectPlan{
    planId:number;
    title:string;
    createdOn:Date; 
    createdBy:number;
    description:string;
    isDeleted:number; 
    projectphase:ProjectPhase[];
    pmId:number; 
    startDate:Date; 
    siteId: number; 
    startplanId:Number;
    constructor(reg){
        this.planId=reg.planId?reg.planId:-1;
        this.startplanId=reg.startplanId?reg.startplanId:-1;
        
    } 
}

export class StartPlanInfo
{
    planId:number;
    siteId:number;
    startDate:Date;
    site:string;
    plan:string;
    region:string;
    cluster:string;
    id:number;
    constructor(reg:any){
        this.id=reg.id?reg.id:-1;
        this.planId=reg.planId?reg.planId:-1;
        this.siteId=reg.siteId?reg.siteId:-1;
        this.startDate=reg.startDate? new Date(reg.startDate) : new Date();
        this.plan=reg.plan?reg.plan:"";
        this.region=reg.region?reg.region:"";
        this.cluster=reg.cluster?reg.cluster:"";
        this.site=reg.site?reg.site:"";
        
    } 

}


export class ProjectPlanPhase{
    title:string;
    weightage:number;
    planId:number;
    phaseId:number; 
    createdBy:number;
    duration:number;
    displayOrder:number
    constructor(reg:any){
        this.planId=reg.planId?reg.planId:"";
        this.title=reg.title?reg.title:"";
        this.weightage=reg.weightage?reg.weightage:"";
        this.duration=reg.duration?reg.duration:"";
        this.phaseId=reg.phaseId?reg.phaseId:-1;
        this.displayOrder=reg.displayOrder?reg.displayOrder:0;
 
    } 


}

export class ProjectPhase{
    phaseId:number;
    title:string;
}

export class ProjectPlanTaskVm{
    taskId:number;
    title:string;
    duration:number; 
    weightage:number;
    planId:number;
    phaseId:number; 
    phaseTitle:number; 
    taskParentId:number;
    taskParentTitle:number;
    createdOn:Date;
    createdBy:number;
    constructor(reg:any){
        this.taskId=reg.taskId?reg.taskId:-1;
        this.planId=reg.planId?reg.planId:-1;
    } 
}


export class ProjectPlanMainTask{
    taskId:number;
    title:string;
     weightage:number;
    planId:number;
    phaseId:number; 
    createdBy:number;
    duration:number;
    predecessorId:number;
    lagDays: number;
    idealScore:number;
    code:string;
    predecessorType:number;
    durationUnit:number;
    lagUnit:number;
    displayOrder:number;
    constructor(reg:any){
        this.taskId=reg.taskId?reg.taskId:-1;
        this.planId=reg.planId?reg.planId:-1;
        this.title=reg.title?reg.title:"";
        this.weightage=reg.weightage?reg.weightage:"";
        this.duration=reg.duration?reg.duration:"";
        this.phaseId=reg.phaseId?reg.phaseId:"";
        this.predecessorId=reg.predecessorId?reg.predecessorId:-1;
        this.lagDays=reg.lagDays?reg.lagDays:0;
        this.idealScore=reg.idealScore?reg.idealScore:"";
        this.code=reg.code?reg.code:"";
        this.predecessorType=reg.predecessorType?reg.predecessorType:1;
        this.durationUnit=reg.durationUnit?reg.durationUnit:1;
        this.lagUnit=reg.lagUnit?reg.lagUnit:1;
        this.displayOrder=reg.displayOrder?reg.displayOrder:1;
        
    } 
}
export class ProjectPlanSubTask{
    taskId:number;
    title:string;
    duration:number;
    planId:number;
    phaseId:number; 
    mainTaskId:number; 
    createdBy:number;
    mainTaskTitle:string;
    predecessorId:number;
    lagDays: number;
    idealScore:number;
    code:string;
    predecessorType:number;
    durationUnit:number;
    lagUnit:number;
    constructor(reg:any){
        this.taskId=reg.taskId?reg.taskId:-1;
        this.planId=reg.planId?reg.planId:-1;
        this.mainTaskId=reg.mainTaskId?reg.mainTaskId:-1;
        this.phaseId=reg.phaseId?reg.phaseId:-1;
        this.mainTaskTitle=reg.mainTaskTitle?reg.mainTaskTitle:"";
        this.taskId=reg.taskId?reg.taskId:-1;
        this.title=reg.title?reg.title:"";
        this.duration=reg.duration?reg.duration:"";
        this.predecessorId=reg.predecessorId?reg.predecessorId:-1;
        this.lagDays=reg.lagDays?reg.lagDays:0;
        this.idealScore=reg.idealScore?reg.idealScore:"";
        this.code=reg.code?reg.code:"";
        this.predecessorType=reg.predecessorType?reg.predecessorType:1;
        this.durationUnit=reg.durationUnit?reg.durationUnit:1;
        this.lagUnit=reg.lagUnit?reg.lagUnit:1;
    } 
}


export class StartPlan{
    startDate:Date;
    endDate:Date;
    siteId:number;
    pmId:number;
    planId:number;
    id:number;
    constructor(reg) {
        this.planId = reg.planId ? reg.planId : 1;
        this.startDate = reg.startDate ? new Date(reg.startDate) : new Date();
        this.endDate = reg.endDate ? new Date(reg.endDate) : new Date();
        this.siteId = reg.siteId ? reg.siteId : -1;
        this.pmId = reg.pmId ? reg.pmId : -1;
        this.id = reg.id ? reg.id : -1;
    } 
}


export class KeyIssueFilters{
    Date:Date;
    siteId:number;
    id:number;
    hsseIssues:string;
    technicalIssues:string;
    recruitmentIssues:string;
    financialcommercial:string;
    userId:number;
    roschecklistprogress:string;
    technicalriskregister:string;
    lessonslearned:string;
    previousactioncall:string;
    receiveddocument:number;
    revieweddocument:number;
    constructor(reg) {
        this.Date = reg.startDate ? new Date(reg.startDate) : new Date();
        this.siteId = reg.siteId ? reg.siteId : -1;
        this.id = reg.id ? reg.id : -1;
        this.hsseIssues = reg.hsseIssues ? reg.hsseIssues : "";
        this.technicalIssues = reg.technicalIssues ? reg.technicalIssues : "";
        this.recruitmentIssues = reg.recruitmentIssues ? reg.recruitmentIssues : "";
        this.financialcommercial = reg.financialcommercial ? reg.financialcommercial : "";
        this.userId = reg.userId ? reg.userId : -1;
        this.roschecklistprogress = reg.roschecklistprogress ? reg.roschecklistprogress : "";
        this.technicalriskregister = reg.technicalriskregister ? reg.technicalriskregister : "";
        this.lessonslearned = reg.lessonslearned ? reg.lessonslearned : "";
        this.previousactioncall = reg.previousactioncall ? reg.previousactioncall : "";
        this.receiveddocument = reg.receiveddocument ? reg.receiveddocument :0;
        this.revieweddocument = reg.revieweddocument ? reg.revieweddocument : 0;

    } 
}


export class DocInfo{
    Date:Date;
    siteId:number;
    type:number;
    constructor(reg) {
        this.Date = reg.startDate ? new Date(reg.startDate) : new Date();
        this.siteId = reg.siteId ? reg.siteId : -1;
        this.type = reg.type ? reg.type : -1;

    } 
}

