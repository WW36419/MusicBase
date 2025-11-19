import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITrack } from '../../interfaces/itrack';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private url = 'http://localhost:3100'

  constructor(private http: HttpClient) { }


  searchAlbums(query: string) {
    return this.http.get(this.url + '/api/albums/search?q=' + query)
  }

  getAlbumDetails(albumId: string) {
    return this.http.get(this.url + "/api/album/" + albumId)
  }

  getAlbumName(albumId: string) {
    return this.http.get(this.url + '/api/album/name/' + albumId)
  }

  getImageURL(albumId: string) {
    return this.http.get(this.url + '/api/album/image/' + albumId)
  }

  getTracks(albumId: string) {
    return this.http.get(this.url + '/api/songs/from_album/' + albumId)
  }

  getAlbumsFromArtist(artistId: string) {
    return this.http.get(this.url + '/api/albums/from_artist/' + artistId)
  }


  addAlbum(album: any) {
    return this.http.post(this.url + '/api/album/add', album)
  }

  deleteAlbum(album_id: string) {
    return this.http.delete(this.url + '/api/album/del', {body: {'album_id': album_id}})
  }
}
