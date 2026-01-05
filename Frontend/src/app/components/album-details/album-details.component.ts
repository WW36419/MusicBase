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
  private album_id: string = ''
  public name: string = ''
  public artist_list: Array<IArtist> = []
  public popularity: number = 0
  public image_url: string = ''
  public tracks: Array<ITrack> = []


  constructor(private album_srv: AlbumService, private artist_srv: ArtistService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.album_id = params.get('id');
      
      this.album_srv.getAlbumDetails(this.album_id)
        .subscribe((result: any) => this.setAlbumDetails(result))
      this.album_srv.getTracks(this.album_id)
        .subscribe((result: any) => this.setTracks(result))
    });
  }

  setAlbumDetails(result: any): void {
    if (result != null) {
      this.name = result.name
      this.artist_list = this.artist_srv.transformArtists(result.artists)
      this.popularity = result.popularity
      this.image_url = result.image_url
    }
  }

  setTracks(result:any): void {
    if (result != null) {
      for (let idx in result) {
        this.tracks.push({
          id: result[idx].song_id,
          nr: result[idx].track_number,
          name: result[idx].song_name
        })
      }
    }
  }

}
