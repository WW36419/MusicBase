import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDeleteComponent } from './artist-delete.component';

describe('ArtistDeleteComponent', () => {
  let component: ArtistDeleteComponent;
  let fixture: ComponentFixture<ArtistDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
