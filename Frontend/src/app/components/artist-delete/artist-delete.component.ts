import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtistService } from '../../services/music/artist.service';
import { IArtist } from '../../interfaces/iartist';

@Component({
  selector: 'artist-delete',
  imports: [FormsModule, ReactiveFormsModule],
  providers: [ArtistService],
  templateUrl: './artist-delete.component.html',
  styleUrl: './artist-delete.component.css'
})
export class ArtistDeleteComponent {
  public artistPick = new FormGroup({
      artist_id: new FormControl(null, Validators.required)
    })
    public searched_artists: Array<IArtist> = []
    public artistQuery: string = ''
  
  
    constructor(private artist_srv: ArtistService) {}
  
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
              name: row.name,
            })
          );
        }
      }
  
      this.searched_artists = []
      if (this.artistQuery.length > 2)
        getArtists(this.artistQuery)
          .then((result: any) => setArtists(result))
    }
  
    deleteArtist() {
      const artist_id: any = this.artistPick.value.artist_id
      if (artist_id !== null)
        this.artist_srv.deleteArtist(artist_id).subscribe(
          (result:any) => {
            if (result.msg === "OK") {
              alert("Usunięto album pomyślnie!")
              location.reload()
            } else
              alert(result.msg)
          }
        )
      else
        alert("Brak ID artysty!")
    }
}
