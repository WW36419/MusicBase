import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardItemComponent } from '../card-item/card-item.component';
import { SongService } from '../../services/music/song.service';
import { ArtistService } from '../../services/music/artist.service';
import { AlbumService } from '../../services/music/album.service';
import { ISearchCard } from '../../interfaces/isearch-card';


@Component({
  selector: 'search-bar',
  imports: [FormsModule, CardItemComponent],
  providers: [SongService, ArtistService, AlbumService],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css' 
})
export class SearchBarComponent {
  public musicType: string = ''
   public musicQuery: string = '' 
  public musicList: Array<ISearchCard> = []


  constructor(private song_srv: SongService, private artist_srv: ArtistService, private album_srv: AlbumService) {}

  updateMusicList() {
    const getMusicData = (query: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        switch (this.musicType) {
          case 'song':
            this.song_srv.searchSong(query).subscribe(
              (result: any) => resolve(result)
            )
            break;
          case 'album':
            this.album_srv.searchAlbums(query).subscribe(
              (result: any) => resolve(result)
            )
            break;
          case 'artist':
            this.artist_srv.searchArtists(query).subscribe(
              (result: any) => resolve(result)
            )
            break;
        }
      })
    }

    const setMusicData = (result: any) => {
      for (let idx in result) {

        let musicId = ''
        let musicName = ''
        let musicContent = ''

        switch (this.musicType) {
          case 'song':
            musicId = result[idx].song_id
            musicName = result[idx].song_name
            musicContent = this.artist_srv.getArtistsNames(result[idx].artists)
            break;
          case 'album':
            musicId = result[idx].album_id
            musicName = result[idx].name
            musicContent = this.artist_srv.getArtistsNames(result[idx].artists)
            break;
          case 'artist':
            musicId = result[idx].artist_id
            musicName = result[idx].name
            musicContent = result[idx].main_genre
            break;
        }
  
        this.musicList.push({
          id: musicId,
          type: this.musicType,
          name: musicName,
          content: musicContent
        })
      }
    }


    this.musicList = []
    if (this.musicQuery.length > 2) {
      getMusicData(this.musicQuery)
        .then((result: any) => setMusicData(result))
    }
  }
}
