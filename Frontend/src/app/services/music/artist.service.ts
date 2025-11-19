import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IArtist } from '../../interfaces/iartist';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private url = 'http://localhost:3100'

  constructor(private http: HttpClient) { }


  searchArtists(query: string) {
    return this.http.get(this.url + '/api/artists/search?q=' + query)
  }

  getArtistDetails(artistId: string) {
    return this.http.get(this.url + '/api/artist/' + artistId)
  }

  getImageURL(artistId: string | any) {
    return this.http.get(this.url + '/api/artist/image/' + artistId)
  }

  checkArtist(artist_id: string) {
    return this.http.get(this.url + '/api/artist/check/' + artist_id)
  }


  addArtist(artist: any) {
    return this.http.post(this.url + '/api/artist/add', artist)
  }

  deleteArtist(artist_id: string) {
    return this.http.delete(this.url + '/api/artist/del', {body: {'artist_id': artist_id}})
  }


  transformArtists(artists_txt: string): Array<IArtist> {
    if (artists_txt === '') 
      return []
    //console.log(artists_txt)

    const artists: Array<IArtist> = []
    const artist_list: Array<string> = artists_txt!.replace(/{|}/gi, '').split(', ')
    for (let idx in artist_list) {
      let artist_spl = artist_list[idx].split(': ')
      artists.push({
        id: artist_spl[0],
        name: artist_spl[1]
      })
    }
    return artists
  }

  getArtistsNames(artists_txt: string): string {
    if (artists_txt === '') 
      return ''

    const artists: Array<IArtist> = this.transformArtists(artists_txt)
    let artists_names = ''
    for (let idx in artists) {
      artists_names += artists[idx].name
      if (parseInt(idx) < artists.length-1)
        artists_names += ', '
    }

    return artists_names
  }
}
