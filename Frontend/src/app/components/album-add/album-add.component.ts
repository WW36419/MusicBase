import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlbumService } from '../../services/music/album.service';
import { SongService } from '../../services/music/song.service';
import { ArtistService } from '../../services/music/artist.service';
import { IArtist } from '../../interfaces/iartist';
import { ISong } from '../../interfaces/isong';

@Component({
  selector: 'album-add',
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  providers: [AlbumService, SongService, ArtistService],
  templateUrl: './album-add.component.html',
  styleUrl: './album-add.component.css'
})
export class AlbumAddComponent {
  albumAddForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    release_date: new FormControl('', Validators.required),
    popularity: new FormControl(0, Validators.required),
    image_url: new FormControl('', Validators.required)
  })

  public artistPick = new FormGroup({
    artist: new FormControl(null, Validators.required)
  })
  public artists: Array<IArtist> = []
  public searched_artists: Array<IArtist> = []
  public artistQuery: string = ''

  public trackPick = new FormGroup({
    track: new FormControl(null, Validators.required)
  })
  public tracks: Array<ISong> = []
  public proposed_tracks: Array<ISong> = []

  constructor(private album_srv: AlbumService, private song_srv: SongService, private artist_srv: ArtistService, public router: Router) {}


  updateSearchedArtists() {
    const getArtists = (query: string): Promise<any> => {
      return new Promise((resolve, reject) =>
        this.artist_srv.searchArtists(query).subscribe(
          (result: any) => resolve(result)
        )
      )
    }
  
    const setArtists = (result: any) => {
      if (result !== null) {
        result.forEach((row: any) => 
          this.searched_artists.push({
            id: row.artist_id,
            name: row.name
          })
        );
      }
    }

    this.searched_artists = []
    if (this.artistQuery.length > 2) {
      getArtists(this.artistQuery)
        .then((result: any) => setArtists(result))
    }
  }

  addArtistToAlbum() {
    const artist: any = this.artistPick.value.artist
    if (artist !== null && !this.artists.includes(artist)) {
      this.artists.push(artist)

      this.song_srv.getSongsFromArtist(artist.id).subscribe((result:any) => {
        if (result !== null)
          result.forEach((row: any) => this.proposed_tracks.push({
            id: row.song_id,
            name: row.song_name,
            artists: [artist]
          })) 
      })
    }
  }


  addTrackToAlbum() {
    const track: any = this.trackPick.value.track
    if (track !== null && !this.tracks.includes(track))
      this.tracks.push(track)
  }


  addAlbum() {
    const albumData = this.albumAddForm.value

    if (this.artists.length > 0) {
      let albumArtists = '{'
      this.artists.forEach((artist, idx) => {
        if (idx > 0)
          albumArtists += ', '
        albumArtists += artist.id + ': ' + artist.name
      })
      albumArtists += '}'

      const track_ids: Array<string> = []
      this.tracks.forEach((track) => track_ids.push(track.id));

      const album = {
        name: albumData.name,
        billboard: albumData.name,
        artists: albumArtists,
        popularity: albumData.popularity,
        song_ids: track_ids,
        total_tracks: track_ids.length,
        type: albumData.type,
        image_url: albumData.image_url,
        artist_id: this.artists[0].id,
        date: albumData.release_date,
        date_precision: "day",
      }

      this.album_srv.addAlbum(album).subscribe(
        (result:any) => {
          if (result.msg === "OK")
            this.router.navigate(['/album/'+result.album_id])
          else
            alert(result.msg)
        }
      )
    } else
      alert("Brak artystów! Dodaj przynajmniej jednego artystę.")
  }

}
