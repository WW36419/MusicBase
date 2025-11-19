import { Component } from '@angular/core';
import { SongAddComponent } from '../song-add/song-add.component';
import { SongDeleteComponent } from '../song-delete/song-delete.component';
import { AlbumAddComponent } from '../album-add/album-add.component';
import { AlbumDeleteComponent } from '../album-delete/album-delete.component';
import { ArtistAddComponent } from '../artist-add/artist-add.component';
import { ArtistDeleteComponent } from '../artist-delete/artist-delete.component';

@Component({
  selector: 'admin-panel',
  imports: [SongAddComponent, SongDeleteComponent, AlbumAddComponent, AlbumDeleteComponent, ArtistAddComponent, ArtistDeleteComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
  public showAddSong = false
  public showAddAlbum = false
  public showAddArtist = false
  public showDelSong = false
  public showDelAlbum = false
  public showDelArtist = false

  toggleAddSong() {this.showAddSong = !this.showAddSong}
  toggleAddAlbum() {this.showAddAlbum = !this.showAddAlbum}
  toggleAddArtist() {this.showAddArtist = !this.showAddArtist}
  toggleDelSong() {this.showDelSong = !this.showDelSong}
  toggleDelAlbum() {this.showDelAlbum = !this.showDelAlbum}
  toggleDelArtist() {this.showDelArtist = !this.showDelArtist}
}
