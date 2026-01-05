import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { SongDeleteComponent } from './song-delete.component';

describe('SongDeleteComponent', () => {
  let component: SongDeleteComponent;
  let fixture: ComponentFixture<SongDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongDeleteComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
