import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '../../interfaces/iresponse';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private url = 'http://localhost:3100'

  constructor(private http: HttpClient) {}


  searchSong(query: string) {
    return this.http.get(this.url + '/api/songs/search?q=' + query)
  }

  getTop10All() {
    return this.http.get(this.url + '/api/songs/top10/all')
  }

  getSongDetails(songId: string) {
    return this.http.get(this.url + '/api/song/' + songId)
  }

  getSongsFromArtist(artistId: string) {
    return this.http.get(this.url + '/api/songs/from_artist/' + artistId)
  }

  getFavouriteSongs(user_id: string) {
    return this.http.get(this.url + '/api/songs/favourites/user/' + user_id)
  }

  checkFavouriteSong(user_id: string, song_id: string): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/api/song/favourites/check/' + song_id + '/user/' + user_id)
  }


  addSong(song: any) {
    return this.http.post(this.url + '/api/song/add', song)
  }

  addFavouriteSong(user_id: string, song_id: string) {
    const fav_song = {
      'user_id': user_id,
      'song_id': song_id
    }
    return this.http.post(this.url + '/api/song/to_favourites', fav_song)
  }


  deleteSong(song_id: string) {
    return this.http.delete(this.url + '/api/song/del', {body: {'song_id': song_id}})
  }

  delFavouriteSong(user_id: string, song_id: string) {
    const fav_song = {
      'user_id': user_id,
      'song_id': song_id
    }
    return this.http.delete(this.url + '/api/song/from_favourites', {body: fav_song})
  }
}
