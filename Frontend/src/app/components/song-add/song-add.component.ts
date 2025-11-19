import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SongService } from '../../services/music/song.service';
import { AlbumService } from '../../services/music/album.service';
import { ArtistService } from '../../services/music/artist.service';
import { IArtist } from '../../interfaces/iartist';
import { IAlbum } from '../../interfaces/ialbum';

@Component({
  selector: 'song-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [SongService, ArtistService],
  templateUrl: './song-add.component.html',
  styleUrl: './song-add.component.css'
})
export class SongAddComponent {
  songAddForm = new FormGroup({
    name: new FormControl('', Validators.required),
    release_date: new FormControl('', Validators.required),
    popularity: new FormControl(0, Validators.required),
    explicit: new FormControl(false),
    album_id: new FormControl(''),
    track_number: new FormControl(0)
  })
  public artistPick = new FormGroup({
    artist: new FormControl(null, Validators.required)
  })

  public artists: Array<IArtist> = []
  public searched_artists: Array<IArtist> = []
  public artistQuery: string = ''

  public showAlbumPick: boolean = false
  public proposed_albums: Array<IAlbum> =[]


  constructor(private song_srv: SongService, private album_srv: AlbumService, private artist_srv: ArtistService, public router: Router) {}

  toggleAlbum() {this.showAlbumPick = !this.showAlbumPick}

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

  addArtistToSong() {
    const artist: any = this.artistPick.value.artist
    if (artist !== null && !this.artists.includes(artist)) {
      this.artists.push(artist)

      this.album_srv.getAlbumsFromArtist(artist.id).subscribe((result:any) => {
        if (result !== null)
          result.forEach((row: any) => 
            this.proposed_albums.push({
              id: row.album_id,
              name: row.name,
              date: row.release_date
            })) 
      })
    }
  }

  addSong() {
    const songData = this.songAddForm.value

    if (this.artists.length > 0) {
      let songBillboard = '(' + songData.name + ', '
      let songArtists = '{'
      let songType = this.artists.length == 1 ? 'Solo' : 'Collaboration'

      this.artists.forEach((artist, idx) => {
        if (idx > 0) {
          songBillboard += ', '
          songArtists += ', '
        }
        songBillboard += artist.name
        songArtists += artist.id + ': ' + artist.name
      })

      songBillboard += ')'
      songArtists += '}'

      const song = {
        name: songData.name,
        billboard: songBillboard,
        artists: songArtists,
        popularity: songData.popularity,
        explicit: songData.explicit+'',
        type: songType,
        album_id: songData.album_id === '' ? 'none' : songData.album_id,
        track_number: songData.track_number,
        release_date: songData.release_date,
        release_date_precision: "day"
      }

      this.song_srv.addSong(song).subscribe(
        (result:any) => {
          if (result.msg === "OK")
            this.router.navigate(['/song/'+result.song_id])
          else
            alert(result.msg)
        }
      )
    } else
      alert("Brak artystów! Dodaj przynajmniej jednego artystę.")
  }

}
