import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

import { SongDetailsComponent } from './song-details.component';
import { AlbumDetailsComponent } from '../album-details/album-details.component';
import { ArtistDetailsComponent } from '../artist-details/artist-details.component';
import { ArtistCheckPipe } from '../../pipes/artist-check.pipe';
import { SongService } from '../../services/music/song.service';
import { AlbumService } from '../../services/music/album.service';
import { ArtistService } from '../../services/music/artist.service';
import { AuthService } from '../../services/userbase/auth.service';
import { IArtist } from '../../interfaces/iartist';


@Pipe({ name: 'artistCheck' })
class MockArtistCheckPipe implements PipeTransform {
  transform() {
    return of(true);
  }
}


// TESTY JEDNOSTKOWE
describe('SongDetailsComponent Unit Testing', () => {
  let component: SongDetailsComponent;
  let fixture: ComponentFixture<SongDetailsComponent>;

  // MOCKI SERWISÓW
  const mockSongService = {
    getSongDetails: jasmine.createSpy('getSongDetails').and.returnValue(
      of({
        song_name: 'Test Song',
        artists: '{123: A1}',
        release_date: '2023-01-01',
        popularity: 55,
        explicit: 'False',
        song_type: 'Solo',
        album_id: 'ALB123'
      })
    ),
    checkFavouriteSong: jasmine.createSpy('checkFavouriteSong').and.returnValue(
      of({ msg: "OK" })
    ),
    addFavouriteSong: jasmine.createSpy('addFavouriteSong').and.returnValue(
      of({ msg: "OK" })
    ),
    delFavouriteSong: jasmine.createSpy('delFavouriteSong').and.returnValue(
      of({ msg: "OK" })
    )
  };

  const mockAlbumService = {
    getAlbumName: jasmine.createSpy('getAlbumName').and.returnValue(of('Test Album')),
    getImageURL: jasmine.createSpy('getImageURL').and.returnValue(of(null))
  };

  const mockArtistService = {
    transformArtists: jasmine.createSpy('transformArtists').and.returnValue([
      { id: 'ART1', name: 'Artist One' }
    ]),
    getImageURL: jasmine.createSpy('getImageURL').and.returnValue(
      of('artist-image.jpg')
    )
  };

  const mockAuthService = {
    isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
    currentUser: { userId: 'USER123' }
  };

  const mockActivatedRoute = {
    paramMap: of({ get: () => 'SONG123' }) 
  };

  beforeEach(async () => {
    await TestBed.overrideComponent(SongDetailsComponent, {
      set: {
        imports: [
          CommonModule,
          RouterModule,
          HttpClientModule,
          MockArtistCheckPipe
        ],
        providers: [
          { provide: SongService, useValue: mockSongService },
          { provide: AlbumService, useValue: mockAlbumService },
          { provide: ArtistService, useValue: mockArtistService },
          { provide: AuthService, useValue: mockAuthService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(SongDetailsComponent);
    component = fixture.componentInstance;
  });

  
  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should load song id from route params', () => {
    // Arrange
    const song_id: string = 'SONG123'
    // Act
    fixture.detectChanges();
    // Assert
    expect(component['song_id']).toBe(song_id);
  });

  it('should load song details from SongService', () => {
    // Arrange
    const song_id: string = 'SONG123'
    const name: string = 'Test Song'
    const album_id: string = 'ALB123'
    // Act
    fixture.detectChanges();
    // Assert
    expect(mockSongService.getSongDetails).toHaveBeenCalledWith(song_id);
    expect(component['name']).toBe(name);
    expect(component['album_id']).toBe(album_id);
  });

  it('should transform artist list using ArtistService', () => {
    // Arrange
    const artists: string = '{123: A1}'
    const artist_count: number = 1
    // Act
    fixture.detectChanges();
    // Assert
    expect(mockArtistService.transformArtists).toHaveBeenCalledWith(artists);
    expect(component.artist_list.length).toBe(artist_count);
  });

  it('should load album name', () => {
    // Arrange
    const album_id: string = 'ALB123'
    const album_name: string = 'Test Album'
    // Act
    fixture.detectChanges();
    // Assert
    expect(mockAlbumService.getAlbumName).toHaveBeenCalledWith(album_id);
    expect(component.album_name).toBe(album_name);
  });

  it('should check if song is in favourites', () => {
    // Arrange
    const user_id: string = 'USER123'
    const song_id: string = 'SONG123'
    // Act
    fixture.detectChanges();
    // Assert
    expect(mockSongService.checkFavouriteSong).toHaveBeenCalledWith(user_id, song_id);
    expect(component.isFavourite).toBeTrue();
  });
  
});




// TESTY INTEGRACYJNE
describe('SongDetailsComponent Routing Integration', () => {
  let component: SongDetailsComponent;
  let harness: RouterTestingHarness;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongDetailsComponent],
      providers: [
        provideRouter([
          { path: 'song/:id', component: SongDetailsComponent },
          { path: 'album/:id', component: AlbumDetailsComponent },
          { path: 'artist/:id', component: ArtistDetailsComponent}
        ]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .overrideComponent(SongDetailsComponent, {
      remove: {
        imports: [ArtistCheckPipe]
      },
      add: {
        imports: [MockArtistCheckPipe]
      }
    })
    .compileComponents();

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/song/SONG123', SongDetailsComponent);
    location = TestBed.inject(Location);
  });

  
  it('should create', () => {
    // Act
    harness.fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should navigate to artist page when artist name is clicked', fakeAsync(() => {
    // Arrange
    const song_name: string = 'SONG'
    const artist_name: string = 'ARTIST'
    const artist_id: string = 'ART123'
    const artist_list: Array<IArtist> = [{id: artist_id, name: artist_name}];

    // Act
    component.name = song_name
    component.artist_list = artist_list;
    harness.fixture.detectChanges();

    const artistLinks = harness.routeNativeElement?.querySelectorAll('h3[class="artist-link"]') as NodeListOf<HTMLElement>;
    artistLinks[0].click()
    tick();

    // Assert
    expect(location.path()).toBe('/artist/ART123')
  }));

  it('should navigate to album page when album name is clicked', fakeAsync(() => {
    // Arrange
    const song_name: string = 'SONG'
    const album_name: string = 'ALBUM'
    const album_id: string = 'ALB123'

    // Act
    component.name = song_name;
    component.album_name = album_name;
    component.album_id = album_id;
    harness.fixture.detectChanges();

    const albumLink = harness.routeNativeElement?.querySelector('h5[id="album-name"]') as HTMLElement;
    albumLink.click();
    tick();

    // Assert
    expect(location.path()).toBe('/album/ALB123')
  }));

});
