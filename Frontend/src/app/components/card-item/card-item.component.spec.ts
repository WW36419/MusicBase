import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CardItemComponent } from './card-item.component';
import { Location } from '@angular/common';
import { SongDetailsComponent } from '../song-details/song-details.component';
import { AlbumDetailsComponent } from '../album-details/album-details.component';
import { ArtistDetailsComponent } from '../artist-details/artist-details.component';




describe('CardItemComponent Routing Integration', () => {
  let component: CardItemComponent;
  let fixture: ComponentFixture<CardItemComponent>;
  let location: Location;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardItemComponent],
      providers: [provideRouter([
        { path: 'song/:id', component: SongDetailsComponent },
        { path: 'album/:id', component: AlbumDetailsComponent },
        { path: 'artist/:id', component: ArtistDetailsComponent }
      ])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardItemComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
  });
  

  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should navigate to song details page when song card is clicked', fakeAsync(() => {
    // Arrange
    const song_id: string = 'SONG123';
    const music_type: string = 'song';

    // Act
    component.id = song_id;
    component.music_type = music_type;
    fixture.detectChanges();

    const songCard = fixture.nativeElement?.querySelectorAll('.music-card')[0] as HTMLElement;
    songCard.click();
    tick();

    // Assert
    expect(location.path()).toBe('/song/'+song_id);
  }));

  it('should navigate to album details page when album card is clicked', fakeAsync(() => {
    // Arrange
    const album_id: string = 'ALB123';
    const music_type: string = 'album';

    // Act
    component.id = album_id;
    component.music_type = music_type;
    fixture.detectChanges();

    const albumCard = fixture.nativeElement?.querySelectorAll('.music-card')[0] as HTMLElement;
    albumCard.click();
    tick();

    // Assert
    expect(location.path()).toBe('/album/'+album_id);
  }));

  it('should navigate to artist details page when artist card is clicked', fakeAsync(() => {
    // Arrange
    const artist_id: string = 'ART123';
    const music_type: string = 'artist';

    // Act
    component.id = artist_id;
    component.music_type = music_type;
    fixture.detectChanges();

    const artistCard = fixture.nativeElement?.querySelectorAll('.music-card')[0] as HTMLElement;
    artistCard.click();
    tick();

    // Assert
    expect(location.path()).toBe('/artist/'+artist_id);
  }));
});
