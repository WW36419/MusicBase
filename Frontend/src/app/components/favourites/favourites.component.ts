import { Component, OnInit } from '@angular/core';
import { SongItemComponent } from '../song-item/song-item.component';
import { AuthService } from '../../services/userbase/auth.service';
import { SongService } from '../../services/music/song.service';
import { ArtistService } from '../../services/music/artist.service';
import { ISongCard } from '../../interfaces/isong-card';

@Component({
  selector: 'favourites',
  imports: [SongItemComponent],
  providers: [AuthService, SongService, ArtistService],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent {
  public fav_songs$: Array<ISongCard> = [];
  private userId: string

  constructor(private auth_srv: AuthService, private song_srv: SongService, private artist_srv: ArtistService) {
    this.userId = this.auth_srv.currentUser.userId;
  }

  ngOnInit(): void {
    this.song_srv.getFavouriteSongs(this.userId).subscribe(
      (result: any) => this.setFavouriteSongs(result)
    )
  }

  setFavouriteSongs(result: any) {
    result.forEach((item: any) => {
      this.fav_songs$.push({
        id: item.song_id,
        name: item.song_name,
        artists: this.artist_srv.transformArtists(item.artists),
        explicit: item.explicit,
        album_id: item.album_id
      })
    });
  }
}
