import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWceComponent } from './add-wce.component';

describe('AddWceComponent', () => {
  let component: AddWceComponent;
  let fixture: ComponentFixture<AddWceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
