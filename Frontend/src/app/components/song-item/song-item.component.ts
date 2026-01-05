import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShortenTextPipe } from '../../pipes/shorten-text.pipe';
import { AlbumService } from '../../services/music/album.service';
import { ArtistService } from '../../services/music/artist.service';
import { IArtist } from '../../interfaces/iartist';

@Component({
  selector: 'song-item',
  imports: [CommonModule, RouterModule, ShortenTextPipe],
  providers: [AlbumService, ArtistService],
  templateUrl: './song-item.component.html',
  styleUrl: './song-item.component.css'
})
export class SongItemComponent implements OnInit {
  @Input() songId?: string;
  @Input() songName?: string;
  @Input() albumId?: string; 
  @Input() artists?: Array<IArtist>;
  @Input() explicit?: string;

  public image_url: any = 'https://www.clipartbest.com/cliparts/Kcj/ok7/Kcjok7pji.jpeg'

  constructor(private album_srv: AlbumService, private artist_srv: ArtistService) {}

  ngOnInit(): void {
    this.getImageURL()
  }

  getImageURL(): void {
    let isUrlChanged: boolean = false;

    if (this.albumId! != null)
      this.album_srv.getImageURL(this.albumId!).subscribe(response => {
        if (response !== null) {
          this.image_url = response
          isUrlChanged = true;
        }
      })
    
    if (!isUrlChanged && this.artists != null) 
      this.artist_srv.getImageURL(this.artists![0].id).subscribe(response => {
        if (response !== null)
          this.image_url = response
      })
  }
}
