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
    this.musicList = [];
    if (this.musicQuery.length <= 2) {
      return;
    }

    let source$;
    switch (this.musicType) {
      case 'song':
        source$ = this.song_srv.searchSong(this.musicQuery);
        break;
      case 'album':
        source$ = this.album_srv.searchAlbums(this.musicQuery);
        break;
      case 'artist':
        source$ = this.artist_srv.searchArtists(this.musicQuery);
        break;
      default:
        return;
    }

    source$.subscribe((result: any) => {
      const list = result as any[];
      
      for (const item of list) {
        let card: ISearchCard;

        switch (this.musicType) {
          case 'song':
            card = {
              id: item.song_id,
              type: 'song',
              name: item.song_name,
              content: this.artist_srv.getArtistsNames(item.artists)
            };
            break;

          case 'album':
            card = {
              id: item.album_id,
              type: 'album',
              name: item.name,
              content: this.artist_srv.getArtistsNames(item.artists)
            };
            break;

          case 'artist':
            card = {
              id: item.artist_id,
              type: 'artist',
              name: item.name,
              content: item.main_genre
            };
            break;

          default:
            continue;
        }

        this.musicList.push(card);
      }
    });
  }
}
