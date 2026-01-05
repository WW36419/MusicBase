import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SongService } from '../../services/music/song.service';
import { AlbumService } from '../../services/music/album.service';
import { ArtistService } from '../../services/music/artist.service';
import { AuthService } from '../../services/userbase/auth.service';
import { ArtistCheckPipe } from '../../pipes/artist-check.pipe';
import { IArtist } from '../../interfaces/iartist';

import { map, filter, switchMap } from 'rxjs';


@Component({
  selector: 'song-details',
  imports: [CommonModule, RouterModule, HttpClientModule, ArtistCheckPipe],
  providers: [SongService, AlbumService, ArtistService, AuthService],
  templateUrl: './song-details.component.html',
  styleUrl: './song-details.component.css'
})
export class SongDetailsComponent implements OnInit {
  public name: string = ''
  public artists: string = ''
  public release_date: string = ''
  public popularity: number = 0
  public explicit: string = ''
  public song_type: string = ''
  public album_id: string = ""
  public album_name: string = ""

  public image_url: any = 'https://www.clipartbest.com/cliparts/Kcj/ok7/Kcjok7pji.jpeg'
  public artist_list: Array<IArtist> = []

  public isFavourite: boolean = false

  public user_id: string = ''
  private song_id: string = ''


  constructor(private song_srv: SongService, private album_srv: AlbumService, private artist_srv: ArtistService, private auth_srv: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.auth_srv.isLoggedIn()) {
      this.user_id = this.auth_srv.currentUser.userId;
    }

    this.route.paramMap
    .pipe(
      map(params => params.get('id')),
      filter((id): id is string => !!id),
      switchMap(id => {
        this.song_id = id;
        return this.song_srv.getSongDetails(id);
      })
    )
    .subscribe(result => {
      this.setSongDetails(result);
      this.getAlbumName();
      this.getImageURL();

      if (this.user_id) {
        this.checkSongInFavourites();
      }
    });
  }

  async getSongDetails(songId: string): Promise<any> {
    return new Promise((resolve, reject) =>
      this.song_srv.getSongDetails(songId).subscribe(
        (result: any) => resolve(result)
      )
    )
  }

  setSongDetails(result: any): void {
    if (result != null) {
      this.name = result.song_name
      this.artists = result.artists
      this.release_date = result.release_date
      this.popularity = result.popularity
      this.explicit = result.explicit
      this.song_type = result.song_type
      this.album_id = result.album_id

      this.artist_list = this.artist_srv.transformArtists(this.artists)
    }
  }

  getAlbumName() : void {
    this.album_srv.getAlbumName(this.album_id!).subscribe((response: any | string) =>
      this.album_name = response
    )
  }

  getImageURL(): void {
    this.album_srv.getImageURL(this.album_id!).subscribe(response => {
      if (response != null)
        this.image_url = response
      else
        this.artist_srv.getImageURL(this.artist_list[0].id).subscribe(response_art => {
          if (response_art !== null)
            this.image_url = response_art
        })
    })
  }

  checkSongInFavourites() {
    this.song_srv.checkFavouriteSong(this.user_id, this.song_id).subscribe((result: any) => {
      if (result.msg === "OK")
        this.isFavourite = true
    })
  }


  addToFavourites() {
    this.song_srv.addFavouriteSong(this.user_id, this.song_id).subscribe((result: any) => {
      if (result.msg === "OK")
        location.reload()
      else
        alert("Nie udało się dodać piosenki do polubionych!")
    })
  }

  delFromFavourites() {
    this.song_srv.delFavouriteSong(this.user_id, this.song_id).subscribe((result: any) => {
      if (result.msg === "OK")
        location.reload()
      else
        alert("Nie udało się usunąć piosenki do polubionych!")
    })
  }
}
