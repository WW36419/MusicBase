import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AlbumService } from '../../services/music/album.service';
import { ArtistService } from '../../services/music/artist.service';
import { IArtist } from '../../interfaces/iartist';
import { ITrack } from '../../interfaces/itrack';
import { ArtistCheckPipe } from '../../pipes/artist-check.pipe';
import { CardItemComponent } from "../card-item/card-item.component";

@Component({
  selector: 'album-details',
  imports: [CommonModule, RouterModule, HttpClientModule, ArtistCheckPipe, CardItemComponent],
  providers: [AlbumService, ArtistService],
  templateUrl: './album-details.component.html',
  styleUrl: './album-details.component.css'
})
export class AlbumDetailsComponent implements OnInit {
  public name: string = ''
  public artist_list: Array<IArtist> = []
  public popularity: number = 0
  public image_url: string = ''
  public tracks: Array<ITrack> = []


  constructor(private album_srv: AlbumService, private artist_srv: ArtistService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    let id: string = '';
    this.route.paramMap.subscribe((params: any) => {
      id = params.get('id');
    });

    this.getAlbumDetails(id)
      .then((result: any) => this.setAlbumDetails(result))
    this.getTracks(id)
      .then((result: any) => this.setTracks(result))
  }

  async getAlbumDetails(albumId: string): Promise<any> {
    return new Promise((resolve, reject) =>
      this.album_srv.getAlbumDetails(albumId).subscribe(
        (result: any) => resolve(result)
      )
    )
  }

  setAlbumDetails(result: any): void {
    this.name = result.name
    this.artist_list = this.artist_srv.transformArtists(result.artists)
    this.popularity = result.popularity
    this.image_url = result.image_url
  }


  async getTracks(albumId: string): Promise<any> {
    return new Promise((resolve, reject) =>
      this.album_srv.getTracks(albumId).subscribe(
        (result: any) => resolve(result)
      )
    )
  }

  setTracks(result:any): void {
    for (let idx in result) {
      this.tracks.push({
        id: result[idx].song_id,
        nr: result[idx].track_number,
        name: result[idx].song_name
      })
    }
  }
}
