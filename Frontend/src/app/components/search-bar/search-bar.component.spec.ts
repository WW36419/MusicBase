import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Component, Input } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { SearchBarComponent } from './search-bar.component';
import { FormsModule } from '@angular/forms';
import { CardItemComponent } from '../card-item/card-item.component';
import { SongService } from '../../services/music/song.service';
import { AlbumService } from '../../services/music/album.service';
import { ArtistService } from '../../services/music/artist.service';
import { ISearchCard } from '../../interfaces/isearch-card';



@Component({
  selector: 'card-item',
  standalone: true,
  template: ''
})
class MockCardItemComponent {
  @Input() id!: string;
  @Input() music_type!: string;
  @Input() name!: string;
  @Input() content!: string;
}


describe('SearchBarComponent Unit Testing', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  const mockSongService = {
    searchSong: jasmine.createSpy('searchSong').and.returnValue(
      of([
        {song_id: 'SONG1', song_name: 'Test Song 1', artists: '{ART123: Test Artist}'},
        {song_id: 'SONG2', song_name: 'Test Song 2', artists: '{ART123: Test Artist}'},
        {song_id: 'SONG3', song_name: 'Test Song 3', artists: '{ART123: Test Artist}'}
      ])
    )
  };

  const mockAlbumService = {
    searchAlbums: jasmine.createSpy('searchAlbums').and.returnValue(
      of([
        {album_id: 'ALB1', name: 'Test Album 1', artists: '{ART123: Test Artist}'},
        {album_id: 'ALB2', name: 'Test Album 2', artists: '{ART123: Test Artist}'}
      ])
    )
  };

  const mockArtistService = {
    searchArtists: jasmine.createSpy('searchArtists').and.returnValue(
      of([
        {artist_id: 'ART123', name: 'Test Artist', main_genre: 'Pop'}
      ])
    ),
    getArtistsNames: jasmine.createSpy('getArtistsNames').and.returnValue('Test Artist')
  };


  beforeEach(async () => {
    await TestBed.overrideComponent(SearchBarComponent, {
      set: {
        imports: [
          FormsModule,
          MockCardItemComponent
        ],
        providers: [
          { provide: SongService, useValue: mockSongService },
          { provide: AlbumService, useValue: mockAlbumService },
          { provide: ArtistService, useValue: mockArtistService }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should load searched song cards when song query is given', () => {
    // Arrange
    const music_type: string = "song";
    const query: string = "Test";

    const songRow1: ISearchCard = {id: "SONG1", name: "Test Song 1", type: "song", content: "Test Artist"};
    const songRow2: ISearchCard = {id: "SONG2", name: "Test Song 2", type: "song", content: "Test Artist"};
    const songRow3: ISearchCard = {id: "SONG3", name: "Test Song 3", type: "song", content: "Test Artist"};

    // Act
    component.musicType = music_type;
    fixture.detectChanges();
    
    const queryInput = fixture.nativeElement?.querySelector('#musicSearch') as HTMLInputElement;
    queryInput.value = query;
    queryInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(component.musicQuery).toBe(query);
    expect(mockSongService.searchSong).toHaveBeenCalledWith(query);

    expect(component.musicList.length).toEqual(3);
    expect(component.musicList[0]).toEqual(songRow1);
    expect(component.musicList[1]).toEqual(songRow2);
    expect(component.musicList[2]).toEqual(songRow3);
  });

  it('should load searched album cards when album query is given', () => {
    // Arrange
    const music_type: string = "album";
    const query: string = "Test";

    const albumRow1: ISearchCard = {id: "ALB1", name: "Test Album 1", type: "album", content: "Test Artist"};
    const albumRow2: ISearchCard = {id: "ALB2", name: "Test Album 2", type: "album", content: "Test Artist"};

    // Act
    component.musicType = music_type;
    fixture.detectChanges();
    
    const queryInput = fixture.nativeElement?.querySelector('#musicSearch') as HTMLInputElement;
    queryInput.value = query;
    queryInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(component.musicQuery).toBe(query);
    expect(mockAlbumService.searchAlbums).toHaveBeenCalledWith(query);

    expect(component.musicList.length).toEqual(2);
    expect(component.musicList[0]).toEqual(albumRow1);
    expect(component.musicList[1]).toEqual(albumRow2);
  });

  it('should load searched artist cards when artist query is given', () => {
    // Arrange
    const music_type: string = "artist";
    const query: string = "Test";

    const artistRow: ISearchCard = {id: "ART123", name: "Test Artist", type: "artist", content: "Pop"};

    // Act
    component.musicType = music_type;
    fixture.detectChanges();
    
    const queryInput = fixture.nativeElement?.querySelector('#musicSearch') as HTMLInputElement;
    queryInput.value = query;
    queryInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(component.musicQuery).toBe(query);
    expect(mockArtistService.searchArtists).toHaveBeenCalledWith(query);

    expect(component.musicList.length).toEqual(1);
    expect(component.musicList[0]).toEqual(artistRow);
  });

});



describe('SearchBarComponent To CardItemComponent Integration', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  const mockSongService = {
    searchSong: jasmine.createSpy('searchSong').and.returnValue(
      of([
        {song_id: 'SONG1', song_name: 'Test Song 1', artists: '{ART123: Test Artist}'},
        {song_id: 'SONG2', song_name: 'Test Song 2', artists: '{ART123: Test Artist}'}
      ])
    )
  };

  const mockArtistService = {
    getArtistsNames: jasmine.createSpy('getArtistsNames').and.returnValue('Test Artist')
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, CardItemComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .overrideComponent(SearchBarComponent, {
      remove: {
        providers: [
          SongService,
          ArtistService
        ]
      },
      add: {
        providers: [
          { provide: SongService, useValue: mockSongService },
          { provide: ArtistService, useValue: mockArtistService }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should display card info when song cards are shown', () => {
    // Arrange
    const music_type: string = "song";
    const query: string = "Test";

    const songRow1: ISearchCard = {id: "SONG1", name: "Test Song 1", type: "song", content: "Test Artist"};
    const songRow2: ISearchCard = {id: "SONG2", name: "Test Song 2", type: "song", content: "Test Artist"};

    // Act
    component.musicType = music_type;
    fixture.detectChanges();
    
    const queryInput = fixture.nativeElement?.querySelector('#musicSearch') as HTMLInputElement;
    queryInput.value = query;
    queryInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const songCards = fixture.nativeElement?.querySelectorAll('.music-card') as NodeListOf<HTMLElement>;

    // Assert
    expect(songCards.length).toEqual(2);

    expect(songCards[0].textContent).toContain(songRow1.name);
    expect(songCards[0].textContent).toContain(songRow1.content);

    expect(songCards[1].textContent).toContain(songRow2.name);
    expect(songCards[1].textContent).toContain(songRow2.content);
  });
});
