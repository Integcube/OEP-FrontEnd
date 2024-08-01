import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DocInfo, KeyIssueFilters } from '../project-plan.model';
import { CSites } from 'src/app/shared/common-interface/common-interface';
import { ProjectKeyIssuesService } from './project-key-issues.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { FileUploadDialogComponent } from '../file-upload-dialog/file-upload-dialog.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-project-key-issues',
  templateUrl: './project-key-issues.component.html',
  styleUrls: ['./project-key-issues.component.sass']
})


export class ProjectKeyIssuesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    user: User = JSON.parse(localStorage.getItem('currentUser'));
    KeyIssues:KeyIssueFilters;
    sites: CSites[];
    monthsList: any[] = [];
    selectedMonth: number=0;
    action: DocInfo;
  constructor(
    private dataService: ProjectKeyIssuesService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog

  ) { super() 


    this.KeyIssues = new KeyIssueFilters({});
    this.action = new DocInfo({});

  }

  ngOnInit(): void {
    this.getSites();
    this.calculateMonths();
  }
  calculateMonths(): void {
    const currentDate = new Date();
    const months = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < 240; i++) { // 10 years * 12 months
      const year = currentDate.getFullYear() - Math.floor(i / 12);
      const month = (currentDate.getMonth() - i % 12 + 12) % 12;
      const formattedDate = new Date(year, month, 1);
      const monthObj = {
        Index: i ,
        value: this.formatDateForBackend(formattedDate),
        Title: `${monthNames[month]}-${year}`
      };
      months.push(monthObj);
    }

    this.monthsList = months;
  }

  formatDateForBackend(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
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

  getKeyIssues() {
if(this.KeyIssues.siteId==-1){
  return
}
debugger
this.KeyIssues.Date=new Date(this.monthsList[(this.selectedMonth)].value) 

    this.subs.sink = this.dataService.getKeyIssues(this.KeyIssues.Date,this.KeyIssues.siteId).subscribe({
      next: data => {
        if(data){
          debugger
          this.KeyIssues.hsseIssues =data.hsseIssues;
          this.KeyIssues.technicalIssues =data.technicalIssues;
          this.KeyIssues.recruitmentIssues =data.recruitmentIssues;
          this.KeyIssues.financialcommercial =data.financialcommercial;
          this.KeyIssues.roschecklistprogress =data.roschecklistprogress;
          this.KeyIssues.technicalriskregister =data.technicalriskregister;
          this.KeyIssues.lessonslearned =data.lessonslearned;
          this.KeyIssues.previousactioncall =data.previousactioncall;
          this.KeyIssues.receiveddocument =data.receiveddocument;
          this.KeyIssues.revieweddocument =data.revieweddocument;
        }else{
          this.KeyIssues.hsseIssues ="";
          this.KeyIssues.technicalIssues ="";
          this.KeyIssues.recruitmentIssues ="";
          this.KeyIssues.financialcommercial ="";
          
          this.KeyIssues.roschecklistprogress ="";
          this.KeyIssues.technicalriskregister ="";
          this.KeyIssues.lessonslearned ="";
          this.KeyIssues.previousactioncall ="";
          this.KeyIssues.receiveddocument =0;
          this.KeyIssues.revieweddocument =0;
        }

      }, 
    })
  }
  SaveKeyIssues() {
  this.subs.sink = this.dataService.saveKeyIssues(this.KeyIssues,this.user.id).subscribe({
    next: data => {
    
     this.showNotification('snackbar-success','Data Saved sucessfully', 'bottom', 'center');

    },
    error: err => {

      this.showNotification('black', err, 'bottom', 'center');
    }
  })

  }

  addBulletPointhsseIssues(event: KeyboardEvent) {
    event.preventDefault();
    const lines = this.KeyIssues.hsseIssues.split('\n');

    let bulletNumber = 1;
    if (lines.length > 0) {
      const firstLineMatch = lines[0].match(/^(\d+)\)\s+/);
      if (firstLineMatch) {
        bulletNumber = parseInt(firstLineMatch[1], 10);
      } else {
        this.KeyIssues.hsseIssues = `1) ${this.KeyIssues.hsseIssues}`;
        this.KeyIssues.hsseIssues += `\n${bulletNumber + lines.length}) `;
        return;
      }
    }
    this.KeyIssues.hsseIssues += `\n${bulletNumber + lines.length}) `;
  }

  addBulletPointtechnicalIssues(event: KeyboardEvent) {
    event.preventDefault();
    const lines = this.KeyIssues.technicalIssues.split('\n');

    let bulletNumber = 1;
    if (lines.length > 0) {
      const firstLineMatch = lines[0].match(/^(\d+)\)\s+/);
      if (firstLineMatch) {
        bulletNumber = parseInt(firstLineMatch[1], 10);
      } else {
        this.KeyIssues.technicalIssues = `1) ${this.KeyIssues.technicalIssues}`;
        this.KeyIssues.technicalIssues += `\n${bulletNumber + lines.length}) `;
        return;
      }
    }
    this.KeyIssues.technicalIssues += `\n${bulletNumber + lines.length}) `;
  }

  addBulletPointrecruitmentIssues(event: KeyboardEvent) {
    event.preventDefault();
    const lines = this.KeyIssues.recruitmentIssues.split('\n');

    let bulletNumber = 1;
    if (lines.length > 0) {
      const firstLineMatch = lines[0].match(/^(\d+)\)\s+/);
      if (firstLineMatch) {
        bulletNumber = parseInt(firstLineMatch[1], 10);
      } else {
        this.KeyIssues.recruitmentIssues = `1) ${this.KeyIssues.recruitmentIssues}`;
        this.KeyIssues.recruitmentIssues += `\n${bulletNumber + lines.length}) `;
        return;
      }
    }
    this.KeyIssues.recruitmentIssues += `\n${bulletNumber + lines.length}) `;
  }
  addBulletPointfinancialcommercial(event: KeyboardEvent) {
    event.preventDefault();
    const lines = this.KeyIssues.financialcommercial.split('\n');
    let bulletNumber = 1;
    if (lines.length > 0) {
      const firstLineMatch = lines[0].match(/^(\d+)\)\s+/);
      if (firstLineMatch) {
        bulletNumber = parseInt(firstLineMatch[1], 10);
      } else {
        this.KeyIssues.financialcommercial = `1) ${this.KeyIssues.financialcommercial}`;
        this.KeyIssues.financialcommercial += `\n${bulletNumber + lines.length}) `;
        return;
      }
    }
    this.KeyIssues.financialcommercial += `\n${bulletNumber + lines.length}) `;
  }

  uploadEvidence(Type) {
    this.action.siteId=this.KeyIssues.siteId;
    this.action.Date=this.KeyIssues.Date;
    this.action.type=Type;
    const dialogPosition: DialogPosition = {
      right: 30 + 'px'
    };
    const dialogRef = this.dialog.open(FileUploadDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '340px',
      height: '700px',
      position: dialogPosition,
      data: {
        data: this.action,
        action: 'outageTracker',
        mode: 'edit'
      },
    });
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
