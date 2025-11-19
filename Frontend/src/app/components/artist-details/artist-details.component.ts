import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CardItemComponent } from "../card-item/card-item.component";
import { AlbumService } from '../../services/music/album.service';
import { ArtistService } from '../../services/music/artist.service';
import { SongService } from '../../services/music/song.service';
import { IAlbum } from '../../interfaces/ialbum';
import { ISong } from '../../interfaces/isong';


@Component({
  selector: 'artist-details',
  imports: [HttpClientModule, CardItemComponent],
  providers : [AlbumService, ArtistService, SongService],
  templateUrl: './artist-details.component.html',
  styleUrl: './artist-details.component.css'
})
export class ArtistDetailsComponent implements OnInit {
  public name: string = ''
  public type: string = ''
  public genre: string = ''
  public followers: string = ''
  public popularity: number = 0
  public image_url: string = ''

  public top_songs: Array<ISong> = []
  public albums: Array<IAlbum> = []


  constructor(private song_srv: SongService, private album_srv: AlbumService, private artist_srv: ArtistService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    let id: string = '';
    this.route.paramMap.subscribe((params: any) => {
      id = params.get('id');
    });

    this.getArtistDetails(id)
      .then((result: any) => this.setArtistDetails(result))
    this.getTopSongs(id)
      .then((result: any) => this.setTopSongs(result))
    this.getAlbums(id)
      .then((result: any) => this.setAlbums(result))
  }

  async getArtistDetails(artistId: string): Promise<any> {
    return new Promise((resolve, reject) =>
      this.artist_srv.getArtistDetails(artistId).subscribe(
        (result: any) => resolve(result)
      )
    )
  }

  setArtistDetails(result: any): void {
    this.name = result.name
    this.type = result.artist_type
    this.genre = result.main_genre
    this.followers = result.followers
    this.popularity = result.popularity
    this.image_url = result.image_url
  }


  async getTopSongs(artistId: string): Promise<any> {
    return new Promise((resolve, reject) =>
      this.song_srv.getSongsFromArtist(artistId).subscribe(
        (result: any) => resolve(result)
      )
    )
  }

  setTopSongs(result: any): void {
    for (let idx in result) {
      this.top_songs.push({
        id: result[idx].song_id,
        name: result[idx].song_name,
        artists: []
      })
    }
  }


  async getAlbums(artistId: string): Promise<any> {
    return new Promise((resolve, reject) =>
      this.album_srv.getAlbumsFromArtist(artistId).subscribe(
        (result: any) => resolve(result)
      )
    )
  }

  setAlbums(result: any): void {
    for (let idx in result) {
      this.albums.push({
        id: result[idx].album_id,
        name: result[idx].name,
        date: result[idx].release_date
      })
    }
  }

}
