import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { AlbumDeleteComponent } from './album-delete.component';

describe('AlbumDeleteComponent', () => {
  let component: AlbumDeleteComponent;
  let fixture: ComponentFixture<AlbumDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumDeleteComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
