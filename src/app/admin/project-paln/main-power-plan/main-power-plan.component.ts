import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { KeyIssueFilters } from '../project-plan.model';
import { CSites } from 'src/app/shared/common-interface/common-interface';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MainPowerPlanService } from './main-power-plan.service';

@Component({
  selector: 'app-main-power-plan',
  templateUrl: './main-power-plan.component.html',
})

export class MainPowerPlanComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    user: User = JSON.parse(localStorage.getItem('currentUser'));
    KeyIssues:KeyIssueFilters;
    sites: CSites[];
    ManPowerList: any[]=[];
    ManPowerListCopy: any[]=[];
    MilstoneList: any[]=[];
    Yearlist:any[]=[];
    SelectedMonth:number=-1;
    isTableLoading: boolean;
  constructor(
    private dataService: MainPowerPlanService,
    private snackBar: MatSnackBar,

  ) { super() 


    this.KeyIssues = new KeyIssueFilters({});
  }

  ngOnInit(): void {
    this.SelectedMonth=-1;
    this.getSites();
  }

  GetIssues(){

  }
  getSites() {

    this.subs.sink = this.dataService.getsites(this.user.id).subscribe({
      next: data => {

        const defaultUser = {
          siteId: -1,
          siteTitle: '--Select--',
      
        };
        this.sites = [defaultUser, ...data];
      }, 
    })
  }

  onPeopleChange(item:any,value: string): void {
   
    let objList = this.ManPowerList.filter(a => a.positionId === item.positionId && new Date(item.date) < new Date(a.date));
    objList.forEach(obj => {
      obj.peopleName = item.peopleName;
  });
    console.log(value);
  }


  GetManpowerPlan(chnageType:any) {
  if(this.KeyIssues.siteId==-1){
    return
   }
   this.SelectedMonth=-1;
   this.ManPowerList.length=0;
   this.MilstoneList.length=0;
   this.ManPowerListCopy.length=0;
   this.isTableLoading=true;
    this.subs.sink = this.dataService.getManpowerPlan(this.KeyIssues.Date,this.KeyIssues.siteId,chnageType).subscribe({
      next: data => {
        debugger
        if(data){
       
          this.ManPowerList = [...data.dataList];
          this.ManPowerListCopy = [...data.dataList];        
          this.KeyIssues.Date=new Date(data.startDate);
          this.MilstoneList=[...data.phase];
          if(this.Yearlist.length==0){
            this.generateMonthYearList(new Date(data.startDate), new Date(data.endDate));
           }
        }
   
        this.isTableLoading=false;
      }, 
    })
  }

  removePosition(positionId: number) {
    this.ManPowerList = this.ManPowerList.filter(pos => pos.positionId !== positionId);
    
  }

  // Method to add a new position after the clicked task
  addPosition(positionId: number) {
    const newPositionId = this.generateUniqueId();
    const newDates = [...new Set(this.ManPowerList.map(item => item.date))].sort();
    const clickedIndex = this.ManPowerList.findIndex(item => item.positionId === positionId);

    const clickedPosition = this.ManPowerList.find(item => item.positionId === positionId);
     const newPosition = {
      positionId: newPositionId,
      title: '',
      positionType: 1,
      approvedManpower: null,
      numberOfPosition: null, 
      numberOfPositionActual: null, 
      siteId: this.ManPowerList.length > 0 ? this.ManPowerList[0].siteId : 1,
      ishow:1
    };

    newDates.forEach((date, index) => {
      const insertIndex = clickedIndex + 1 + index;
      this.ManPowerList.splice(insertIndex, 0, { ...newPosition, date });
    });
  }
  generateUniqueId(): number {
    return Math.max(...this.ManPowerList.map(pos => pos.positionId)) + 1;
  }


  onTitleChange(positionId: number, newTitle: string): void {
    this.ManPowerList.forEach(item => {
      if (item.positionId === positionId) {
        item.title = newTitle;
      }
    });
  }

  onApprovedChange(positionId: number, newTitle: string): void {
    this.ManPowerList.forEach(item => {
      if (item.positionId === positionId) {
        item.approvedManpower = newTitle;
      }
    });
  }

  onPositionChange(positionId: number, positionType: Number): void {
    debugger
    this.ManPowerList.forEach(item => {
      if (item.positionId === positionId) {
        item.positionType = positionType;
      }
    });
  }


  SaveManPowerPlan() {
    this.isTableLoading=true;
  this.subs.sink = this.dataService.saveManpowerPlan(this.ManPowerList,this.user.id).subscribe({
    next: data => {
    
     this.showNotification('snackbar-success','Data Saved sucessfully', 'bottom', 'center');
     this.GetManpowerPlan(1);
     this.isTableLoading=false;
    },
    error: err => {

      this.showNotification('black', err, 'bottom', 'center');
    }
  })

  }
  filterOnMonth(value: number) {
    if (value === -1) {
    
      this.ManPowerListCopy.forEach(pos => {
        pos.ishow = 1;
      });

      this.ManPowerList = [...this.ManPowerListCopy];
    } else {

      let DateObj = this.Yearlist.find(a => a.value == value).title;
      let date1 = new Date(DateObj);
      
      this.ManPowerListCopy.forEach(pos => {
        let posDate = new Date(pos.date);
        if (posDate.getFullYear() === date1.getFullYear() && posDate.getMonth() === date1.getMonth()) {
          pos.ishow = 1;
        } else {
          pos.ishow = 0;
        }
      });
  
      this.ManPowerList = [...this.ManPowerListCopy];
    }
  }
  
  
  

  get filteredManPowerList() {
    return this.ManPowerList.filter(pos => pos.positionId !== 999999999);
  }
  get specialManPowerList() {
   
    return this.ManPowerList.filter(pos => pos.positionId === 999999999);
  }

  onManpowerChange(item: any, value: string, field: string): void {
    const newValue = value === '' || value === null ? null : +value;
    
    if (field === "numberOfPosition") {
        if (item.approvedManpower !== null && newValue > item.approvedManpower) {
          item[field]=null;
            alert("Number of positions cannot exceed approved manpower.");
            return;
        }

        item[field] = newValue;

        let objList = this.ManPowerList.filter(a => a.positionId === item.positionId && new Date(item.date) < new Date(a.date));

        objList.forEach(obj => {
            obj.numberOfPosition = item.numberOfPosition;
        });
    }else if(field === "numberOfPositionActual"){
   

      item[field] = newValue;


    } else {
        item[field] = newValue;
    }
  }

  generateMonthYearList(minDate: Date, maxDate: Date) {
    let currentDate = new Date(minDate);
    let value=0;
     while (currentDate <= maxDate) {
       let monthYearString = this.getMonthYearString(currentDate);
       
       this.Yearlist.push({
         title: monthYearString,
         isSelected: false,
         value:value,
       });
       value=value+1
       currentDate.setMonth(currentDate.getMonth() + 1);
     }
 
     console.log(this.Yearlist);
   }
   getMonthYearString(date: Date): string {
     const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
     let month = months[date.getMonth()];
     let year = date.getFullYear();
     return `${month}-${year}`;
   }


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }


}
