import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurenceActionsComponent } from './insurence-actions.component';

describe('InsurenceActionsComponent', () => {
  let component: InsurenceActionsComponent;
  let fixture: ComponentFixture<InsurenceActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurenceActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsurenceActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
