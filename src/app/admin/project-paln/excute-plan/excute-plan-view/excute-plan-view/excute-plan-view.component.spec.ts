import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcutePlanViewComponent } from './excute-plan-view.component';

describe('ExcutePlanViewComponent', () => {
  let component: ExcutePlanViewComponent;
  let fixture: ComponentFixture<ExcutePlanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcutePlanViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcutePlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
