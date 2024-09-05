import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreInsurenceListComponent } from './pre-insurence-list.component';

describe('PreInsurenceListComponent', () => {
  let component: PreInsurenceListComponent;
  let fixture: ComponentFixture<PreInsurenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreInsurenceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreInsurenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
