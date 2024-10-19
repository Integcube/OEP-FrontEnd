export class Preinsurence{
    preInsuranceId:number;
    title:string;
    createdOn:Date; 
    createdBy:number;
    isDeleted:number; 
    techId:number; 
    constructor(reg){
        this.preInsuranceId=reg.preInsuranceId?reg.preInsuranceId:-1;
        this.title=reg.title?reg.title:"";
        this.techId=reg.techId?reg.techId:"";
    } 
}

export class PreInsurenceAction{
    preInsuranceActionId:number;
    preInsuranceId:number;
    title:string;
    evidenceType:string; 
    createdBy:number;
    guidelines:string; 
    additionalGuidelines:string; 
    constructor(reg){
        this.preInsuranceActionId=reg.preInsuranceActionId?reg.preInsuranceActionId:-1;
        this.preInsuranceId=reg.preInsuranceId?reg.preInsuranceId:-1;
        this.title=reg.title?reg.title:"";
        this.evidenceType=reg.evidenceType?reg.evidenceType:"";
        this.guidelines=reg.guidelines?reg.guidelines:"";
        this.additionalGuidelines=reg.additionalGuidelines?reg.additionalGuidelines:"";
    } 
}
















