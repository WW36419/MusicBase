import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { firstValueFrom, of } from 'rxjs';

import { SongService } from './song.service';

describe('SongService', () => {
  let service: SongService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SongService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*

  it('should load song details from backend server', async () => {
    // Arrange
    const songData = {
      song_id: 'SONG123',
      song_name: 'NAME123',
      artists: '{ABC: A1}',
      popularity: 50,
      explicit: 'False',
      song_type: 'Solo',
      album_id: 'ALB123'
    };

    // Act
    const song$ = service.getSongDetails(songData.song_id);
    const songPromise = firstValueFrom(song$);
    const req = httpTesting.expectOne(
      r => r.url.includes('/api/song/'+songData.song_id)
    );
    req.flush(songData);

    // Assert
    expect(req.request.method).toBe('GET');
    expect(await songPromise).toEqual(songData);
  })

  it('should find song using given query', async () => {
    // Arrange
    const songQuery = "poker";
    const songData = {
      song_id: "SONG123",
      song_name: "Poker Face",
      artists: "{ARTIST123: Lady Gaga}"
    };

    // Act
    const song$ = service.searchSong(songQuery);
    const songPromise = firstValueFrom(song$);
    const req = httpTesting.expectOne(
      r => r.url.includes('/api/songs/search')
    );
    req.flush(songData);

    // Assert
    expect(req.request.method).toBe('GET');
    expect(await songPromise).toEqual(songData);
  })

  */

});
