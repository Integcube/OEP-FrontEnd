import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignInsurenceComponent } from './assign-insurence.component';

describe('AssignInsurenceComponent', () => {
  let component: AssignInsurenceComponent;
  let fixture: ComponentFixture<AssignInsurenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignInsurenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignInsurenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
