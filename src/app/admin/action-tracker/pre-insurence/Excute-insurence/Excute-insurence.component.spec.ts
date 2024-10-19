import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExcuteInsurenceComponent } from './Excute-insurence.component';

describe('ExcuteInsurence', () => {
  let component: ExcuteInsurenceComponent;
  let fixture: ComponentFixture<ExcuteInsurenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcuteInsurenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcuteInsurenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
