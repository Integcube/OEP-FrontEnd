import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadinessViewComponent } from './readiness-view.component';



describe('AddTaskComponent', () => {
  let component: ReadinessViewComponent;
  let fixture: ComponentFixture<ReadinessViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadinessViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadinessViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
