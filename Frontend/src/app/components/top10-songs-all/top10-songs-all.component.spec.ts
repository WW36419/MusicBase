import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Top10SongsAllComponent } from './top10-songs-all.component';

describe('Top10SongsAllComponent', () => {
  let component: Top10SongsAllComponent;
  let fixture: ComponentFixture<Top10SongsAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Top10SongsAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Top10SongsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
