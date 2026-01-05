import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ArtistService } from './artist.service';


describe('ArtistService', () => {
  let service: ArtistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    })
    .compileComponents();
    
    service = TestBed.inject(ArtistService);
  });

  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
