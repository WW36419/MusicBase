import { Component, OnInit } from '@angular/core';
import { SongService } from '../../services/music/song.service';
import { ArtistService } from '../../services/music/artist.service';
import { SongItemComponent } from '../song-item/song-item.component';
import { ISongCard } from '../../interfaces/isong-card';

@Component({
  selector: 'top10-songs-all',
  imports: [SongItemComponent],
  providers: [SongService, ArtistService],
  templateUrl: './top10-songs-all.component.html',
  styleUrl: './top10-songs-all.component.css'
})
export class Top10SongsAllComponent implements OnInit {
  public top10_songs$: Array<ISongCard> = []

  constructor(private song_srv: SongService, private artist_srv: ArtistService) {}

  ngOnInit(): void {
    this.getTop10Songs()
      .then((result: any) => this.setTop10Songs(result))
  }

  getTop10Songs() {
    return new Promise((resolve, reject) =>
      this.song_srv.getTop10All().subscribe(
        (result: any) => resolve(result)
      )
    )
  }

  setTop10Songs(result: any) {
    result.forEach((item: any) => {
      this.top10_songs$.push({
        id: item.song_id,
        name: item.song_name,
        artists: this.artist_srv.transformArtists(item.artists),
        explicit: item.explicit,
        album_id: item.album_id
      })
    });
  }
}
