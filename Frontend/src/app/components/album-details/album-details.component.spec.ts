import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

import { AlbumDetailsComponent } from './album-details.component';
import { SongDetailsComponent } from '../song-details/song-details.component';
import { ArtistDetailsComponent } from '../artist-details/artist-details.component';
import { ArtistCheckPipe } from '../../pipes/artist-check.pipe';
import { AlbumService } from '../../services/music/album.service';
import { ArtistService } from '../../services/music/artist.service';
import { IArtist } from '../../interfaces/iartist';
import { CardItemComponent } from '../card-item/card-item.component';
import { ITrack } from '../../interfaces/itrack';


@Pipe({ name: 'artistCheck' })
class MockArtistCheckPipe implements PipeTransform {
  transform() {
    return of(true);
  }
}


// TESTY JEDNOSTKOWE
describe('AlbumDetailsComponent Unit Testing', () => {
  let component: AlbumDetailsComponent;
  let fixture: ComponentFixture<AlbumDetailsComponent>;

  // MOCKI SERWISÓW
    const mockAlbumService = {
      getAlbumDetails: jasmine.createSpy('getAlbumDetails').and.returnValue(
        of({
          name: 'Test Album',
          artists: '{ART1: Artist One}',
          popularity: 70,
          image_url: 'album-image-url.png',
        })
      ),
      getTracks: jasmine.createSpy('getTracks').and.returnValue(
        of([
          {song_id: 'SONG1', song_name: 'Test Song 1', track_number: 1},
          {song_id: 'SONG2', song_name: 'Test Song 2', track_number: 2},
        ])
      )
    };
  
    const mockArtistService = {
      transformArtists: jasmine.createSpy('transformArtists').and.returnValue([
        { id: 'ART1', name: 'Artist One' }
      ])
    };
  
    const mockActivatedRoute = {
      paramMap: of({ get: () => 'ALB123' }) 
    };
  
    beforeEach(async () => {
      await TestBed.overrideComponent(AlbumDetailsComponent, {
        set: {
          imports: [
            CommonModule,
            RouterModule,
            HttpClientModule,
            MockArtistCheckPipe,
            CardItemComponent
          ],
          providers: [
            { provide: AlbumService, useValue: mockAlbumService },
            { provide: ArtistService, useValue: mockArtistService },
            { provide: ActivatedRoute, useValue: mockActivatedRoute }
          ]
        }
      }).compileComponents();
  
      fixture = TestBed.createComponent(AlbumDetailsComponent);
      component = fixture.componentInstance;
    });


  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should load album id from route params', () => {
    // Arrange
    const album_id: string = 'ALB123'
    // Act
    fixture.detectChanges();
    // Assert
    expect(component['album_id']).toBe(album_id);
  });

  it('should load album details from AlbumService', () => {
    // Arrange
    const album_id: string = 'ALB123'
    const name: string = 'Test Album'
    const popularity: number = 70
    const image_url: string = 'album-image-url.png'

    // Act
    fixture.detectChanges();
    
    // Assert
    expect(mockAlbumService.getAlbumDetails).toHaveBeenCalledWith(album_id);
    expect(component.name).toBe(name);
    expect(component.popularity).toBe(popularity);
    expect(component.image_url).toBe(image_url);
  });

  it('should transform artist list using ArtistService', () => {
    // Arrange
    const artist_id: string = 'ART1'
    const artist_name: string = 'Artist One'
    const artist_json: string = '{'+artist_id+': '+artist_name+'}'

    // Act
    fixture.detectChanges();

    // Assert
    expect(mockArtistService.transformArtists).toHaveBeenCalledWith(artist_json);
    expect(component.artist_list.length).toEqual(1);
    expect(component.artist_list[0].id).toBe(artist_id);
    expect(component.artist_list[0].name).toBe(artist_name);
  });

  it('should load album tracks from AlbumService', () => {
    // Arrange
    const album_id: string = 'ALB123'
    const trackRow1: ITrack = {id: 'SONG1', name: 'Test Song 1', nr: 1};
    const trackRow2: ITrack = {id: 'SONG2', name: 'Test Song 2', nr: 2};

    // Act
    fixture.detectChanges();
    
    // Assert
    expect(mockAlbumService.getTracks).toHaveBeenCalledWith(album_id);
    expect(component.tracks.length).toEqual(2);
    expect(component.tracks[0]).toEqual(trackRow1);
    expect(component.tracks[1]).toEqual(trackRow2);
  });
});





describe('AlbumDetailsComponent Router Integration', () => {
  let component: AlbumDetailsComponent;
  let harness: RouterTestingHarness;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumDetailsComponent],
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
    .overrideComponent(AlbumDetailsComponent, {
      remove: {
        imports: [ArtistCheckPipe]
      },
      add: {
        imports: [MockArtistCheckPipe]
      }
    })
    .compileComponents();

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/album/ALB123', AlbumDetailsComponent);
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
    const album_name: string = 'ALBUM'
    const artist_name: string = 'ARTIST'
    const artist_id: string = 'ART123'
    const artist_list: Array<IArtist> = [{id: artist_id, name: artist_name}];

    // Act
    component.name = album_name
    component.artist_list = artist_list;
    harness.fixture.detectChanges();

    const artistLinks = harness.routeNativeElement?.querySelectorAll('h3[class="artist-link"]') as NodeListOf<HTMLElement>;
    artistLinks[0].click()
    tick();

    // Assert
    expect(location.path()).toBe('/artist/ART123')
  }));

  it('should navigate to song page when track card is clicked', fakeAsync(() => {
      // Arrange
      const artist_name: string = 'Test Artist'
      const tracks: Array<ITrack> = [
        {id: 'SONG1', name: 'Test Song 1', nr: 1}
      ]
  
      // Act
      component.name = artist_name
      component.tracks = tracks;
      harness.fixture.detectChanges();
  
      const songCards = harness.routeNativeElement?.querySelectorAll('div[class="track-card"]') as NodeListOf<HTMLElement>;
      songCards[0].querySelector('div')?.click();
      tick();
  
      // Assert
      expect(location.path()).toBe('/song/SONG1')
  }));

});
