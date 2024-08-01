import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteReadineesComponent } from './confirm-delete.component';

describe('ConfirmDeleteComponent', () => {
  let component: ConfirmDeleteReadineesComponent;
  let fixture: ComponentFixture<ConfirmDeleteReadineesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteReadineesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteReadineesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
