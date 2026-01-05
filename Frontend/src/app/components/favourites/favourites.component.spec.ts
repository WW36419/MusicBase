import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input } from '@angular/core';
import { of } from 'rxjs';

import { FavouritesComponent } from './favourites.component';
import { IArtist } from '../../interfaces/iartist';
import { SongService } from '../../services/music/song.service';
import { ArtistService } from '../../services/music/artist.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../services/userbase/auth.service';
import { ISongCard } from '../../interfaces/isong-card';
import { provideRouter } from '@angular/router';
import { SongItemComponent } from '../song-item/song-item.component';



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


describe('FavouritesComponent Unit Testing', () => {
  let component: FavouritesComponent;
  let fixture: ComponentFixture<FavouritesComponent>;

  const mockSongService = {
    getFavouriteSongs: jasmine.createSpy('getFavouriteSongs').and.returnValue(
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

  const mockAuthService = {
    currentUser: { userId: 'USER123' }
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouritesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .overrideComponent(FavouritesComponent, {
      set: {
        imports: [MockSongItemComponent],
        providers: [
          { provide: SongService, useValue: mockSongService },
          { provide: ArtistService, useValue: mockArtistService },
          { provide: AuthService, useValue: mockAuthService }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should load favourite song info', () => {
    // Arrange
    const song_id: string = 'SONG1'
    const album_id: string = 'ALB123'
    const user_id: string = 'USER123'
    const song_name: string = 'Test Song'
    const song_explicit: string = 'False'

    // Act
    fixture.detectChanges();
    const songList: Array<ISongCard> = component.fav_songs$;
    const songCard: ISongCard = songList[0];
    
    // Assert
    expect(mockSongService.getFavouriteSongs).toHaveBeenCalledWith(user_id);

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
    const songList: Array<ISongCard> = component.fav_songs$;
    const artistList: Array<IArtist> = songList[0].artists;

    // Assert
    expect(mockArtistService.transformArtists).toHaveBeenCalledWith(artist_json);
    
    expect(artistList.length).toEqual(1);
    expect(artistList[0].id).toBe(artist_id);
    expect(artistList[0].name).toBe(artist_name);
  });
});



describe('FavouritesComponent To SongItemComponent Integration', () => {
  let component: FavouritesComponent;
  let fixture: ComponentFixture<FavouritesComponent>;

  const mockSongService = {
    getFavouriteSongs: jasmine.createSpy('getFavouriteSongs').and.returnValue(
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

  const mockAuthService = {
    currentUser: { userId: 'USER123' }
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouritesComponent, SongItemComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .overrideComponent(FavouritesComponent, {
      set: {
        providers: [
          { provide: SongService, useValue: mockSongService },
          { provide: ArtistService, useValue: mockArtistService },
          { provide: AuthService, useValue: mockAuthService }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesComponent);
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
