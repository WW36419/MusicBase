import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SongService } from '../../services/music/song.service';
import { ArtistService } from '../../services/music/artist.service';
import { ISong } from '../../interfaces/isong';

@Component({
  selector: 'song-delete',
  imports: [FormsModule, ReactiveFormsModule],
  providers: [SongService, ArtistService],
  templateUrl: './song-delete.component.html',
  styleUrl: './song-delete.component.css'
})
export class SongDeleteComponent {
  public songPick = new FormGroup({
    song_id: new FormControl(null, Validators.required)
  })
  public searched_songs: Array<ISong> = []
  public songQuery: string = ''


  constructor(private song_srv: SongService, private artist_srv: ArtistService) {}

  updateSearchedSong() {
    const getSongs = (query: string): Promise<any> => {
      return new Promise((resolve, reject) =>
        this.song_srv.searchSong(query).subscribe(
          (result: any) => resolve(result)
        )
      )
    }
  
    const setSongs = (result: any) => {
      if (result !== null) {
        result.forEach((row: any) => 
          this.searched_songs.push({
            id: row.song_id,
            name: row.song_name,
            artists: this.artist_srv.transformArtists(row.artists)
          })
        );
      }
    }

    this.searched_songs = []
    if (this.songQuery.length > 2)
      getSongs(this.songQuery)
        .then((result: any) => setSongs(result))
  }

  deleteSong() {
    const song_id: any = this.songPick.value.song_id
    if (song_id !== null)
      this.song_srv.deleteSong(song_id).subscribe(
        (result:any) => {
          if (result.msg === "OK") {
            alert("Usunięto piosenkę pomyślnie!")
            location.reload()
          } else
            alert(result.msg)
        }
      )
    else
      alert("Brak ID piosenki!")
  }

}
