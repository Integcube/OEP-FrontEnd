import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/core/models/user';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { CSites } from 'src/app/shared/common-interface/common-interface';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { Regions } from '../../regions/region-main/region.model';
import { PreviewInsurenceService } from './preview-insurence.service';
import { PreviewInsurenceFormComponent } from './dialogs/preview-insurence-form.component';
import { PreInsurenceFilterDto } from './preview-insurence.model';


@Component({
  selector: 'app-preview-insurence',
  templateUrl: './preview-insurence.component.html',
  styleUrls: ['./preview-insurence.component.sass']
})
export class PreviewInsurenceComponent extends UnsubscribeOnDestroyAdapter implements OnInit, AfterViewInit {

  //Common Variables
  errorMessage: string;
  isTableLoading: boolean;
  //Get data from browsers Local Storage
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  nameToRemove:any[]=[	"admin", "n.maheta"];
  //Varaibles
  sites: CSites[];
  phaseNumber: any[];
  outages: any[];
  actions: any[];
  filterObj: PreInsurenceFilterDto = {
    userId: -1,
    siteId: -1,
    Year: -1,
    status: -1
  }
  displayFilter: Boolean = false;

  constructor(private snackBar: MatSnackBar, private dataService: PreviewInsurenceService, private dataService2: CommonService, public dialog: MatDialog,) { super() }
  displayedColumns: string[] = ['preInsuranceActionId','siteTitle', 'recommendationTitle', 'actionTitle', 'evidenceType','guidelines', 'yearId', 'status', 'deadline','actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  years: { title: string, value: number }[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  statusList:any[]=[];
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.actions);
    this.getActions();
    debugger
    this.years = this.getYears(2020); 
   this.getSites();
   this.getStatus();
  }
  toggleFilter() {
    this.displayFilter = !this.displayFilter;
  }
  getSites(): void {
    this.subs.sink = this.dataService2.getUpdatedSites(this.user.id, -1, -1,-1).subscribe({
      next: data => {
        this.sites = [...data];
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
    })
  }

  getActions(): void {
    this.isTableLoading = true;
    this.subs.sink = this.dataService.getActions(this.user.id, this.filterObj).subscribe({
      next: data => {
        this.actions = [...data];
        this.dataSource.data = [...this.actions];
        this.isTableLoading = false;
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
    })
  }
  viewAction(action: any) {
    const dialogRef = this.dialog.open(PreviewInsurenceFormComponent, {
      width: '750px',
      data: {
        action: "view",
        outageAction: action
      },
    });
    dialogRef.afterClosed().subscribe((result: Regions) => {

    });
  }
 
  updateAction(action: any) {
    
        const dialogRef = this.dialog.open(PreviewInsurenceFormComponent, {
          width: '750px',
          data: {
            action: "edit",
            outageAction: action,
          },
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
       
            this.subs.sink = this.dataService.saveAction(this.user.id, result).subscribe({
              next:data=>{
                this.getActions()
                this.showNotification('snackbar-success', 'Updated sucessfully', 'bottom', 'center');
              },
              error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
            })           
          }
        });
    
  }

  getStatus() {
    this.subs.sink = this.dataService.getActionStatus().subscribe({
      next: data => {
        this.statusList = [...data];
      },
    })
  }
  getYears(startYear: number): { title: string, value: number }[] {
    const currentYear = new Date().getFullYear();
    const years: { title: string, value: number }[] = [];

    for (let year = startYear; year <= currentYear; year++) {
      years.push({ title: year.toString(), value: year });
    }

    return years.sort((a, b) => b.value - a.value);
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
