import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadinessNewTaskComponent } from './readiness-new-task.component';



describe('ReadinessNewTaskComponent', () => {
  let component: ReadinessNewTaskComponent;
  let fixture: ComponentFixture<ReadinessNewTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadinessNewTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadinessNewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
