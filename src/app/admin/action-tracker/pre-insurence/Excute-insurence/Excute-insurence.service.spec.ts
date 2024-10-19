import { TestBed } from '@angular/core/testing';
import { ExcuteInsurenceService } from './Excute-insurence.service';



describe('TrackOutagesService', () => {
  let service: ExcuteInsurenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcuteInsurenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
