import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtistService } from '../../services/music/artist.service';

@Component({
  selector: 'artist-add',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ArtistService],
  templateUrl: './artist-add.component.html',
  styleUrl: './artist-add.component.css'
})
export class ArtistAddComponent {
  artistAddForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    followers: new FormControl(0, Validators.required),
    popularity: new FormControl(0, Validators.required),
    image_url: new FormControl('', Validators.required)
  })

  genreForm = new FormGroup({
    genre: new FormControl('', Validators.required)
  })
  public genres: Array<string> = []


  constructor(private artist_srv: ArtistService, public router: Router) {}

  pushGenre() {
    const genre = this.genreForm.value.genre
    if (genre !== null && genre !== '')
      this.genres.push(genre!)
  }

  addArtist() {
    const artistData = this.artistAddForm.value

    if (this.genres.length > 0) {
      let artist_genres = '['
      this.genres.forEach((genre, idx) => {
        if (idx > 0)
          artist_genres += ', '
        artist_genres += genre
      })
      artist_genres += ']'

      const artist = {
        name: artistData.name,
        followers: artistData.followers+'',
        popularity: artistData.popularity,
        type: artistData.type,
        main_genre: this.genres[0],
        genres: artist_genres,
        image_url: artistData.image_url
      }

      this.artist_srv.addArtist(artist).subscribe(
        (result:any) => {
          if (result.msg === "OK")
            this.router.navigate(['/artist/'+result.artist_id])
          else
            alert(result.msg)
        }
      )
    } else
      alert("Brak gatunków! Dodaj przynajmniej jednego gatunek.")
  }

}
