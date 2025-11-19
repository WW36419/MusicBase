import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlbumService } from '../../services/music/album.service';
import { ArtistService } from '../../services/music/artist.service';
import { ISong } from '../../interfaces/isong';

@Component({
  selector: 'album-delete',
  imports: [FormsModule, ReactiveFormsModule],
  providers: [AlbumService],
  templateUrl: './album-delete.component.html',
  styleUrl: './album-delete.component.css'
})
export class AlbumDeleteComponent {
  public albumPick = new FormGroup({
    album_id: new FormControl(null, Validators.required)
  })
  public searched_albums: Array<ISong> = []
  public albumQuery: string = ''


  constructor(private album_srv: AlbumService, private artist_srv: ArtistService) {}

  updateSearchedAlbums() {
    const getAlbums = (query: string): Promise<any> => {
      return new Promise((resolve, reject) =>
        this.album_srv.searchAlbums(query).subscribe(
          (result: any) => resolve(result)
        )
      )
    }
  
    const setAlbums = (result: any) => {
      if (result !== null) {
        result.forEach((row: any) => 
          this.searched_albums.push({
            id: row.album_id,
            name: row.name,
            artists: this.artist_srv.transformArtists(row.artists)
          })
        );
      }
    }

    this.searched_albums = []
    if (this.albumQuery.length > 2)
      getAlbums(this.albumQuery)
        .then((result: any) => setAlbums(result))
  }

  deleteAlbum() {
    const album_id: any = this.albumPick.value.album_id
    if (album_id !== null)
      this.album_srv.deleteAlbum(album_id).subscribe(
        (result:any) => {
          if (result.msg === "OK") {
            alert("Usunięto album pomyślnie!")
            location.reload()
          } else
            alert(result.msg)
        }
      )
    else
      alert("Brak ID albumu!")
  }
}
