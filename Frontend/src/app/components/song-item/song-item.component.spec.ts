import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { SongItemComponent } from './song-item.component';
import { AlbumService } from '../../services/music/album.service';
import { ArtistService } from '../../services/music/artist.service';
import { IArtist } from '../../interfaces/iartist';
import { SongDetailsComponent } from '../song-details/song-details.component';



describe('SongItemComponent Unit Testing', () => {
  let component: SongItemComponent;
  let fixture: ComponentFixture<SongItemComponent>;

  let hasAlbumImg: boolean = true;

  const mockAlbumService = {
    getImageURL: jasmine.createSpy('getImageURL').and.callFake(() => {
      if (hasAlbumImg)
        return of('album-img.png')
      else
        return of(null)
    })
  };

  const mockArtistService = {
    getImageURL: jasmine.createSpy('getImageURL').and.returnValue(of('artist-img.png'))
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongItemComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .overrideComponent(SongItemComponent, {
      set: {
        providers: [
          { provide: AlbumService, useValue: mockAlbumService },
          { provide: ArtistService, useValue: mockArtistService }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongItemComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should get image url from album id', () => {
    // Arrange
    hasAlbumImg = true;
    const album_id: string = 'ALB123';
    const album_url: string = 'album-img.png';

    // Act
    component.albumId = album_id;
    fixture.detectChanges();

    // Assert
    expect(mockAlbumService.getImageURL).toHaveBeenCalledWith(album_id);
    expect(component.image_url).toBe(album_url);
  });

  it('should get image url from artist id as replacement for album id', () => {
    // Arrange
    hasAlbumImg = false;
    const album_id: string = 'ALB123';
    const artist_id: string = 'ART123';
    const artist_name: string = 'Test Artist'
    const artist_json: IArtist = {id: artist_id, name: artist_name}
    const artist_url: string = 'artist-img.png';

    // Act
    component.albumId = album_id;
    component.artists = [artist_json];
    fixture.detectChanges();

    // Assert
    expect(mockAlbumService.getImageURL).toHaveBeenCalledWith(album_id);
    expect(mockArtistService.getImageURL).toHaveBeenCalledWith(artist_id);
    expect(component.image_url).toBe(artist_url);
  })
});



describe('SongItemComponent Routing Integration', () => {
  let component: SongItemComponent;
  let fixture: ComponentFixture<SongItemComponent>;
  let location: Location;

  const mockAlbumService = {
    getImageURL: jasmine.createSpy('getImageURL').and.returnValue(of('album-img.png'))
  };

  const mockArtistService = {
    getImageURL: jasmine.createSpy('getImageURL').and.returnValue(of('artist-img.png'))
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongItemComponent],
      providers: [
        provideRouter([
          { path: 'song/:id', component: SongDetailsComponent }
        ]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .overrideComponent(SongItemComponent, {
      set: {
        providers: [
          { provide: AlbumService, useValue: mockAlbumService },
          { provide: ArtistService, useValue: mockArtistService }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongItemComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
  });


  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should navigate to song details page when song item is clicked', fakeAsync(() => {
    // Arrange
    const song_id: string = 'SONG123';

    // Act
    component.songId = song_id;
    fixture.detectChanges();
  
    const songCards = fixture.nativeElement?.querySelectorAll('.song-item-card') as NodeListOf<HTMLElement>;
    const songCard = songCards[0];
    songCard.click();
    tick();

    // Assert
    expect(location.path()).toBe('/song/'+song_id);
  }));


});