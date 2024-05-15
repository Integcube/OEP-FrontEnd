import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { WorkingCalService } from '../working-cal/working-cal.service';
import { User } from 'src/app/core/models/user';
import { GroupedHoursItems, GroupedOutagesItems, WH_TimelapseModel, WH_Timeline, WH_timelapseOutage, WH_timelapseYear } from './timeline.model';
import { CCluster, CRegions, CSites } from 'src/app/shared/common-interface/common-interface';
import { WH_IEquipments, WH_Outages } from '../contract-outages/contract-outages.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.sass']
})
export class TimelineComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  //Filer
  filterObj: WH_Timeline = {
    regionId: -1,
    siteId: -1,
    equipmentId: -1,
    clusterId: -1
  }
  topLevel: WH_TimelapseModel = {
    equipmentId: null,
    yearData: [],
    unit: '',
    startHour: 0,
    startDate: null,
    yearWCE: [],
    startHoursWce: null,
    eqType: ''
  };
  yearList: any[] = [];
  innerLevel: WH_timelapseYear = {
    yearlyTotal: null,
    yearId: null,
    outages: []
  }; 
  innerLevel2: WH_timelapseYear = {
    yearlyTotal: null,
    yearId: null,
    outages: []
  };
  selectedSite: number;
  topLevelArr: WH_TimelapseModel[] = [];
  timeline: GroupedHoursItems[]
  outages: GroupedOutagesItems[]
  hours: any
  errorMessage: string;
  regions: CRegions[];
  sites: CSites[]
  nextOutages: WH_Outages[];
  equipments: WH_IEquipments[];
  cluster: CCluster[];
  //Get data from browsers Local Storage
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  constructor(private dataService: WorkingCalService, private dataService2: CommonService, private snackBar: MatSnackBar, public dialog: MatDialog) { super() }

  ngOnInit(): void {
    this.getRegions()
    this.getSites(-1)
    this.getCluster(-1)
    this.getEquipments(-1)
    this.getData()
  }
  getCluster(regionId: number) {
    this.subs.sink = this.dataService2.getClusters(-1, regionId, -1).subscribe({
      next: data => {
        this.filterObj.clusterId = -1
        this.cluster = [...data];
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
    })
  }
  getEquipments(siteId: number) {
    this.subs.sink = this.dataService.getEquipments(siteId).subscribe({
      next: data => {
        this.filterObj.equipmentId = -1
        this.equipments = [...data];
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
    })
  }
  getSite(regionId: number) {
    this.subs.sink = this.dataService2.getUpdatedSites(-1, regionId, -1, -1).subscribe({
      next: data => {
        this.filterObj.siteId = -1
        this.sites = [...data]
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') }
    })
  }
  getRegions() {
    this.subs.sink = this.dataService2.getUpdatedRegions(-1, -1, -1).subscribe({
      next: data => {
        this.regions = [...data];
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
    })
  }
  getSites(clusterId: number) {
    this.subs.sink = this.dataService2.getUpdatedSites(-1, -1, -1, clusterId).subscribe({
      next: data => {
        this.sites = [...data];
        this.selectedSite = this.sites[0].siteId;
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
    })
  }
  // getData() {
  //   this.subs.sink = this.dataService.getTimeLine(this.filterObj.regionId, this.filterObj.clusterId, this.filterObj.siteId, this.filterObj.equipmentId).subscribe({
  //     next: data => {
  //       this.timeline = [...data.timeline];
  //       this.outages = [...data.outages];
  //       const uniqueEquipments = [...new Set(this.timeline.map(item => item.equipmentId))]
  //       this.topLevelArr.length = 0;
  //       for (let a = 0; a < uniqueEquipments.length; a++) {
  //         let eqDetail: GroupedHoursItems = this.timeline.find(b => b.equipmentId == uniqueEquipments[a]);
  //         let equipmentTimelineList: GroupedHoursItems[] = this.timeline.filter(b => b.equipmentId == uniqueEquipments[a]);
  //         let equipmentOutages: GroupedOutagesItems[] = this.outages.filter(b => b.equipmentId == uniqueEquipments[a]);
  //         this.yearList.length = 0;
  //         this.topLevel.equipmentId = eqDetail.equipmentId;
  //         this.topLevel.unit = eqDetail.unit;
  //         this.topLevel.eqType = eqDetail.eqType;
  //         this.topLevel.startDate = eqDetail.startDate;
  //         this.topLevel.startHour = eqDetail.startHours;
  //         this.topLevel.startHoursWce = eqDetail.startHoursWce;
  //         let outageCounter = eqDetail.startHours;
  //         let hoursCounter = eqDetail.startHours;
  //         let wceOutageCounter = eqDetail.startHoursWce;
  //         let wceHoursCounter = eqDetail.startHoursWce;
  //         const differenceInYears: number = (new Date(eqDetail.onmContractExpiry)).getFullYear() - (new Date(eqDetail.startDate)).getFullYear();
  //         for (let za = 0; za < differenceInYears; za++) {
  //           let yearToAdd: number = (new Date(eqDetail.startDate)).getFullYear() + za + 1;
  //           this.yearList.push(yearToAdd);
  //         }
  //         for (let bb = 0; bb < this.yearList.length; bb++) {
  //           this.innerLevel2.yearId = this.yearList[bb];
  //           this.innerLevel.yearId = this.yearList[bb];
  //           for (let zz = 0; zz < equipmentTimelineList.length; zz++) {
  //             if (equipmentTimelineList[zz].yearId == this.yearList[bb]) {
  //               hoursCounter += equipmentTimelineList[zz].runningHour
  //               outageCounter += equipmentTimelineList[zz].runningHour
  //               wceOutageCounter += equipmentTimelineList[zz].wceRunningHour
  //               wceHoursCounter += equipmentTimelineList[zz].wceRunningHour
  //               for (let x = 0; x < equipmentOutages.length; x++){
  //                 if (equipmentOutages[x].counter == -1) {
  //                   equipmentOutages[x].counter += outageCounter
  //                 }
  //                 else {
  //                   equipmentOutages[x].counter += equipmentTimelineList[zz].runningHour
  //                 }
  //                 if (equipmentOutages[x].counterWce == -1) {
  //                   equipmentOutages[x].counterWce += wceOutageCounter
  //                 }
  //                 else {
  //                   equipmentOutages[x].counterWce += equipmentTimelineList[zz].wceRunningHour
  //                 }
  //                 let dateIdD = new Date(equipmentOutages[x].nextOutageDate)
  //                 let dateId = dateIdD.getFullYear();
  //                 if ((equipmentOutages[x].runningHours != null && equipmentOutages[x].runningHours <= equipmentOutages[x].counter && equipmentTimelineList[zz].monthId == 12) || (dateId == this.yearList[bb] && equipmentOutages[x].validate != "NoValidate" && equipmentTimelineList[zz].monthId == 12)) {
  //                   let varz: WH_timelapseOutage = {
  //                     outageTitle: equipmentOutages[x].outageTitle,
  //                     outageCode: equipmentOutages[x].colorCode,
  //                   }
  //                   this.innerLevel.outages.push({ ...varz });
  //                   if (dateId == this.yearList[bb]) {
  //                     equipmentOutages[x].validate = "NoValidate"

  //                   }
  //                   equipmentOutages[x].counter = 0
  //                 }
  //                 if ((equipmentOutages[x].wceHours != null && equipmentOutages[x].wceHours <= equipmentOutages[x].counterWce && equipmentTimelineList[zz].monthId == 12) || (dateId == this.yearList[bb] && equipmentOutages[x].validateWce != "NoValidate" && equipmentTimelineList[zz].monthId == 12)) {
  //                   let varz: WH_timelapseOutage = {
  //                     outageTitle: equipmentOutages[x].outageTitle,
  //                     outageCode: equipmentOutages[x].colorCode,
  //                   }
  //                   this.innerLevel2.outages.push({ ...varz });
  //                   if (dateId == this.yearList[bb]) {
  //                     equipmentOutages[x].validateWce = "NoValidate"

  //                   }
  //                   equipmentOutages[x].counterWce = 0
  //                 }
  //               }
  //             }
  //             this.innerLevel.yearlyTotal = hoursCounter;
  //                       this.innerLevel2.yearlyTotal = wceHoursCounter;
  //                       this.topLevel.yearData.push({ ...this.innerLevel })
  //                       this.topLevel.yearWCE.push({ ...this.innerLevel2 })
  //                       this.innerLevel.outages = [];
  //                       this.innerLevel.outages = [];

  //                       }
  //         }
  //     }
  //   },
  //     error: err => { this.showNotification('black', err, 'bottom', 'center') }

  //   })
  // }

  getData() {
    this.subs.sink = this.dataService.getTimeLine(this.filterObj.regionId, this.filterObj.clusterId, this.filterObj.siteId, this.filterObj.equipmentId).subscribe({
      next: data => {
        this.timeline = [...data.timeline];
        this.outages = [...data.outages];
        const uniqueEquipments = [...new Set(this.timeline.map(item => item.equipmentId))]
        this.topLevelArr.length = 0;
        for (let a = 0; a < uniqueEquipments.length; a++) {
          let eqDetail: GroupedHoursItems = this.timeline.find(b => b.equipmentId == uniqueEquipments[a]);
          let equipmentTimelineList: GroupedHoursItems[] = this.timeline.filter(b => b.equipmentId == uniqueEquipments[a]);
          let equipmentOutages: GroupedOutagesItems[] = this.outages.filter(b => b.equipmentId == uniqueEquipments[a]);
          this.yearList.length = 0;
          this.topLevel.equipmentId = eqDetail.equipmentId;
          this.topLevel.unit = eqDetail.unit;
          this.topLevel.eqType = eqDetail.eqType;
          this.topLevel.startDate = eqDetail.startDate;
          this.topLevel.startHour = eqDetail.startHours;
          this.topLevel.startHoursWce = eqDetail.startHoursWce;
          let outageCounter = eqDetail.startHours;
          let hoursCounter = eqDetail.startHours;
          let wceOutageCounter = eqDetail.startHoursWce;
          let wceHoursCounter = eqDetail.startHoursWce;
          const differenceInYears: number = (new Date(eqDetail.onmContractExpiry)).getFullYear() - (new Date(eqDetail.startDate)).getFullYear();
          for (let za = 0; za < differenceInYears; za++) {
            let yearToAdd: number = (new Date(eqDetail.startDate)).getFullYear() + za + 1;
            this.yearList.push(yearToAdd);
          }
          for (let bb = 0; bb < this.yearList.length; bb++) {
            this.innerLevel2.yearId = this.yearList[bb];
            this.innerLevel.yearId = this.yearList[bb];
            for (let zz = 0; zz < equipmentTimelineList.length; zz++) {
              if (equipmentTimelineList[zz].equipmentId == uniqueEquipments[a] && equipmentTimelineList[zz].yearId == this.yearList[bb]) {
                hoursCounter += equipmentTimelineList[zz].runningHour
                outageCounter += equipmentTimelineList[zz].runningHour
                wceOutageCounter += equipmentTimelineList[zz].wceRunningHour
                wceHoursCounter += equipmentTimelineList[zz].wceRunningHour
                for (let x = 0; x < equipmentOutages.length; x++) {
                  if (equipmentOutages[x].counter == -1) {
                    equipmentOutages[x].counter += outageCounter
                  }
                  else {
                    equipmentOutages[x].counter += equipmentTimelineList[zz].runningHour
                  }
                  if (equipmentOutages[x].counterWce == -1) {
                    equipmentOutages[x].counterWce += wceOutageCounter
                  }
                  else {
                    equipmentOutages[x].counterWce += equipmentTimelineList[zz].wceRunningHour
                  }
                  let dateIdD = new Date(equipmentOutages[x].nextOutageDate)
                  let dateId = dateIdD.getFullYear();
                  console.log(dateId);
                  if ((equipmentOutages[x].runningHours != null && equipmentOutages[x].runningHours <= equipmentOutages[x].counter && equipmentTimelineList[zz].monthId == 12)|| (this.topLevel.eqType=="GT" && equipmentOutages[x].wceHours != null && equipmentOutages[x].wceHours <= equipmentOutages[x].counterWce && equipmentTimelineList[zz].monthId == 12) || (dateId == this.yearList[bb] && equipmentOutages[x].validate != "NoValidate" && equipmentTimelineList[zz].monthId == 12)) {
                    let varz: WH_timelapseOutage = {
                      outageTitle: equipmentOutages[x].outageTitle,
                      outageCode: equipmentOutages[x].colorCode,
                    }
                    this.innerLevel.outages.push({ ...varz });
                    if (dateId == this.yearList[bb]) {
                      equipmentOutages[x].validate = "NoValidate"

                    }
                    equipmentOutages[x].counter = 0
                    equipmentOutages[x].counterWce = 0
                  }
                  // if ((equipmentOutages[x].wceHours != null && equipmentOutages[x].wceHours <= equipmentOutages[x].counterWce && equipmentTimelineList[zz].monthId == 12) || (dateId == this.yearList[bb] && equipmentOutages[x].validateWce != "NoValidate" && equipmentTimelineList[zz].monthId == 12)) {
                  //   let varz: WH_timelapseOutage = {
                  //     outageTitle: equipmentOutages[x].outageTitle,
                  //     outageCode: equipmentOutages[x].colorCode,
                  //   }
                  //   this.innerLevel2.outages.push({ ...varz });
                  //   if (dateId == this.yearList[bb]) {
                  //     equipmentOutages[x].validateWce = "NoValidate"

                  //   }
                  //   equipmentOutages[x].counterWce = 0
                  // }
                }
              }
            }
            this.innerLevel.yearlyTotal = hoursCounter;
            this.innerLevel2.yearlyTotal = wceHoursCounter;
            this.topLevel.yearData.push({ ...this.innerLevel })

            this.topLevel.yearWCE.push({ ...this.innerLevel2 })
            this.innerLevel.outages=[];
            this.innerLevel2.outages=[];
          }
          this.topLevelArr.push({ ...this.topLevel })
          this.topLevel.yearData = [];
          this.topLevel.yearWCE = [];
        }
        //Only God knew what i was writing but it worked somehow
        // const uniqueEquipments = [...new Set(this.timeline.map(item => item.equipmentId))]
        // // const uniqueYear = [...new Set(this.timeline.map(item => item.yearId))]
        // this.topLevelArr.length = 0;
        // for (let a = 0; a < uniqueEquipments.length; a++) {
        //   let eqDetail: GroupedHoursItems = this.timeline.find(b => b.equipmentId == uniqueEquipments[a]);
        //   let equipmentTimelineList: GroupedHoursItems[] = this.timeline.filter(b => b.equipmentId == uniqueEquipments[a]);
        //   let equipmentOutages: GroupedOutagesItems[] = this.outages.filter(b => b.equipmentId == uniqueEquipments[a]);
        //   this.yearList.length = 0;
        //   this.topLevel.equipmentId = eqDetail.equipmentId;
        //   this.topLevel.unit = eqDetail.unit;
        //   this.topLevel.startDate = eqDetail.startDate;
        //   this.topLevel.startHour = eqDetail.startHours;
        //   let outageCounter = eqDetail.startHours;
        //   let hoursCounter = eqDetail.startHours;

        //   const differenceInYears: number = (new Date(eqDetail.onmContractExpiry)).getFullYear() - (new Date(eqDetail.startDate)).getFullYear();
        //   for (let za = 0; za < differenceInYears; za++) {
        //     let yearToAdd: number = (new Date(eqDetail.startDate)).getFullYear() + za + 1;
        //     this.yearList.push(yearToAdd);
        //   }
        //   for (let bb = 0; bb < this.yearList.length; bb++) {
        //     this.innerLevel2.yearId = this.yearList[bb];
        //     this.innerLevel.yearId = this.yearList[bb];
        //     for (let zz = 0; zz < equipmentTimelineList.length; zz++) {
        //       if (equipmentTimelineList[zz].equipmentId == uniqueEquipments[a] && equipmentTimelineList[zz].yearId == this.yearList[bb]) {
        //         hoursCounter += equipmentTimelineList[zz].runningHour
        //         outageCounter += equipmentTimelineList[zz].runningHour
        //         for (let x = 0; x < equipmentOutages.length; x++) {
        //           if (equipmentOutages[x].counter == -1) {
        //             equipmentOutages[x].counter += outageCounter
        //           }
        //           else {
        //             equipmentOutages[x].counter += equipmentTimelineList[zz].runningHour

        //           }
        //           let dateIdD = new Date(equipmentOutages[x].nextOutageDate)
        //           let dateId = dateIdD.getFullYear();
        //           console.log(dateId);
        //           if ((equipmentOutages[x].runningHours != null && equipmentOutages[x].runningHours <= equipmentOutages[x].counter && equipmentTimelineList[zz].monthId == 12) || (dateId == this.yearList[bb] && equipmentOutages[x].validate != "NoValidate" && equipmentTimelineList[zz].monthId == 12)) {
        //             let varz: WH_timelapseOutage = {
        //               outageTitle: equipmentOutages[x].outageTitle,
        //               outageCode: equipmentOutages[x].colorCode,
        //             }
        //             this.innerLevel.outages.push({ ...varz });
        //             if (dateId == this.yearList[bb]) {
        //               equipmentOutages[x].validate = "NoValidate"

        //             }
        //             equipmentOutages[x].counter = 0
        //           }
        //         }
        //       }
        //     }
        //     this.innerLevel.yearlyTotal = hoursCounter;
        //     this.topLevel.yearData.push({ ...this.innerLevel })
        //     this.innerLevel.outages = [];
        //   }
        //   this.topLevelArr.push({ ...this.topLevel })
        //   this.topLevel.yearData = [];
        // }
      },
      error: err => { this.showNotification('black', err, 'bottom', 'center') }
    })
  }
  // Dont remove before testing
  // getData() {
  //   this.subs.sink = this.dataService.getTimeLine(this.filterObj.regionId, this.filterObj.clusterId, this.filterObj.siteId, this.filterObj.equipmentId).subscribe({
  //     next: data => {
  //       this.timeline = [...data.timeline];
  //       this.outages = [...data.outages];
  //       const uniqueEquipments = [...new Set(this.timeline.map(item => item.equipmentId))]
  //       this.topLevelArr.length = 0;
  //       for (let a = 0; a < uniqueEquipments.length; a++) {
  //         let eqDetail: GroupedHoursItems = this.timeline.find(b => b.equipmentId == uniqueEquipments[a]);
  //         let equipmentTimelineList: GroupedHoursItems[] = this.timeline.filter(b => b.equipmentId == uniqueEquipments[a]);
  //         let equipmentOutages: GroupedOutagesItems[] = this.outages.filter(b => b.equipmentId == uniqueEquipments[a]);
  //         this.yearList.length = 0;
  //         this.topLevel.equipmentId = eqDetail.equipmentId;
  //         this.topLevel.unit = eqDetail.unit;
  //         let outageCounter = eqDetail.startHours;
  //         let hoursCounter = eqDetail.startHours;
  //         const differenceInYears: number = (new Date(eqDetail.onmContractExpiry)).getFullYear() - (new Date(eqDetail.startDate)).getFullYear();
  //         for (let za = 0; za <= differenceInYears; za++) {
  //           let yearToAdd: number = (new Date(eqDetail.startDate)).getFullYear() + za;
  //           this.yearList.push(yearToAdd);
  //         }
  //         for (let bb = 0; bb < this.yearList.length; bb++) {
  //           this.innerLevel.yearId = this.yearList[bb];
  //           for (let zz = 0; zz < equipmentTimelineList.length; zz++) {
  //             if (equipmentTimelineList[zz].equipmentId == uniqueEquipments[a] && equipmentTimelineList[zz].yearId == this.yearList[bb]) {
  //               hoursCounter += equipmentTimelineList[zz].runningHour
  //               outageCounter += equipmentTimelineList[zz].runningHour
  //               for (let x = 0; x < equipmentOutages.length; x++) {
  //                 if (equipmentOutages[x].counter == -1) {
  //                   equipmentOutages[x].counter += outageCounter
  //                 }
  //                 else {
  //                   equipmentOutages[x].counter += equipmentTimelineList[zz].runningHour
  //                 }
  //                 let dateIdD = new Date(equipmentOutages[x].nextOutageDate)
  //                 let dateId = dateIdD.getFullYear();
  //                 console.log(dateId);
  //                 if ((equipmentOutages[x].runningHours != null && equipmentOutages[x].runningHours <= equipmentOutages[x].counter && equipmentTimelineList[zz].monthId == 12) || (dateId == this.yearList[bb] && equipmentOutages[x].validate != "NoValidate" && equipmentTimelineList[zz].monthId == 12)) {
  //                   let varz: WH_timelapseOutage = {
  //                     outageTitle: equipmentOutages[x].outageTitle,
  //                     outageCode: equipmentOutages[x].colorCode,
  //                   }
  //                   this.innerLevel.outages.push({ ...varz });
  //                   if (dateId == this.yearList[bb]) {
  //                     equipmentOutages[x].validate = "NoValidate"

  //                   }
  //                   equipmentOutages[x].counter = 0
  //                 }
  //               }
  //             }
  //           }
  //           this.innerLevel.yearlyTotal = hoursCounter;
  //           this.topLevel.yearData.push({ ...this.innerLevel })
  //           this.innerLevel.outages = [];
  //         }
  //         this.topLevelArr.push({ ...this.topLevel })
  //         this.topLevel.yearData = [];
  //       }
  //     },
  //     error: err => { this.showNotification('black', err, 'bottom', 'center') }
  //   })
  // }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

}
