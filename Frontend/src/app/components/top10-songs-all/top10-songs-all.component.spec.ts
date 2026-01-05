import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input } from '@angular/core';
import { of } from 'rxjs';

import { Top10SongsAllComponent } from './top10-songs-all.component';
import { SongService } from '../../services/music/song.service';
import { ArtistService } from '../../services/music/artist.service';
import { IArtist } from '../../interfaces/iartist';
import { ISongCard } from '../../interfaces/isong-card';
import { SongItemComponent } from '../song-item/song-item.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';



@Component({
  selector: 'song-item',
  standalone: true,
  template: ''
})
class MockSongItemComponent {
  @Input() songId?: string;
  @Input() songName?: string;
  @Input() albumId?: string; 
  @Input() artists?: Array<IArtist>;
  @Input() explicit?: string;
}


describe('Top10SongsAllComponent Unit Testing', () => {
  let component: Top10SongsAllComponent;
  let fixture: ComponentFixture<Top10SongsAllComponent>;

  const mockSongService = {
    getTop10All: jasmine.createSpy('getTop10All').and.returnValue(
      of([{
        song_id: 'SONG1',
        song_name: 'Test Song',
        artists: '{ART123: Test Artist}',
        explicit: 'False',
        album_id: 'ALB123'
      }])
    )
  };

  const mockArtistService = {
    transformArtists: jasmine.createSpy('transformArtists').and.returnValue([
      { id: 'ART123', name: 'Test Artist' }
    ])
  };


  beforeEach(async () => {
    await TestBed.overrideComponent(Top10SongsAllComponent, {
      set: {
        imports: [MockSongItemComponent],
        providers: [
          { provide: SongService, useValue: mockSongService },
          { provide: ArtistService, useValue: mockArtistService }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(Top10SongsAllComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should load song from top 10 songs', () => {
    // Arrange
    const song_id: string = 'SONG1'
    const song_name: string = 'Test Song'
    const song_explicit: string = 'False'
    const album_id: string = 'ALB123'

    // Act
    fixture.detectChanges();
    const songList: Array<ISongCard> = component.top10_songs$;
    const songCard: ISongCard = songList[0];
    
    // Assert
    expect(mockSongService.getTop10All).toHaveBeenCalled();

    expect(songList.length).toEqual(1);
    expect(songCard.id).toBe(song_id);
    expect(songCard.name).toBe(song_name);
    expect(songCard.explicit).toBe(song_explicit);
    expect(songCard.album_id).toBe(album_id);
  });

  it('should transform artist list using ArtistService', () => {
    // Arrange
    const artist_id: string = 'ART123'
    const artist_name: string = 'Test Artist'
    const artist_json: string = '{'+artist_id+': '+artist_name+'}'

    // Act
    fixture.detectChanges();
    const songList: Array<ISongCard> = component.top10_songs$;
    const artistList: Array<IArtist> = songList[0].artists;

    // Assert
    expect(mockArtistService.transformArtists).toHaveBeenCalledWith(artist_json);
    
    expect(artistList.length).toEqual(1);
    expect(artistList[0].id).toBe(artist_id);
    expect(artistList[0].name).toBe(artist_name);
  });
});




describe('Top10SongsAllComponent To SongItemComponent Integration', () => {
  let component: Top10SongsAllComponent;
  let fixture: ComponentFixture<Top10SongsAllComponent>;

  const mockSongService = {
    getTop10All: jasmine.createSpy('getTop10All').and.returnValue(
      of([{
        song_id: 'SONG1',
        song_name: 'Test Song',
        artists: '{ART123: Test Artist}',
        explicit: 'False',
        album_id: 'ALB123'
      }])
    )
  };

  const mockArtistService = {
    transformArtists: jasmine.createSpy('transformArtists').and.returnValue([
      { id: 'ART123', name: 'Test Artist' }
    ])
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Top10SongsAllComponent, SongItemComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .overrideComponent(Top10SongsAllComponent, {
      set: {
        providers: [
          { provide: SongService, useValue: mockSongService },
          { provide: ArtistService, useValue: mockArtistService }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(Top10SongsAllComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should display song info when song item is shown', () => {
    // Arrange
    const song_name: string = 'Test Song'
    const artist_name: string = 'Test Artist'

    // Act
    fixture.detectChanges();

    const songCards = fixture.nativeElement?.querySelectorAll('.song-item-card') as NodeListOf<HTMLElement>;
    const songCard = songCards[0];

    // Assert
    expect(songCards.length).toEqual(1);

    expect(songCard.textContent).toContain(song_name);
    expect(songCard.textContent).toContain(artist_name);
  });
});