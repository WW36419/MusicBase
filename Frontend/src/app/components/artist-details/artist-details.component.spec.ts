import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Location } from '@angular/common';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { ArtistDetailsComponent } from './artist-details.component';
import { SongDetailsComponent } from '../song-details/song-details.component';
import { AlbumDetailsComponent } from '../album-details/album-details.component';
import { CardItemComponent } from '../card-item/card-item.component';
import { SongService } from '../../services/music/song.service';
import { AlbumService } from '../../services/music/album.service';
import { ArtistService } from '../../services/music/artist.service';
import { ISong } from '../../interfaces/isong';
import { IAlbum } from '../../interfaces/ialbum';



describe('ArtistDetailsComponent Unit Testing', () => {
  let component: ArtistDetailsComponent;
  let fixture: ComponentFixture<ArtistDetailsComponent>;

  // MOCKI SERWISÓW
  const mockSongService = {
    getSongsFromArtist: jasmine.createSpy('getSongsFromArtist').and.returnValue(
      of([
        {song_id: 'SONG1', song_name: 'Test Song 1'},
        {song_id: 'SONG2', song_name: 'Test Song 2'},
        {song_id: 'SONG3', song_name: 'Test Song 3'}
      ])
    )
  };

  const mockAlbumService = {
    getAlbumsFromArtist: jasmine.createSpy('getAlbumsFromArtist').and.returnValue(
      of([
        {album_id: 'ALB1', name: 'Test Album 1', release_date: '2022-01-01'},
        {album_id: 'ALB2', name: 'Test Album 2', release_date: '2023-01-01'}
      ])
    )
  };

  const mockArtistService = {
    getArtistDetails: jasmine.createSpy('getArtistDetails').and.returnValue(
      of({
        name: 'Test Artist',
        artist_type: 'Single',
        main_genre: 'Pop',
        followers: '100000',
        popularity: 70,
        image_url: 'artist-image.jpg'
      })
    )
  };

  const mockActivatedRoute = {
    paramMap: of({ get: () => 'ART123' }) 
  };


  beforeEach(async () => {
    await TestBed.overrideComponent(ArtistDetailsComponent, {
      set: {
        imports: [
          HttpClientModule,
          CardItemComponent
        ],
        providers: [
          { provide: SongService, useValue: mockSongService },
          { provide: AlbumService, useValue: mockAlbumService },
          { provide: ArtistService, useValue: mockArtistService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistDetailsComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should load artist id from route params', () => {
    // Arrange
    const artist_id: string = 'ART123'
    // Act
    fixture.detectChanges();
    // Assert
    expect(component['artist_id']).toBe(artist_id);
  });

  it('should load artist details from ArtistService', () => {
    // Arrange
    const artist_id: string = 'ART123'
    const name: string = 'Test Artist'
    const artist_type: string = 'Single'
    const main_genre: string = 'Pop'
    const followers: string = '100000'
    const popularity: number = 70
    const image_url: string = 'artist-image.jpg'

    // Act
    fixture.detectChanges();

    // Assert
    expect(mockArtistService.getArtistDetails).toHaveBeenCalledWith(artist_id);
    expect(component.name).toBe(name);
    expect(component.type).toBe(artist_type);
    expect(component.genre).toBe(main_genre);
    expect(component.followers).toBe(followers);
    expect(component.popularity).toBe(popularity);
    expect(component.image_url).toBe(image_url);
  });

  it('should load all song data from SongService', () => {
    // Arrange
    const artist_id: string = 'ART123'
    const songRow1: ISong = {id: 'SONG1', name: 'Test Song 1', artists: []}
    const songRow2: ISong = {id: 'SONG2', name: 'Test Song 2', artists: []}
    const songRow3: ISong = {id: 'SONG3', name: 'Test Song 3', artists: []}

    // Act
    fixture.detectChanges();

    // Assert
    expect(mockSongService.getSongsFromArtist).toHaveBeenCalledWith(artist_id)
    expect(component.top_songs.length).toEqual(3)
    expect(component.top_songs[0]).toEqual(songRow1)
    expect(component.top_songs[1]).toEqual(songRow2)
    expect(component.top_songs[2]).toEqual(songRow3)
  })

  it('should load all album data form AlbumService', () => {
    // Arrange
    const artist_id: string = 'ART123'
    const albumRow1: IAlbum = {id: 'ALB1', name: 'Test Album 1', date: '2022-01-01'}
    const albumRow2: IAlbum = {id: 'ALB2', name: 'Test Album 2', date: '2023-01-01'}

    // Act
    fixture.detectChanges();

    // Assert
    expect(mockAlbumService.getAlbumsFromArtist).toHaveBeenCalledWith(artist_id)
    expect(component.albums.length).toEqual(2)
    expect(component.albums[0]).toEqual(albumRow1)
    expect(component.albums[1]).toEqual(albumRow2)
  })
});




// TESTY INTEGRACYJNE
describe('ArtistDetailsComponent Routing Integration', () => {
  let component: ArtistDetailsComponent;
  let harness: RouterTestingHarness;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistDetailsComponent, CardItemComponent],
      providers: [
        provideRouter([
          { path: 'song/:id', component: SongDetailsComponent },
          { path: 'album/:id', component: AlbumDetailsComponent },
          { path: 'artist/:id', component: ArtistDetailsComponent}
        ]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/artist/ART123', ArtistDetailsComponent);
    location = TestBed.inject(Location);
  });


  it('should create', () => {
    // Act
    harness.fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should navigate to song page when song card is clicked', fakeAsync(() => {
    // Arrange
    const artist_name: string = 'Test Artist'
    const top_songs: Array<ISong> = [
      {id: 'SONG1', name: 'Test Song 1', artists: []}
    ]

    // Act
    component.name = artist_name
    component.top_songs = top_songs;
    harness.fixture.detectChanges();

    const songCards = harness.routeNativeElement?.querySelectorAll('div[class="song-card"]') as NodeListOf<HTMLElement>;
    songCards[0].querySelector('div')?.click();
    tick();

    // Assert
    expect(location.path()).toBe('/song/SONG1')
  }));

  it('should navigate to album page when album card is clicked', fakeAsync(() => {
    // Arrange
    const artist_name: string = 'Test Artist'
    const albums: Array<IAlbum> = [
      {id: 'ALB1', name: 'Test Album 1', date: '2022-01-01'},
      {id: 'ALB2', name: 'Test Album 2', date: '2023-01-01'}
    ]

    // Act
    component.name = artist_name
    component.albums = albums;
    harness.fixture.detectChanges();

    const songCards = harness.routeNativeElement?.querySelectorAll('div[class="album-card"') as NodeListOf<HTMLElement>;
    songCards[0].querySelector('div')?.click();
    tick();

    // Assert
    expect(location.path()).toBe('/album/ALB1')
  }))

});
