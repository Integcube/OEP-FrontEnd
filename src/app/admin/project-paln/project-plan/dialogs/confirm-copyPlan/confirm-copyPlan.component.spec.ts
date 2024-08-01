import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmCopyPlanComponent } from './confirm-copyPlan.component';



describe('ConfirmCopyPlanComponent', () => {
  let component: ConfirmCopyPlanComponent;
  let fixture: ComponentFixture<ConfirmCopyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmCopyPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmCopyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
